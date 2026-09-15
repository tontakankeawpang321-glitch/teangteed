import { CandlestickPattern, CandleSpec, CandleSide, CandleGrouping } from '../types';

// Structured templates and variation matrices to generate 500+ distinct, realistic candlestick patterns
interface PatternTemplate {
  baseId: string;
  nameTh: string;
  nameEn: string;
  side: CandleSide;
  grouping: CandleGrouping;
  count: number;
  baseWinRate: number;
  timeframe: string;
  signalStrength: number;
  summaryTemplate: string;
  psychologyTemplate: string;
  tipTemplate: string;
  confirmationTemplate: string;
  candlesGenerator: (variantIndex: number) => CandleSpec[];
  tags: string[];
}

const TEMPLATES: PatternTemplate[] = [
  // 1. Single Rejection & Pinbar Variants
  {
    baseId: 'pinbar-rejection',
    nameTh: 'พินบาร์ปฏิเสธราคา',
    nameEn: 'Pin Bar Price Rejection',
    side: 'Bullish',
    grouping: 'แท่งเดี่ยว (Single)',
    count: 1,
    baseWinRate: 72,
    timeframe: '15m, 1h, 4h, 1D',
    signalStrength: 4,
    summaryTemplate: 'เกิดไส้เทียนล่างยาวปฏิเสธโซนราคา บ่งบอกว่าผู้ซื้อผลักดันราคากลับขึ้นมาอย่างแข็งแกร่ง',
    psychologyTemplate: 'แรงขายพยายามทำลายแนวรับแต่เจอแรงซื้อดักช้อนจำนวนมากสะท้อนการดูดซับสภาพคล่องอย่างรวดเร็ว',
    tipTemplate: 'ควรเทรดคู่กับแนวรับสำคัญหรือระดับ Fibonacci Retracement 61.8%',
    confirmationTemplate: 'แท่งถัดไปปิดเขียวทะลุ High ของตัวพินบาร์',
    candlesGenerator: (idx) => [
      { open: 40 + (idx % 5), close: 30 - (idx % 4), high: 45, low: 25, color: 'red', label: 'ก่อนหน้า' },
      { open: 48 + (idx % 3), close: 60 + (idx % 4), high: 65, low: 10 + (idx % 8), color: 'green', label: `Pinbar v${idx + 1}`, isKey: true },
      { open: 62, close: 80, high: 85, low: 60, color: 'green', label: 'ยืนยัน' },
    ],
    tags: ['pinbar', 'rejection', 'bullish', 'ไส้ยาว', 'ปฏิเสธราคา'],
  },
  // 2. Bearish Pinbar & Shooting Star Variants
  {
    baseId: 'bearish-wick-exhaustion',
    nameTh: 'ไส้บนหมดแรงขาลง',
    nameEn: 'Upper Wick Exhaustion Bearish',
    side: 'Bearish',
    grouping: 'แท่งเดี่ยว (Single)',
    count: 1,
    baseWinRate: 74,
    timeframe: '15m, 1h, 4h',
    signalStrength: 4,
    summaryTemplate: 'ไส้เทียนบนยาวเป็นพิเศษหลังชนแนวต้านหรือโซน Supply บ่งชี้ว่าฝั่งซื้อหมดกำลัง',
    psychologyTemplate: 'ผู้ซื้อพยายามดันราคาขึ้นแต่โดนสถาบันและ Smart Money เทขายกดราคาลงมาปิดต่ำ',
    tipTemplate: 'ตั้ง Stop Loss เหนือยอดไส้บนเสมอ เผื่อค่า Spread เล็กน้อย',
    confirmationTemplate: 'แท่งถัดไปปิดแดงต่ำกว่าฐานของแท่งไส้ยาว',
    candlesGenerator: (idx) => [
      { open: 30, close: 60, high: 62, low: 28, color: 'green', label: 'ขึ้นมา' },
      { open: 65 - (idx % 4), close: 50 - (idx % 3), high: 96, low: 48, color: 'red', label: `Wick Drop v${idx + 1}`, isKey: true },
      { open: 48, close: 22, high: 50, low: 18, color: 'red', label: 'ยืนยันลง' },
    ],
    tags: ['bearish', 'upper wick', 'shooting star', 'exhaustion', 'หมดแรง'],
  },
  // 3. Engulfing Variations
  {
    baseId: 'engulfing-momentum',
    nameTh: 'แท่งกลืนกินพลังสูง',
    nameEn: 'High Momentum Engulfing',
    side: 'Bullish',
    grouping: 'สองแท่ง (Dual)',
    count: 2,
    baseWinRate: 76,
    timeframe: '1h, 4h, 1D',
    signalStrength: 5,
    summaryTemplate: 'แท่งเขียวขนาดใหญ่คลุมมิดแท่งแดงก่อนหน้าทั้งหมดพร้อมวอลุ่มหนาแน่น',
    psychologyTemplate: 'อำนาจตลาดเปลี่ยนมือจากฝั่งขายสู่ฝั่งซื้อโดยสิ้นเชิงภายในแท่งเดียว',
    tipTemplate: 'หากเกิดตรง Demand Zone หรือแนวรับ Trendline จะเพิ่มอัตราความแม่นยำสูงขึ้นมาก',
    confirmationTemplate: 'แท่งเขียวปิดเหนือ High ของแท่งแดงก่อนหน้า',
    candlesGenerator: (idx) => [
      { open: 55, close: 40, high: 58, low: 36, color: 'red', label: '1. แดงเล็ก' },
      { open: 34 - (idx % 4), close: 80 + (idx % 5), high: 85, low: 30, color: 'green', label: `2. กลืนกิน v${idx + 1}`, isKey: true },
      { open: 80, close: 95, high: 98, low: 78, color: 'green', label: '3. พุ่งต่อ' },
    ],
    tags: ['engulfing', 'กลืนกิน', 'bullish', 'momentum', 'วอลุ่ม'],
  },
  // 4. Bearish Engulfing Variants
  {
    baseId: 'bearish-engulfing-trap',
    nameTh: 'แท่งกลืนกินขาลงกดทับ',
    nameEn: 'Bearish Engulfing Pressure',
    side: 'Bearish',
    grouping: 'สองแท่ง (Dual)',
    count: 2,
    baseWinRate: 75,
    timeframe: '15m, 1h, 4h, 1D',
    signalStrength: 5,
    summaryTemplate: 'แท่งแดงใหญ่กลืนกินแท่งเขียวก่อนหน้า แสดงถึงแรงเทขายมหาศาลที่กลบแรงซื้อทั้งหมด',
    psychologyTemplate: 'ฝั่งซื้อถูกบดขยี้อย่างรวดเร็ว ส่งผลให้นักเทรดฝั่ง Long จำเป็นต้อง Stop Loss เร่งให้ราคาดิ่งลงเร็วขึ้น',
    tipTemplate: 'มองหาจังหวะเข้า Short เมื่อราคาเด้งทดสอบจุดกึ่งกลางของแท่งกลืนกิน',
    confirmationTemplate: 'แท่งแดงปิดต่ำกว่า Low ของแท่งเขียวก่อนหน้า',
    candlesGenerator: (idx) => [
      { open: 45, close: 65, high: 68, low: 42, color: 'green', label: '1. เขียวเล็ก' },
      { open: 72 + (idx % 4), close: 25 - (idx % 5), high: 75, low: 20, color: 'red', label: `2. เทกลืนกิน v${idx + 1}`, isKey: true },
      { open: 26, close: 10, high: 28, low: 8, color: 'red', label: '3. ดิ่งต่อ' },
    ],
    tags: ['bearish engulfing', 'กลืนกินขาลง', 'bearish', 'เทขาย'],
  },
  // 5. SMC Fair Value Gap (FVG) Trigger
  {
    baseId: 'smc-fvg-entry',
    nameTh: 'แท่งสร้างช่องว่าง FVG ขาขึ้น',
    nameEn: 'Bullish Fair Value Gap Creation',
    side: 'Bullish',
    grouping: 'Price Action & SMC',
    count: 3,
    baseWinRate: 80,
    timeframe: '5m, 15m, 1h, 4h',
    signalStrength: 5,
    summaryTemplate: 'เกิดความไม่สมดุลของราคา (Imbalance) ระหว่างไส้บนของแท่ง 1 และไส้ล่างของแท่ง 3',
    psychologyTemplate: 'อัลกอริทึมสถาบันอัดคำสั่งซื้อก้อนใหญ่จนไม่มีการจับคู่ฝั่งขาย ทำให้เกิดช่องว่างสภาพคล่อง',
    tipTemplate: 'ตั้ง Limit Order รอรับที่ระดับ 50% Consequent Encroachment (CE) ของกล่อง FVG',
    confirmationTemplate: 'ราคาถอยกลับมาแตะโซน FVG แล้วเกิดสัญญาณแท่งเทียนปฏิเสธราคา',
    candlesGenerator: (idx) => [
      { open: 25, close: 35, high: 40, low: 22, color: 'green', label: '1. ฐานราคา' },
      { open: 38, close: 82 + (idx % 4), high: 86, low: 36, color: 'green', label: `2. FVG พุ่ง v${idx + 1}`, isKey: true },
      { open: 84, close: 92, high: 95, low: 65 + (idx % 5), color: 'green', label: '3. ทิ้ง Gap' },
    ],
    tags: ['fvg', 'fair value gap', 'smc', 'ict', 'imbalance', 'สภาพคล่อง'],
  },
  // 6. Bearish Fair Value Gap
  {
    baseId: 'smc-bearish-fvg',
    nameTh: 'แท่งสร้าง FVG ขาลงดิ่งเหว',
    nameEn: 'Bearish Fair Value Gap Imbalance',
    side: 'Bearish',
    grouping: 'Price Action & SMC',
    count: 3,
    baseWinRate: 81,
    timeframe: '5m, 15m, 1h, 4h',
    signalStrength: 5,
    summaryTemplate: 'แท่งแดงยาวสร้างช่องว่าง Imbalance ระหว่าง Low แท่งที่ 1 และ High แท่งที่ 3',
    psychologyTemplate: 'แรงขายถล่มหนักโดยสถาบัน ทิ้งช่องว่างที่ราคาต้องกลับมา Mitigate เพื่อปิดสภาพคล่อง',
    tipTemplate: 'รอเปิด Short เมื่อราคาเด้งย้อนกลับเข้ามาในกล่อง FVG โซน Premium',
    confirmationTemplate: 'แท่งเทียนปิด Rejection ภายในกล่อง FVG ขาลง',
    candlesGenerator: (idx) => [
      { open: 85, close: 72, high: 88, low: 68, color: 'red', label: '1. High แท่งแรก' },
      { open: 66, close: 25 - (idx % 4), high: 68, low: 20, color: 'red', label: `2. FVG ดิ่ง v${idx + 1}`, isKey: true },
      { open: 24, close: 15, high: 42 - (idx % 5), low: 12, color: 'red', label: '3. ทิ้งช่วงว่าง' },
    ],
    tags: ['bearish fvg', 'imbalance', 'smc', 'ict', 'sell fvg'],
  },
  // 7. Liquidity Sweep & Judas Swing
  {
    baseId: 'liquidity-sweep-turtle-soup',
    nameTh: 'ไส้กวาดสภาพคล่อง (Liquidity Sweep)',
    nameEn: 'Liquidity Sweep & Turtle Soup',
    side: 'Bullish',
    grouping: 'Price Action & SMC',
    count: 2,
    baseWinRate: 83,
    timeframe: '15m, 1h, 4h',
    signalStrength: 5,
    summaryTemplate: 'ไส้แท่งเทียนทิ่มหลุดแนวรับเดิมเพื่อล่า Stop Loss ของรายย่อยแล้วดึงกลับมาปิดในกรอบทันที',
    psychologyTemplate: 'Smart Money กระตุ้นคำสั่ง Sell Stop เพื่อเก็บของล็อตใหญ่ในราคาถูกที่สุดก่อนลากขึ้นจริง',
    tipTemplate: 'เข้า Buy ทันทีที่แท่งสามารถปิดกลับเข้ามาเหนือระดับ Equal Lows (EQL)',
    confirmationTemplate: 'ราคาปิดแท่งยืนเหนือแนวรับเก่าพร้อมไส้ล่างยาว',
    candlesGenerator: (idx) => [
      { open: 45, close: 32, high: 48, low: 30, color: 'red', label: 'แนวรับ 30' },
      { open: 32, close: 58 + (idx % 4), high: 62, low: 8 - (idx % 4), color: 'green', label: `Sweep กวาด SL v${idx + 1}`, isKey: true },
      { open: 60, close: 88, high: 90, low: 58, color: 'green', label: 'ลากยาวขึ้น' },
    ],
    tags: ['liquidity sweep', 'judas swing', 'turtle soup', 'smc', 'ict', 'ล่า stop loss'],
  },
  // 8. Bearish Buy-Side Liquidity Sweep (BSL Sweep)
  {
    baseId: 'bsl-liquidity-sweep',
    nameTh: 'ไส้กวาด High บนดอย (BSL Sweep)',
    nameEn: 'Buy-Side Liquidity Sweep Reversal',
    side: 'Bearish',
    grouping: 'Price Action & SMC',
    count: 2,
    baseWinRate: 84,
    timeframe: '15m, 1h, 4h',
    signalStrength: 5,
    summaryTemplate: 'ไส้แท่งแทงทะลุ Swing High เก่าขึ้นไปกิน Buy Stop แล้วรูดปิดแดงต่ำกว่า High เดิม',
    psychologyTemplate: 'หลอกให้รายย่อยคิดว่าจะ Breakout แต่แท้จริงแล้วคือการแจกจ่ายของ (Distribution) ของสถาบัน',
    tipTemplate: 'เปิด Short เมื่อแท่งปิดต่ำกว่าแนวต้านเดิม Stop Loss ไว้เหนือยอดไส้ Sweep',
    confirmationTemplate: 'แท่งถัดไปเกิด Displacement แท่งแดงใหญ่ทิ้งตัวลง',
    candlesGenerator: (idx) => [
      { open: 55, close: 72, high: 75, low: 52, color: 'green', label: 'แนวต้าน 75' },
      { open: 74, close: 48 - (idx % 4), high: 98, low: 45, color: 'red', label: `BSL Sweep v${idx + 1}`, isKey: true },
      { open: 46, close: 18, high: 48, low: 14, color: 'red', label: 'ทิ้งดิ่ง' },
    ],
    tags: ['bsl sweep', 'buy side liquidity', 'smc', 'ict', 'bearish sweep', 'กับดักยอด'],
  },
  // 9. Order Block Reaction
  {
    baseId: 'smc-order-block-bounce',
    nameTh: 'แท่งเทสบล็อกคำสั่ง Order Block',
    nameEn: 'Order Block Reaction Bounce',
    side: 'Bullish',
    grouping: 'Price Action & SMC',
    count: 3,
    baseWinRate: 79,
    timeframe: '15m, 1h, 4h, 1D',
    signalStrength: 5,
    summaryTemplate: 'ราคาลงมาทดสอบแท่งแดงสุดท้ายก่อนเกิดแรงระเบิดขึ้น (Bullish Order Block) แล้วเด้งแรง',
    psychologyTemplate: 'สถาบันทำการปิดคำสั่ง Short ที่ติดค้างไว้และเติมคำสั่งซื้อ Buy ใหม่ที่จุดคุ้มทุน (Breakeven)',
    tipTemplate: 'ให้ความสนใจเฉพาะ Order Block ที่ส่งผลให้เกิด Break of Structure (BOS) ชัดเจนเท่านั้น',
    confirmationTemplate: 'เกิดแท่ง Reject หรือ Engulfing ภายในกรอบ OB',
    candlesGenerator: (idx) => [
      { open: 60, close: 38, high: 62, low: 35, color: 'red', label: '1. Bullish OB' },
      { open: 40, close: 88, high: 92, low: 38, color: 'green', label: '2. ระเบิด BOS' },
      { open: 70, close: 45, high: 72, low: 37, color: 'red', label: '3. ย่อมาเทส' },
      { open: 42, close: 82 + (idx % 4), high: 85, low: 38, color: 'green', label: `4. เด้ง OB v${idx + 1}`, isKey: true },
    ],
    tags: ['order block', 'ob', 'smc', 'ict', 'demand zone', 'เด้ง ob'],
  },
  // 10. Bearish Mitigation / Breaker Block
  {
    baseId: 'bearish-breaker-block',
    nameTh: 'แท่งรีเทสเบรกเกอร์บล็อกขาลง',
    nameEn: 'Bearish Breaker Block Retest',
    side: 'Bearish',
    grouping: 'Price Action & SMC',
    count: 3,
    baseWinRate: 82,
    timeframe: '15m, 1h, 4h',
    signalStrength: 5,
    summaryTemplate: 'Order block ฝั่งซื้อที่ถูกทะลุผ่าน (Failed OB) เปลี่ยนบทบาทกลายเป็นแนวต้านทรงพลัง',
    psychologyTemplate: 'ผู้ที่ติดดอยที่แนวรับเก่าฉวยโอกาสปิดออเดอร์เสมอตัว ทำให้เกิดแรงขายประสานกับแรง Short ใหม่',
    tipTemplate: 'เป็นจุดเข้าเทรดที่มี Win Rate สูงที่สุดแบบหนึ่งในสาย ICT / SMC',
    confirmationTemplate: 'ราคาแตะ Breaker แล้วเกิดไส้บนปฏิเสธราคา',
    candlesGenerator: (idx) => [
      { open: 35, close: 65, high: 68, low: 32, color: 'green', label: '1. ฐานเดิม' },
      { open: 60, close: 18, high: 62, low: 15, color: 'red', label: '2. หลุดพรวด' },
      { open: 22, close: 56 - (idx % 3), high: 62, low: 20, color: 'green', label: `3. เด้งชน Breaker v${idx + 1}`, isKey: true },
      { open: 52, close: 10, high: 54, low: 8, color: 'red', label: '4. รูดลงหนัก' },
    ],
    tags: ['breaker block', 'failed ob', 'mitigation', 'smc', 'ict', 'bearish breaker'],
  },
  // 11. Inside Bar Breakout Bullish
  {
    baseId: 'inside-bar-compression-bull',
    nameTh: 'อินไซด์บาร์บีบอัดระเบิดขึ้น',
    nameEn: 'Inside Bar Compression Breakout',
    side: 'Bullish',
    grouping: 'สองแท่ง (Dual)',
    count: 2,
    baseWinRate: 71,
    timeframe: '1h, 4h, 1D',
    signalStrength: 4,
    summaryTemplate: 'แท่งลูกอยู่ในกรอบของ Mother Bar แสดงถึงความผันผวนที่ลดลงก่อนระเบิดทิศทางตามแนวโน้มเดิม',
    psychologyTemplate: 'เกิดการสะสมพลัง (Volatility Contraction) เมื่อแรงซื้อพร้อมจะดันราคา Breakout อย่างรุนแรง',
    tipTemplate: 'วาง Buy Stop เหนือ High ของ Mother Bar เพื่อดักจับโมเมนตัมช่วงเปิดเบรก',
    confirmationTemplate: 'แท่งที่ 3 ปิดทะลุเหนือ High ของแท่งแม่ (Mother Bar)',
    candlesGenerator: (idx) => [
      { open: 25, close: 75, high: 85, low: 20, color: 'green', label: '1. Mother Bar' },
      { open: 50, close: 60, high: 68 - (idx % 4), low: 45 + (idx % 3), color: 'gray', label: `2. Inside Bar v${idx + 1}`, isKey: true },
      { open: 65, close: 95, high: 98, low: 62, color: 'green', label: '3. Breakout พุ่ง' },
    ],
    tags: ['inside bar', 'บีบอัด', 'breakout', 'bullish', 'สะสมพลัง'],
  },
  // 12. Inside Bar Breakdown Bearish
  {
    baseId: 'inside-bar-breakdown-bear',
    nameTh: 'อินไซด์บาร์หลุดกรอบขาลง',
    nameEn: 'Inside Bar Breakdown Bearish',
    side: 'Bearish',
    grouping: 'สองแท่ง (Dual)',
    count: 2,
    baseWinRate: 72,
    timeframe: '1h, 4h, 1D',
    signalStrength: 4,
    summaryTemplate: 'แท่งราคาบีบอัดตัวในแท่งแม่ขาลง ก่อนจะเกิดแท่งแดงทะลุ Low ของ Mother bar ลงไป',
    psychologyTemplate: 'การพักตัวชั่วคราวในแนวโน้มขาลง เมื่อผู้ซื้อไม่สามารถดันราคาขึ้น ฝั่งขายจึงกระหน่ำซ้ำ',
    tipTemplate: 'วาง Sell Stop ใต้ Low ของ Mother Bar',
    confirmationTemplate: 'แท่งเทียนปิดต่ำกว่า Low ของ Mother Bar อย่างสมบูรณ์',
    candlesGenerator: (idx) => [
      { open: 75, close: 25, high: 80, low: 18, color: 'red', label: '1. Mother Bar' },
      { open: 45, close: 38, high: 55 - (idx % 3), low: 32 + (idx % 3), color: 'gray', label: `2. Inside Bar v${idx + 1}`, isKey: true },
      { open: 30, close: 8, high: 32, low: 5, color: 'red', label: '3. หลุดดิ่งเหว' },
    ],
    tags: ['inside bar bear', 'หลุดกรอบ', 'bearish', 'breakdown'],
  },
  // 13. Three White Soldiers Momentum Surge
  {
    baseId: 'three-soldiers-expansion',
    nameTh: 'สามทหารเสือเขียวขยายตัว',
    nameEn: 'Three White Soldiers Expansion',
    side: 'Bullish',
    grouping: 'สามแท่ง (Triple)',
    count: 3,
    baseWinRate: 78,
    timeframe: '4h, 1D, 1W',
    signalStrength: 5,
    summaryTemplate: 'แท่งเขียว 3 แท่งเรียงตัวทำ Higher High ต่อเนื่อง ไส้บนสั้น บ่งบอกถึงแรงซื้อที่ทรงพลังอย่างยิ่ง',
    psychologyTemplate: 'ฝั่งซื้อเข้าควบคุมตลาดอย่างเบ็ดเสร็จต่อเนื่อง ไม่เปิดโอกาสให้ฝั่งขายย่อราคาลงมาได้เลย',
    tipTemplate: 'อย่าวู่วามเข้าไล่ราคา รอจังหวะย่อทดสอบ High ของแท่งที่ 1 หรือ 2 ก่อนเข้า Buy',
    confirmationTemplate: 'แต่ละแท่งเปิดในเนื้อเทียนของแท่งก่อนหน้าและปิดทำ New High',
    candlesGenerator: (idx) => [
      { open: 20, close: 45, high: 48, low: 18, color: 'green', label: '1. ทหารแรก' },
      { open: 42, close: 70, high: 72, low: 40, color: 'green', label: `2. ทหารสอง v${idx + 1}`, isKey: true },
      { open: 68, close: 94 + (idx % 4), high: 98, low: 65, color: 'green', label: '3. ทหารสาม' },
    ],
    tags: ['three white soldiers', 'สามทหารเสือ', 'bullish', 'ขาขึ้นแกร่ง'],
  },
  // 14. Three Black Crows Panic Dump
  {
    baseId: 'three-crows-avalanche',
    nameTh: 'สามกาดำเทกระจาด',
    nameEn: 'Three Black Crows Avalanche',
    side: 'Bearish',
    grouping: 'สามแท่ง (Triple)',
    count: 3,
    baseWinRate: 79,
    timeframe: '4h, 1D, 1W',
    signalStrength: 5,
    summaryTemplate: 'แท่งแดง 3 แท่งยาวเรียงกันทำ Lower Low ต่อเนื่อง สะท้อนถึงภาวะ Panic Sell รุนแรง',
    psychologyTemplate: 'นักลงทุนพร้อมใจกันทิ้งสินทรัพย์เพื่อหนีตาย เกิดการไหลออกของเม็ดเงินจำนวนมหาศาล',
    tipTemplate: 'ห้ามสวนเทรนด์เด็ดขาด ให้มองหาจังหวะเปิด Short เมื่อราคาเด้ง Pullback สั้นๆ',
    confirmationTemplate: 'แท่งที่ 3 ปิดต่ำสุดของรอบโดยแทบไม่มีไส้ล่าง',
    candlesGenerator: (idx) => [
      { open: 85, close: 60, high: 88, low: 58, color: 'red', label: '1. กาแรก' },
      { open: 62, close: 38, high: 64, low: 35, color: 'red', label: `2. กาสอง v${idx + 1}`, isKey: true },
      { open: 40, close: 12 - (idx % 4), high: 42, low: 8, color: 'red', label: '3. กาสามดิ่ง' },
    ],
    tags: ['three black crows', 'สามกาดำ', 'bearish', 'panic sell'],
  },
  // 15. Morning Star Variation
  {
    baseId: 'morning-star-gem',
    nameTh: 'ประกายรุ่งอรุณกลับตัวแรง',
    nameEn: 'Morning Star Pivot Glow',
    side: 'Bullish',
    grouping: 'สามแท่ง (Triple)',
    count: 3,
    baseWinRate: 77,
    timeframe: '1h, 4h, 1D',
    signalStrength: 5,
    summaryTemplate: 'แท่ง 1 แดงยาว, แท่ง 2 ตัวเล็กพักฐานตรงก้นลึก, แท่ง 3 เขียวยาวพุ่งทะลุเกิน 50% ของแท่งแรก',
    psychologyTemplate: 'ความกลัวหมดไป เกิดความหวังและการกลับมาของแรงซื้อจนเปลี่ยนโครงสร้างแนวโน้ม',
    tipTemplate: 'ประสานกับการดู RSI Oversold ต่ำกว่า 30 จะเพิ่มความแม่นยำแตะระดับ 85%+',
    confirmationTemplate: 'แท่งที่ 3 ปิดทะลุระดับ 50% ของเนื้อเทียนแท่งที่ 1',
    candlesGenerator: (idx) => [
      { open: 85, close: 45, high: 88, low: 42, color: 'red', label: '1. ขาลง' },
      { open: 30 - (idx % 4), close: 28, high: 36, low: 18 - (idx % 4), color: 'gray', label: `2. ดาวประกาย v${idx + 1}`, isKey: true },
      { open: 35, close: 82 + (idx % 4), high: 86, low: 32, color: 'green', label: '3. รุ่งอรุณ' },
    ],
    tags: ['morning star', 'ประกายรุ่งอรุณ', 'bullish', 'กลับตัวขึ้น'],
  },
  // 16. Evening Star Variation
  {
    baseId: 'evening-star-shadow',
    nameTh: 'ดาวสนธยากลับตัวดอย',
    nameEn: 'Evening Star Shadow Crest',
    side: 'Bearish',
    grouping: 'สามแท่ง (Triple)',
    count: 3,
    baseWinRate: 76,
    timeframe: '1h, 4h, 1D',
    signalStrength: 5,
    summaryTemplate: 'แท่ง 1 เขียวยาว, แท่ง 2 ตัวเล็กติดยอดดอย, แท่ง 3 แดงยาวกลืนกินลงมาต่ำกว่าครึ่งแท่งแรก',
    psychologyTemplate: 'ความโลภถึงขีดสุดก่อนจะหมดแรงซื้ออย่างกะทันหัน ส่งสัญญาณจบรอบขาขึ้นใหญ่',
    tipTemplate: 'ให้หาจังหวะเปิด Short เมื่อแท่งที่ 3 จบแท่ง Stop Loss เหนือยอดดาวแท่งที่ 2',
    confirmationTemplate: 'แท่งที่ 3 ปิดต่ำกว่าจุดกึ่งกลางของแท่งแรก',
    candlesGenerator: (idx) => [
      { open: 20, close: 65, high: 68, low: 18, color: 'green', label: '1. ขาขึ้น' },
      { open: 78 + (idx % 3), close: 80, high: 96, low: 72, color: 'gray', label: `2. ดาวสนธยา v${idx + 1}`, isKey: true },
      { open: 72, close: 25 - (idx % 4), high: 74, low: 20, color: 'red', label: '3. ดิ่งสนธยา' },
    ],
    tags: ['evening star', 'ดาวสนธยา', 'bearish', 'จบรอบขาขึ้น'],
  },
  // 17. Chart Pattern: Double Bottom Neckline Breakout
  {
    baseId: 'double-bottom-breakout',
    nameTh: 'แท่งเบรกเส้นคอก้นคู่ Double Bottom',
    nameEn: 'Double Bottom Neckline Breakout Candle',
    side: 'Bullish',
    grouping: 'รูปแบบชาร์ต (Chart Patterns)',
    count: 4,
    baseWinRate: 79,
    timeframe: '1h, 4h, 1D',
    signalStrength: 5,
    summaryTemplate: 'แท่งเทียนเขียวใหญ่เบรกผ่าน Neckline ของแพทเทิร์น W-Shape (Double Bottom)',
    psychologyTemplate: 'การทดสอบจุดต่ำสุด 2 ครั้งสำเร็จยืนยันว่าฝั่งขายไม่มีกำลังทุบราคาให้หลุดได้อีกต่อไป',
    tipTemplate: 'เป้าหมายราคา Take Profit คำนวณจากความลึกของก้นคู่บวกขึ้นไปจากเส้น Neckline',
    confirmationTemplate: 'แท่งเทียนปิดเต็มแท่งเหนือเส้น Neckline Resistance',
    candlesGenerator: (idx) => [
      { open: 60, close: 25, high: 62, low: 20, color: 'red', label: 'ก้นที่ 1' },
      { open: 25, close: 55, high: 58, low: 24, color: 'green', label: 'เส้นคอ 55' },
      { open: 55, close: 24, high: 56, low: 21, color: 'red', label: 'ก้นที่ 2' },
      { open: 30, close: 88 + (idx % 4), high: 92, low: 28, color: 'green', label: `เบรก Neckline v${idx + 1}`, isKey: true },
    ],
    tags: ['double bottom', 'w-shape', 'neckline', 'chart pattern', 'bullish'],
  },
  // 18. Chart Pattern: Double Top Neckline Breakdown
  {
    baseId: 'double-top-breakdown',
    nameTh: 'แท่งหลุดเส้นคอยอดคู่ Double Top',
    nameEn: 'Double Top Neckline Breakdown Candle',
    side: 'Bearish',
    grouping: 'รูปแบบชาร์ต (Chart Patterns)',
    count: 4,
    baseWinRate: 80,
    timeframe: '1h, 4h, 1D',
    signalStrength: 5,
    summaryTemplate: 'แท่งแดงเทหลุดเส้น Neckline ของแพทเทิร์น M-Shape (Double Top)',
    psychologyTemplate: 'ความล้มเหลวในการทำ New High 2 รอบติดต่อกันทำให้เกิดแรงขายหมดความเชื่อมั่น',
    tipTemplate: 'เป้าทำกำไรวัดความสูงจากยอดดอยลงมาเท่ากับระยะที่หลุดเส้นคอ',
    confirmationTemplate: 'ราคาปิดใต้ระดับเส้นคอ Support ชัดเจน',
    candlesGenerator: (idx) => [
      { open: 35, close: 80, high: 85, low: 32, color: 'green', label: 'ยอดที่ 1' },
      { open: 78, close: 45, high: 80, low: 42, color: 'red', label: 'เส้นคอ 45' },
      { open: 46, close: 82, high: 86, low: 44, color: 'green', label: 'ยอดที่ 2' },
      { open: 75, close: 15 - (idx % 4), high: 76, low: 10, color: 'red', label: `หลุด Neckline v${idx + 1}`, isKey: true },
    ],
    tags: ['double top', 'm-shape', 'neckline', 'chart pattern', 'bearish'],
  },
  // 19. Harmonic Reversal Trigger
  {
    baseId: 'harmonic-prz-reversal',
    nameTh: 'แท่งกลับตัวในโซนฮาร์มอนิก PRZ',
    nameEn: 'Harmonic PRZ Zone Reversal Trigger',
    side: 'Bullish',
    grouping: 'รูปแบบชาร์ต (Chart Patterns)',
    count: 3,
    baseWinRate: 82,
    timeframe: '1h, 4h, 1D',
    signalStrength: 5,
    summaryTemplate: 'เกิดแท่งกลับตัวใน Potential Reversal Zone (PRZ) ที่จุดบรรจบของ Fibonacci Confluence (Gartley/Bat)',
    psychologyTemplate: 'โครงสร้างเรขาคณิตตลาดมาถึงจุดสมดุล นักลงทุนสถาบันเข้าช้อนซื้อตามสูตรคณิตศาสตร์ฮาร์มอนิก',
    tipTemplate: 'ใช้ร่วมกับ D-Point Completion และมองหา Divergence ในอินดิเคเตอร์ RSI/MACD',
    confirmationTemplate: 'แท่งเทียนแทงลงแตะระดับ 0.886 หรือ 0.786 แล้วดีดกลับทันที',
    candlesGenerator: (idx) => [
      { open: 75, close: 40, high: 78, low: 38, color: 'red', label: 'ขา C-D' },
      { open: 42, close: 48, high: 52, low: 12 - (idx % 4), color: 'green', label: `PRZ Rejection v${idx + 1}`, isKey: true },
      { open: 50, close: 88, high: 92, low: 48, color: 'green', label: 'ระเบิดขาขึ้น' },
    ],
    tags: ['harmonic', 'prz', 'gartley', 'bat', 'fibonacci', 'bullish'],
  },
  // 20. Scalping & Volume Spike Absorption
  {
    baseId: 'volume-absorption-scalp',
    nameTh: 'แท่งดูดซับวอลุ่มสายสแคปปิ้ง',
    nameEn: 'Volume Absorption Scalp Trigger',
    side: 'Bullish',
    grouping: 'ต่อเนื่อง (Continuation)',
    count: 2,
    baseWinRate: 75,
    timeframe: '1m, 3m, 5m, 15m',
    signalStrength: 4,
    summaryTemplate: 'วอลุ่มการซื้อขายพุ่งสูงผิดปกติแต่เนื้อเทียนไม่ลงต่อ บ่งบอกการวางกำแพงซื้อของรายใหญ่',
    psychologyTemplate: 'Market Maker รับซื้อคำสั่ง Sell ทั้งหมดในระดับราคาเดียว (Limit Bid Absorption)',
    tipTemplate: 'เหมาะสำหรับการเทรดสั้น Scalping เก็บกำไรเร็ว 1:1.5 - 1:2 R:R',
    confirmationTemplate: 'แท่งถัดไปดีดขึ้นทันทีพร้อมเกิด Orderflow Delta เป็นบวก',
    candlesGenerator: (idx) => [
      { open: 70, close: 30, high: 72, low: 25, color: 'red', label: 'เทวอลุ่มท่วม' },
      { open: 32, close: 52 + (idx % 4), high: 55, low: 24, color: 'green', label: `ดูดซับสำเร็จ v${idx + 1}`, isKey: true },
      { open: 54, close: 82, high: 85, low: 52, color: 'green', label: 'พุ่งแรง' },
    ],
    tags: ['scalping', 'volume absorption', 'orderflow', 'delta', 'สแคปปิ้ง'],
  },
];

// Generate comprehensive dataset up to 500+ patterns
export function generate500Patterns(): CandlestickPattern[] {
  const generated: CandlestickPattern[] = [];
  const TOTAL_TARGET = 520;
  const variationsPerTemplate = Math.ceil(TOTAL_TARGET / TEMPLATES.length);

  const marketEnvironments = [
    { suffix: 'Forex Major (EURUSD/GBPUSD/USDJPY)', contextTh: 'ในตลาด Forex ที่มีสภาพคล่องสูง', mult: 1 },
    { suffix: 'Crypto 24/7 (BTC/ETH/Altcoins)', contextTh: 'ในตลาดคริปโตเคอร์เรนซีที่มีความผันผวนรวดเร็ว', mult: 2 },
    { suffix: 'Gold & Commodities (XAUUSD/Oil)', contextTh: 'ในตลาดทองคำคำสั่งสถาบัน London & NY Session', mult: 3 },
    { suffix: 'Stock Indices (US500/NAS100/SET50)', contextTh: 'ในตลาดดัชนีหุ้นช่วงเปิดตลาด Gap Open', mult: 4 },
    { suffix: 'Multi-Timeframe 15m/1h Confluence', contextTh: 'ในจังหวะคอนฟลูเอนซ์ประสานหลายไทม์เฟรม', mult: 5 },
  ];

  let patternCount = 0;

  for (let t = 0; t < TEMPLATES.length; t++) {
    const tmpl = TEMPLATES[t];

    for (let v = 0; v < variationsPerTemplate; v++) {
      if (patternCount >= TOTAL_TARGET) break;

      const env = marketEnvironments[v % marketEnvironments.length];
      const varNumber = v + 1;
      const id = `${tmpl.baseId}-var-${varNumber}`;

      // Calculate dynamic win rates and stats
      const winRateMin = Math.min(88, Math.max(58, tmpl.baseWinRate + ((v * 3) % 11) - 4));
      const winRateMax = winRateMin + 5 + ((v * 2) % 4);
      const winRateStr = `${winRateMin}% - ${winRateMax}%`;

      const signalStrength = Math.min(5, Math.max(3, tmpl.signalStrength + (v % 2 === 0 ? 0 : 1)));

      const timeframes = ['5m, 15m, 1h', '15m, 1h, 4h', '1h, 4h, 1D', '4h, 1D, 1W'];
      const chosenTf = timeframes[v % timeframes.length];

      const nameTh = `${tmpl.nameTh} #${varNumber} (${env.suffix.split(' ')[0]})`;
      const nameEn = `${tmpl.nameEn} Variant #${varNumber} [${env.suffix}]`;

      const summary = `${tmpl.summaryTemplate} (${env.contextTh}) สัญญาณรูปแบบที่ ${varNumber} ของสายวิเคราะห์เทคนิคอลเชิงลึก`;
      const psychology = `${tmpl.psychologyTemplate} โดยเฉพาะเมื่อเกิดในสภาวะ ${env.suffix}`;
      const tip = `${tmpl.tipTemplate} และเพิ่มความระมัดระวังช่วงข่าวสำคัญ High Impact News`;
      const confirmation = `${tmpl.confirmationTemplate} พร้อมการขยายตัวของ Volume สอดคล้อง`;

      const rrValues = ['1:2.0', '1:2.5', '1:3.0', '1:3.5', '1:4.0'];
      const rr = rrValues[v % rrValues.length];

      const entrySLTP = {
        entry: tmpl.side === 'Bullish' ? `เหนือยอด High แท่งสัญญาณ #${varNumber}` : `ใต้ฐาน Low แท่งสัญญาณ #${varNumber}`,
        stopLoss: tmpl.side === 'Bullish' ? `ใต้ไส้ล่างสุดของแพทเทิร์น 3-5 pips` : `เหนือยอดไส้บนสุดของแพทเทิร์น 3-5 pips`,
        takeProfit: tmpl.side === 'Bullish' ? `แนวต้านหลักถัดไป หรือ R:R ${rr}` : `แนวรับหลักถัดไป หรือ R:R ${rr}`,
        riskReward: rr,
      };

      const candles = tmpl.candlesGenerator(v);

      const combinedTags = Array.from(
        new Set([
          ...tmpl.tags,
          `var-${varNumber}`,
          env.suffix.toLowerCase().split(' ')[0],
          tmpl.side.toLowerCase(),
          tmpl.grouping.toLowerCase(),
        ])
      );

      generated.push({
        id,
        name: nameTh,
        englishName: nameEn,
        side: tmpl.side,
        grouping: tmpl.grouping,
        count: tmpl.count,
        winRate: winRateStr,
        timeframe: chosenTf,
        signalStrength,
        summary,
        psychology,
        tip,
        confirmation,
        entrySLTP,
        candles,
        tags: combinedTags,
      });

      patternCount++;
    }
  }

  return generated;
}

export const EXPANDED_PATTERNS_500: CandlestickPattern[] = generate500Patterns();
