import { ChartScanResult } from '../types';

/**
 * Cloudflare Worker API Endpoint
 * Provides direct client-side access with CORS enabled, allowing the application
 * to run seamlessly on GitHub Pages, static hosts, or local/container environments.
 */
export const CLOUDFLARE_WORKER_URL =
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_WORKER_API_URL) ||
  'https://tengteed.tontakankeawpang321.workers.dev';

export interface WorkerStatus {
  online: boolean;
  model?: string;
  url: string;
}

/**
 * Checks the status of the Cloudflare Worker API
 */
export async function checkWorkerHealth(): Promise<WorkerStatus> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(`${CLOUDFLARE_WORKER_URL}/`, {
      method: 'GET',
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return {
        online: true,
        model: data.activeModel || 'gemini-3.6-flash',
        url: CLOUDFLARE_WORKER_URL,
      };
    }
  } catch (err) {
    console.warn('[Worker Health] Could not reach worker directly:', err);
  }

  return {
    online: false,
    url: CLOUDFLARE_WORKER_URL,
  };
}

/**
 * Scans a candlestick/chart image using the Cloudflare Worker API.
 * Designed to work seamlessly when deployed on GitHub Pages or static hosts,
 * with automatic fallback to local /api/scan-chart when running in fullstack container.
 */
export async function scanChartWithWorker(imageBase64: string): Promise<ChartScanResult> {
  let lastError: Error | null = null;

  // 1. First Attempt: Direct call to Cloudflare Worker (works on GitHub Pages & static hosting via CORS)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    const workerRes = await fetch(`${CLOUDFLARE_WORKER_URL}/api/scan-chart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imageBase64,
        model: 'gemini-3.6-flash',
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (workerRes.ok) {
      const data = await workerRes.json();
      if (data && (data.result || data.data)) {
        return normalizeScanResult(data.result || data.data);
      }
    } else {
      console.warn(`[Worker API] Received status ${workerRes.status}, trying fallback proxy...`);
    }
  } catch (err: any) {
    console.warn('[Worker API] Direct connection failed, trying local proxy fallback:', err);
    lastError = err;
  }

  // 2. Secondary Attempt: Fallback to local Express proxy endpoint (/api/scan-chart)
  // if running in a full-stack container environment
  try {
    const localRes = await fetch('/api/scan-chart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64 }),
    });

    if (localRes.ok) {
      const localData = await localRes.json();
      if (localData && (localData.result || localData.data)) {
        return normalizeScanResult(localData.result || localData.data);
      }
      if (localData.error) {
        throw new Error(localData.error);
      }
    }
  } catch (localErr: any) {
    console.warn('[Local Proxy] Fallback also failed:', localErr);
    if (!lastError) lastError = localErr;
  }

  throw (
    lastError ||
    new Error('ไม่สามารถเชื่อมต่อระบบวิเคราะห์กราฟได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ตแล้วลองใหม่อีกครั้ง')
  );
}

/**
 * Sends a chat message to the Cloudflare Worker API.
 * Automatically handles CORS on GitHub Pages and static deployments.
 */
export async function chatWithWorker(
  message: string,
  history: Array<{ role: string; text?: string; content?: string }> = []
): Promise<string> {
  const formattedHistory = history.map((item) => ({
    role: item.role === 'assistant' || item.role === 'model' ? 'model' : 'user',
    text: item.text || item.content || '',
  }));

  // 1. Direct call to Cloudflare Worker
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 18000);

    const workerRes = await fetch(`${CLOUDFLARE_WORKER_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        history: formattedHistory,
        model: 'gemini-3.6-flash',
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (workerRes.ok) {
      const data = await workerRes.json();
      const reply = data.reply || data.response || data.text;
      if (reply) return reply;
    }
  } catch (workerErr) {
    console.warn('[Worker Chat] Direct call failed, trying local proxy fallback:', workerErr);
  }

  // 2. Secondary Attempt: Local proxy endpoint
  const localRes = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history: formattedHistory }),
  });

  const localData = await localRes.json();
  if (!localRes.ok || localData.error) {
    throw new Error(localData.error || 'ไม่สามารถติดต่อ AI Analyst ได้ในขณะนี้');
  }

  return localData.reply || 'ขออภัย ไม่สามารถประมวลผลคำตอบได้ในขณะนี้';
}

/**
 * Normalizes scan result from worker or proxy into standard ChartScanResult
 */
function normalizeScanResult(raw: any): ChartScanResult {
  let sentiment: 'Bullish' | 'Bearish' | 'Neutral' = 'Neutral';
  const rawSentiment = String(raw.sentiment || raw.signal || '').toLowerCase();
  if (rawSentiment.includes('bull') || rawSentiment.includes('buy') || rawSentiment.includes('ขึ้น')) {
    sentiment = 'Bullish';
  } else if (rawSentiment.includes('bear') || rawSentiment.includes('sell') || rawSentiment.includes('ลง')) {
    sentiment = 'Bearish';
  }

  let confidence = 85;
  if (typeof raw.confidence === 'number' && !isNaN(raw.confidence)) {
    confidence = Math.min(100, Math.max(0, Math.round(raw.confidence)));
  }

  const patternName = raw.patternName || raw.pattern || 'ไม่พบรูปแบบกราฟที่แน่ชัด';
  const analysis = raw.analysis || raw.summary || 'ทำการวิเคราะห์พฤติกรรมราคาและแท่งเทียนเรียบร้อย';

  const entry =
    raw.entrySuggestion ||
    raw.entry ||
    raw.suggestedAction ||
    'รอแท่งเทียนยืนยัน (Confirmation Candle) ก่อนเปิดออเดอร์';

  const stopLoss =
    raw.stopLossSuggestion ||
    raw.stopLoss ||
    raw.keyLevels ||
    'ตั้ง Stop Loss ใต้แนวรับ (กรณี Buy) หรือเหนือแนวต้าน (กรณี Sell)';

  let advice = raw.advice;
  if (!advice) {
    const parts: string[] = [];
    if (raw.keyLevels && raw.keyLevels !== 'N/A' && raw.keyLevels !== 'ไม่ระบุ') {
      parts.push(`แนวรับ-แนวต้าน: ${raw.keyLevels}`);
    }
    if (raw.suggestedAction) {
      parts.push(`คำแนะนำ: ${raw.suggestedAction}`);
    }
    advice = parts.length > 0 ? parts.join(' | ') : 'บริหารความเสี่ยงและกำหนดขนาดล็อตให้เหมาะสมกับพอร์ต (Money Management)';
  }

  return {
    patternName,
    patternNameEn: raw.patternNameEn,
    sentiment,
    signal: raw.signal || sentiment,
    confidence,
    analysis,
    entrySuggestion: entry,
    stopLossSuggestion: stopLoss,
    advice,
    timeframeHint: raw.timeframeHint || 'H1 / H4 / D1',
  };
}
