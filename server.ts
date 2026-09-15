import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware for parsing JSON with increased limit for base64 images
app.use(express.json({ limit: '25mb' }));

// Lazy Google GenAI Client helper
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not configured.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const WORKER_BASE_URL = 'https://tengteed.tontakankeawpang321.workers.dev';

// Resilient helper to handle temporary 503/429 high demand with automatic model fallback
async function generateWithFallback(
  ai: GoogleGenAI,
  params: {
    contents: any[];
    config?: any;
  }
) {
  // Valid active models (excluding deprecated 2.5 models that return 404)
  const candidateModels = [
    'gemini-3.7-flash',
    'gemini-3.6-flash',
    'gemini-3.5-flash-lite',
    'gemini-3.1-flash-lite',
    'gemini-flash-latest',
  ];
  let lastError: any = null;

  for (const model of candidateModels) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: params.contents,
          config: params.config,
        });
        if (response && (response.text || (response as any).candidates)) {
          return response;
        }
      } catch (err: any) {
        lastError = err;
        const errMsg = String(err?.message || '').toLowerCase();
        const statusCode = err?.status || err?.code || 0;
        const isTransient =
          statusCode === 503 ||
          statusCode === 429 ||
          errMsg.includes('503') ||
          errMsg.includes('429') ||
          errMsg.includes('high demand') ||
          errMsg.includes('unavailable') ||
          errMsg.includes('resource_exhausted') ||
          errMsg.includes('overloaded');

        const isNotFound = statusCode === 404 || errMsg.includes('404') || errMsg.includes('not found') || errMsg.includes('no longer available');

        console.warn(`[Gemini API] Model ${model} (attempt ${attempt + 1}) encountered issue: ${err.message || err}`);

        if (isNotFound) {
          // If model is not found, skip immediate retry and switch to next candidate model
          break;
        }

        if (isTransient) {
          // Pause with exponential backoff before retrying or switching models
          await new Promise((resolve) => setTimeout(resolve, 600 * (attempt + 1)));
        } else {
          break;
        }
      }
    }
  }

  throw lastError;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// AI Chatbot endpoint for technical analysis and candlestick coaching
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    // 1. First attempt: Connect to user's Cloudflare Worker
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      const workerRes = await fetch(`${WORKER_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history, model: 'gemini-3.7-flash' }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (workerRes.ok) {
        const workerData: any = await workerRes.json();
        if (workerData && (workerData.reply || workerData.response || workerData.text)) {
          return res.json({ reply: workerData.reply || workerData.response || workerData.text });
        }
      }
    } catch (workerErr) {
      console.warn('[Worker Proxy] Cloudflare worker chat fallback engaged:', workerErr);
    }

    // 2. Direct Fallback: Google GenAI client with auto-retry and multi-model fallback
    const ai = getGeminiClient();

    const systemInstruction = `คุณคือ "AI Candlestick & Technical Analyst" ผู้เชี่ยวชาญด้านการวิเคราะห์กราฟแท่งเทียน (Candlestick Patterns), Price Action, Smart Money Concepts (SMC), Order Block, Fair Value Gap (FVG), และการบริหารความเสี่ยง (Risk Management) สำหรับการเทรด Forex, หุ้นไทย, TFEX, และ Crypto
หลักการตอบคำถาม:
1. ตอบเป็นภาษาไทยที่กระชับ ชัดเจน เป็นมืออาชีพ พร้อมอธิบายจิตวิทยาตลาดเบื้องหลังแท่งเทียนเสมอ
2. บอกจุดเข้า Entry, Stop Loss (SL), และ Take Profit (TP) ที่ปลอดภัย พร้อม Risk:Reward Ratio (RR)
3. ให้คำแนะนำเรื่อง Timeframe (TF) ที่เหมาะสม และการรอแท่งเทียนยืนยัน (Confirmation)
4. ใช้สัญลักษณ์ Bullet point และ Formatting ให้อ่านง่ายบนมือถือ`;

    // Construct conversation history for Gemini
    const contents: any[] = [];

    if (Array.isArray(history) && history.length > 0) {
      history.forEach((h: { role: string; text: string }) => {
        contents.push({
          role: h.role === 'model' || h.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: h.text }],
        });
      });
    }

    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await generateWithFallback(ai, {
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || 'ขออภัย ไม่สามารถประมวลผลคำตอบได้ในขณะนี้';
    res.json({ reply });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    const isOverload =
      error?.status === 503 ||
      error?.status === 429 ||
      String(error?.message || '').toLowerCase().includes('high demand') ||
      String(error?.message || '').toLowerCase().includes('unavailable');

    res.status(isOverload ? 503 : 500).json({
      error: isOverload
        ? 'เซิร์ฟเวอร์ AI กำลังมีผู้ใช้งานจำนวนมากชั่วคราว ระบบกำลังเร่งจัดการ กรุณารอสักครู่แล้วส่งข้อความใหม่อีกครั้ง'
        : (error.message || 'เกิดข้อผิดพลาดในการประมวลผลคำขอจาก AI Analyst'),
    });
  }
});

// AI Chart & Candlestick Image Scanner endpoint
app.post('/api/scan-chart', async (req, res) => {
  try {
    const { imageBase64 } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: 'Image data is required.' });
    }

    // 1. First attempt: Connect to user's Cloudflare Worker
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);
      const workerRes = await fetch(`${WORKER_BASE_URL}/api/scan-chart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64, model: 'gemini-3.7-flash' }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (workerRes.ok) {
        const workerData: any = await workerRes.json();
        if (workerData && (workerData.result || workerData.data)) {
          return res.json({ result: workerData.result || workerData.data });
        }
      }
    } catch (workerErr) {
      console.warn('[Worker Proxy] Cloudflare worker scan fallback engaged:', workerErr);
    }

    // 2. Direct Fallback: Google GenAI client with auto-retry and multi-model fallback
    const ai = getGeminiClient();

    // Extract base64 data and mime type
    let mimeType = 'image/jpeg';
    let base64Data = imageBase64;

    if (imageBase64.includes(';base64,')) {
      const parts = imageBase64.split(';base64,');
      mimeType = parts[0].replace('data:', '') || 'image/jpeg';
      base64Data = parts[1];
    }

    const prompt = `คุณคือ AI ผู้เชี่ยวชาญการสแกนและวิเคราะห์แท่งเทียนและโครงสร้างกราฟ (Price Action & Technical Analysis)
กรุณาวิเคราะห์รูปภาพกราฟ/แท่งเทียนที่ส่งมานี้ และส่งผลลัพธ์กลับมาเป็น JSON ตามโครงสร้างนี้เท่านั้น (ห้ามใส่ Markdown code block ครอบ หรือส่ง JSON เพียวๆ):
{
  "patternName": "ชื่อรูปแบบแท่งเทียนหรือชาร์ตแพทเทิร์นภาษาไทยและอังกฤษ เช่น Bullish Engulfing (แท่งเทียนกลืนกินขาขึ้น)",
  "confidence": 88,
  "sentiment": "Bullish" | "Bearish" | "Neutral",
  "analysis": "คำอธิบายพฤติกรรมราคาและแท่งเทียนที่ตรวจพบอย่างละเอียด พร้อมจิตวิทยาตลาด",
  "entrySuggestion": "จุดเข้าเทรดที่เหมาะสม เช่น เมื่อแท่งเทียนปิดเขียวเหนือแนวต้าน",
  "stopLossSuggestion": "จุดตัดขาดทุน (SL) เช่น ใต้จุดต่ำสุดของแท่ง Engulfing",
  "advice": "คำแนะนำเพิ่มเติมในการบริหารความเสี่ยงและ Timeframe ที่แนะนำ"
}`;

    const response = await generateWithFallback(ai, {
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: mimeType as any,
              },
            },
            { text: prompt },
          ],
        },
      ],
      config: {
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text || '{}';
    let parsedResult;
    try {
      parsedResult = JSON.parse(responseText);
    } catch {
      // Fallback cleanup in case of markdown block
      const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedResult = JSON.parse(cleanJson);
    }

    res.json({ result: parsedResult });
  } catch (error: any) {
    console.error('Scan Chart API Error:', error);
    const isOverload =
      error?.status === 503 ||
      error?.status === 429 ||
      String(error?.message || '').toLowerCase().includes('high demand') ||
      String(error?.message || '').toLowerCase().includes('unavailable');

    res.status(isOverload ? 503 : 500).json({
      error: isOverload
        ? 'โมเดล AI กำลังมีผู้ใช้งานหนาแน่นชั่วคราว กรุณากดปุ่ม "เริ่มวิเคราะห์อีกครั้ง" ในอีกสักครู่'
        : (error.message || 'ไม่สามารถวิเคราะห์ภาพกราฟได้ กรุณาตรวจสอบรูปภาพและลองใหม่อีกครั้ง'),
    });
  }
});

// Vite & Static file serving
async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Candlestick Library Server running on http://0.0.0.0:${PORT}`);
  });
}

setupServer();
