export type CandleSide = 'Bullish' | 'Bearish' | 'Neutral' | 'Continuation';

export type CandleGrouping =
  | 'แท่งเดี่ยว (Single)'
  | 'สองแท่ง (Dual)'
  | 'สามแท่ง (Triple)'
  | 'ต่อเนื่อง (Continuation)'
  | 'รูปแบบชาร์ต (Chart Patterns)'
  | 'Price Action & SMC';

export interface CandleSpec {
  // relative normalized values 0-100 where 100 is top (high) and 0 is bottom (low) of the viewing window
  open: number;
  close: number;
  high: number;
  low: number;
  color: 'green' | 'red' | 'gray';
  label?: string;
  isKey?: boolean;
}

export type CandleData = CandleSpec;

export interface CandlestickPattern {
  id: string;
  name: string;
  englishName: string;
  side: CandleSide;
  grouping: CandleGrouping;
  count: number;
  winRate: string;
  timeframe: string;
  signalStrength: number; // 1 - 5
  summary: string;
  psychology: string;
  tip: string;
  confirmation: string;
  entrySLTP: {
    entry: string;
    stopLoss: string;
    takeProfit: string;
    riskReward: string;
  };
  candles: CandleSpec[];
  tags: string[];
  sourceUrl?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'model';
  content: string;
  text?: string;
  timestamp: number;
  image?: string;
  isThinking?: boolean;
  scanResult?: ChartScanResult;
}

export interface ChartScanResult {
  patternName: string;
  patternNameEn?: string;
  signal?: 'Bullish' | 'Bearish' | 'Neutral' | 'Continuation';
  sentiment?: 'Bullish' | 'Bearish' | 'Neutral' | 'Continuation';
  confidence: number; // 0 - 100%
  timeframeHint?: string;
  summary?: string;
  analysis?: string;
  entry?: string;
  entrySuggestion?: string;
  stopLoss?: string;
  stopLossSuggestion?: string;
  takeProfit1?: string;
  takeProfit2?: string;
  riskRewardRatio?: string;
  advice?: string;
  supportResistance?: {
    support: string[];
    resistance: string[];
  };
  psychology?: string;
  indicatorCheck?: {
    rsiStatus?: string;
    trendStatus?: string;
    volumeStatus?: string;
  };
  recommendation?: string;
  disclaimer?: string;
}

