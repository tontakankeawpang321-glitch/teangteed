export interface VideoClip {
  id: string;
  category: string;
  title: string;
  description: string;
  url: string;
  embedUrl: string;
  thumbnailUrl: string;
}

export const GOOGLE_SHEET_CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vROifFFSwOwH3_TOnuZYMM7SXvN9x2HqrIxKX1osW6aHlKAT-Aayx5-pKWemOT55A7ZvrWUVvcNkmFc/pub?output=csv';

/**
 * Extracts YouTube Video ID or Shorts ID from multiple URL formats
 */
export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const cleaned = url.trim();

  // Pattern 1: youtube.com/shorts/VIDEO_ID
  const shortsMatch = cleaned.match(/(?:shorts\/|embed\/|v\/|watch\?v=)([\w-]{11})/i);
  if (shortsMatch && shortsMatch[1]) return shortsMatch[1];

  // Pattern 2: youtu.be/VIDEO_ID
  const shortUrlMatch = cleaned.match(/youtu\.be\/([\w-]{11})/i);
  if (shortUrlMatch && shortUrlMatch[1]) return shortUrlMatch[1];

  // Pattern 3: direct 11-char ID
  if (/^[\w-]{11}$/.test(cleaned)) return cleaned;

  return null;
}

/**
 * Creates embed URL and thumbnail for a video URL
 */
export function processVideoUrl(rawUrl: string, id: string): { embedUrl: string; thumbnailUrl: string } {
  const ytId = extractYouTubeId(rawUrl);

  if (ytId) {
    return {
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&modestbranding=1&rel=0&playsinline=1`,
      thumbnailUrl: `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`,
    };
  }

  // Generic fallback if it's already an embed or mp4 or web link
  return {
    embedUrl: rawUrl,
    thumbnailUrl: `https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&auto=format&fit=crop&q=80`,
  };
}

/**
 * Simple, robust CSV line parser that handles commas inside quotes
 */
function parseCSV(text: string): string[][] {
  const lines: string[][] = [];
  let row: string[] = [];
  let inQuotes = false;
  let currentToken = '';

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        currentToken += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(currentToken.trim());
      currentToken = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      row.push(currentToken.trim());
      currentToken = '';
      if (row.length > 0 && row.some((col) => col !== '')) {
        lines.push(row);
      }
      row = [];
    } else {
      currentToken += char;
    }
  }

  if (currentToken || row.length > 0) {
    row.push(currentToken.trim());
    if (row.some((col) => col !== '')) {
      lines.push(row);
    }
  }

  return lines;
}

/**
 * Fallback starter clips in case Google Sheet is empty or loading
 */
export const DEFAULT_SHORTS_CLIPS: VideoClip[] = [
  {
    id: 'clip-1',
    category: 'แท่งเทียน',
    title: 'วิธีดูแท่งเทียน Pin Bar / Hammer จับจุดกลับตัวแม่นยำ',
    description: 'เจาะลึกแท่งเทียนกลับตัวยอดนิยม ไส้ยาว 2 เท่าขึ้นไป บ่งบอกแรงซื้อปฏิเสธราคาต่ำ',
    url: 'https://www.youtube.com/shorts/3i_bHl_Q8h4',
    embedUrl: 'https://www.youtube-nocookie.com/embed/3i_bHl_Q8h4?autoplay=1&modestbranding=1&rel=0&playsinline=1',
    thumbnailUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'clip-2',
    category: 'Price Action',
    title: 'Bullish Engulfing กลืนกินขาขึ้น จุดเข้า Entry คมๆ',
    description: 'แท่งเขียวใหญ่กลืนแท่งแดงก่อนหน้า สัญญาณกระทิงคุมตลาด วาง SL ใต้แท่งกลืนกิน',
    url: 'https://www.youtube.com/shorts/5k_cWm_T9u8',
    embedUrl: 'https://www.youtube-nocookie.com/embed/5k_cWm_T9u8?autoplay=1&modestbranding=1&rel=0&playsinline=1',
    thumbnailUrl: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'clip-3',
    category: 'SMC & ICT',
    title: 'Order Block & FVG กวาดสภาพคล่องก่อนพุ่งแรง',
    description: 'ทำความเข้าใจจุดที่สถาบันตั้งออเดอร์ (Smart Money) พร้อมช่องว่างราคา Fair Value Gap',
    url: 'https://www.youtube.com/shorts/7y_dKn_L1o2',
    embedUrl: 'https://www.youtube-nocookie.com/embed/7y_dKn_L1o2?autoplay=1&modestbranding=1&rel=0&playsinline=1',
    thumbnailUrl: 'https://images.unsplash.com/photo-1535320903710-d993d3d77d29?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'clip-4',
    category: 'แนวรับ-แนวต้าน',
    title: 'แนวรับแนวต้านแบบไดนามิก Dynamic Support Resistance',
    description: 'ใช้ EMA 20/50 เป็นแนวรับเคลื่อนที่ หลีกเลี่ยง False Breakout',
    url: 'https://www.youtube.com/shorts/8m_ePn_R3s4',
    embedUrl: 'https://www.youtube-nocookie.com/embed/8m_ePn_R3s4?autoplay=1&modestbranding=1&rel=0&playsinline=1',
    thumbnailUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'clip-5',
    category: 'Risk Management',
    title: 'กฎ 1-2% ปั้นพอร์ตไม่ล้างพอร์ต คำนวณ Lot Size',
    description: 'สูตรบริหารความเสี่ยงระดับมืออาชีพ คุม Drawdown ให้พอร์ตเติบโตอย่างยั่งยืน',
    url: 'https://www.youtube.com/shorts/9p_fQo_S5t6',
    embedUrl: 'https://www.youtube-nocookie.com/embed/9p_fQo_S5t6?autoplay=1&modestbranding=1&rel=0&playsinline=1',
    thumbnailUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'clip-6',
    category: 'แท่งเทียน',
    title: 'Morning Star & Evening Star ดาราเช้าดาราค่ำ 3 แท่ง',
    description: 'สุดยอดรูปแบบสามแท่งเทียนกลับตัวที่สถิติ Win Rate สูงกว่า 75%',
    url: 'https://www.youtube.com/shorts/4a_bCo_D7e8',
    embedUrl: 'https://www.youtube-nocookie.com/embed/4a_bCo_D7e8?autoplay=1&modestbranding=1&rel=0&playsinline=1',
    thumbnailUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'clip-7',
    category: 'Price Action',
    title: 'Doji แท่งลังเล บอกใบ้จุดหมดแรงของเทรนด์',
    description: 'เมื่อราคาเปิดและปิดเท่ากัน แปลว่าศึกฝั่งซื้อและขายเสมอกัน เตรียมระเบิดทิศทางใหม่',
    url: 'https://www.youtube.com/shorts/6g_hIj_K9l0',
    embedUrl: 'https://www.youtube-nocookie.com/embed/6g_hIj_K9l0?autoplay=1&modestbranding=1&rel=0&playsinline=1',
    thumbnailUrl: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'clip-8',
    category: 'SMC & ICT',
    title: 'Liquidity Sweep กวาด Stop Loss ก่อนวิ่งจริง',
    description: 'ทำไมราคาแตะ SL แล้ววิ่งถูกทาง? วิธีจับทาง Smart Money ดักซื้อจุดที่คนอื่นโดนคัท',
    url: 'https://www.youtube.com/shorts/1q_wEr_T3y5',
    embedUrl: 'https://www.youtube-nocookie.com/embed/1q_wEr_T3y5?autoplay=1&modestbranding=1&rel=0&playsinline=1',
    thumbnailUrl: 'https://images.unsplash.com/photo-1535320903710-d993d3d77d29?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'clip-9',
    category: 'จิตวิทยาการเทรด',
    title: 'FOMO & Revenge Trading วิธีแก้อารมณ์อยากเอาคืนตลาด',
    description: 'ควบคุมจิตวิทยาการเทรดให้เหมือนหุ่นยนต์ หยุดเทรดเมื่อหลุดแผน',
    url: 'https://www.youtube.com/shorts/2z_xCv_B4n6',
    embedUrl: 'https://www.youtube-nocookie.com/embed/2z_xCv_B4n6?autoplay=1&modestbranding=1&rel=0&playsinline=1',
    thumbnailUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'clip-10',
    category: 'กลยุทธ์ Scalping',
    title: 'เทรดสั้น 1 นาที ด้วยแท่งเทียน Momentum Scalping',
    description: 'จับจังหวะสวิงเร็วด้วย Breakout Candle + Volume ยืนยัน ทำกำไรฉับไวในตลาดผันผวน',
    url: 'https://www.youtube.com/shorts/3m_kLp_O5p7',
    embedUrl: 'https://www.youtube-nocookie.com/embed/3m_kLp_O5p7?autoplay=1&modestbranding=1&rel=0&playsinline=1',
    thumbnailUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80',
  },
];

/**
 * Fetches and parses Google Sheet CSV from URL
 */
export async function fetchSheetVideos(customCsvUrl?: string): Promise<VideoClip[]> {
  const targetUrl = customCsvUrl || GOOGLE_SHEET_CSV_URL;

  try {
    const res = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        Accept: 'text/csv,text/plain,*/*',
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch sheet CSV: ${res.status}`);
    }

    const csvText = await res.text();
    if (!csvText || !csvText.trim()) {
      return [];
    }

    const parsedRows = parseCSV(csvText);
    if (parsedRows.length === 0) {
      return [];
    }

    // Determine header column indices: category, title, description, url
    const headerRow = parsedRows[0].map((h) => h.toLowerCase().trim());
    let catIdx = headerRow.findIndex((h) => h.includes('category') || h.includes('หมวด'));
    let titleIdx = headerRow.findIndex((h) => h.includes('title') || h.includes('หัวข้อ') || h.includes('ชื่อ'));
    let descIdx = headerRow.findIndex((h) => h.includes('desc') || h.includes('ราย') || h.includes('เนื้อหา'));
    let urlIdx = headerRow.findIndex((h) => h.includes('url') || h.includes('link') || h.includes('ลิงก์'));

    // Fallbacks if not found by name
    if (catIdx === -1) catIdx = 0;
    if (titleIdx === -1) titleIdx = 1;
    if (descIdx === -1) descIdx = 2;
    if (urlIdx === -1) urlIdx = 3;

    const clips: VideoClip[] = [];

    // Parse data rows (skip row 0 header)
    for (let i = 1; i < parsedRows.length; i++) {
      const row = parsedRows[i];
      if (!row || row.length === 0) continue;

      const category = row[catIdx]?.trim() || 'ทั่วไป';
      const title = row[titleIdx]?.trim() || '';
      const description = row[descIdx]?.trim() || '';
      const rawUrl = row[urlIdx]?.trim() || '';

      // Skip empty rows where title or url is completely missing (หากไม่มีข้อมูลจากชีตไม่ต้องแสดง)
      if (!rawUrl && !title) continue;

      const id = `sheet-clip-${i}-${Date.now().toString(36)}`;
      const { embedUrl, thumbnailUrl } = processVideoUrl(rawUrl, id);

      clips.push({
        id,
        category,
        title: title || `คลิปสอนเทรด #${i}`,
        description,
        url: rawUrl,
        embedUrl,
        thumbnailUrl,
      });
    }

    // If sheet actually had valid rows, return them!
    return clips;
  } catch (error) {
    console.warn('Error fetching Google Sheet CSV:', error);
    // Return empty array so only actual sheet data is displayed
    return [];
  }
}
