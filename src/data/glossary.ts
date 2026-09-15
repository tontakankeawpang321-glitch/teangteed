export interface TradingGlossaryItem {
  id: string;
  termTh: string;
  termEn: string;
  category: 'CandleStructure' | 'SupportResistance' | 'PriceAction' | 'SMC_ICT' | 'RiskManagement' | 'VolumeIndicators';
  shortDef: string;
  fullExplanation: string;
  example: string;
  practicalTip: string;
  tags: string[];
}

export const GLOSSARY_CATEGORIES = [
  { id: 'all', label: 'ทั้งหมด (100 ศัพท์)', icon: 'BookOpen' },
  { id: 'CandleStructure', label: 'โครงสร้างแท่งเทียน', icon: 'Flame' },
  { id: 'SupportResistance', label: 'แนวรับ-แนวต้าน & โซนราคา', icon: 'Layers' },
  { id: 'PriceAction', label: 'Price Action & แท่งกลับตัว', icon: 'TrendingUp' },
  { id: 'SMC_ICT', label: 'SMC / ICT / สภาพคล่อง', icon: 'Zap' },
  { id: 'RiskManagement', label: 'การบริหารความเสี่ยง & ออเดอร์', icon: 'Shield' },
  { id: 'VolumeIndicators', label: 'Volume & อินดิเคเตอร์', icon: 'BarChart3' },
] as const;

export const TRADING_GLOSSARY_100: TradingGlossaryItem[] = [
  // 1-15: โครงสร้างแท่งเทียน (Candle Structure)
  {
    id: 'g-01',
    termTh: 'เนื้อเทียน (บอดี้)',
    termEn: 'Real Body',
    category: 'CandleStructure',
    shortDef: 'ส่วนทึบของแท่งเทียน แสดงระยะห่างระหว่างราคาเปิดและราคาปิด',
    fullExplanation: 'เนื้อเทียน (Body) คือพื้นที่สี่เหลี่ยมระหว่างราคาเปิด (Open) และราคาปิด (Close) หากเนื้อเทียนมีขนาดใหญ่ แสดงถึงแรงซื้อหรือแรงขายที่ควบคุมตลาดได้อย่างเด็ดขาดในไทม์เฟรมนั้น',
    example: 'แท่งเทียนสีเขียวยาวตัน (Marubozu) ไม่มีไส้เทียน แสดงแรงซื้อ 100%',
    practicalTip: 'เนื้อเทียนที่ใหญ่กว่าแท่งก่อนหน้าอย่างชัดเจน บ่งบอกถึง Momentum ที่ทรงพลัง',
    tags: ['Body', 'โครงสร้างแท่งเทียน', 'Price Action']
  },
  {
    id: 'g-02',
    termTh: 'ไส้เทียน (เงาเทียน)',
    termEn: 'Shadow / Wick',
    category: 'CandleStructure',
    shortDef: 'เส้นที่ยื่นออกจากหัวหรือท้ายเนื้อเทียน แสดงราคาสูงสุดและต่ำสุดที่มีการปฏิเสธราคา',
    fullExplanation: 'ไส้เทียน (Wick หรือ Tail) บันทึกร่องรอยการต่อสู้ของราคา โดยแสดงจุดสูงสุด (High) หรือต่ำสุด (Low) ที่ราคาเคยวิ่งไปถึง แต่ถูกแรงฝั่งตรงข้ามผลักดันกลับเข้ามาสะท้อนถึงการปฏิเสธราคา (Price Rejection)',
    example: 'ไส้เทียนด้านล่างยาว แสดงว่าฝั่งขายพยายามทุบลงไปแต่ฝั่งซื้อสู้กลับขึ้นมา',
    practicalTip: 'ไส้เทียนยิ่งยาวยิ่งแสดงนัยยะสำคัญของการปฏิเสธราคาที่ระดับแนวรับหรือแนวต้าน',
    tags: ['Wick', 'Shadow', 'Rejection']
  },
  {
    id: 'g-03',
    termTh: 'ไส้ปิด (ราคาปิดแท่ง)',
    termEn: 'Close Price / Candle Close',
    category: 'CandleStructure',
    shortDef: 'ราคาปิด ณ วินาทีสุดท้ายของแท่งเทียน ซึ่งเป็นข้อสรุปผลการต่อสู้ที่แท้จริง',
    fullExplanation: 'ไส้ปิด หรือระดับราคาที่แท่งเทียน "ปิดแท่งสมบูรณ์" (Confirmed Close) เป็นสิ่งสำคัญที่สุดในการยืนยันสัญญาณเทรด เทรดเดอร์มืออาชีพจะไม่เข้าออเดอร์ก่อนที่แท่งเทียนจะปิดแท่ง เพราะราคาอาจหดตัวกลายเป็นไส้หลอกได้',
    example: 'รอแท่ง 4 ชั่วโมงปิดเหนือแนวต้าน จึงจะนับว่า Breakout จริง',
    practicalTip: 'ห้ามเทรดก่อนแท่งปิด (Never trade on an unclosed candle) เพื่อหลีกเลี่ยง Fakeout',
    tags: ['Close', 'ไส้ปิด', 'Confirmation']
  },
  {
    id: 'g-04',
    termTh: 'ราคาเปิด',
    termEn: 'Open Price',
    category: 'CandleStructure',
    shortDef: 'ราคาแรกที่มีการซื้อขายเมื่อเริ่มรอบเวลาของแท่งเทียนใหม่',
    fullExplanation: 'ราคาเปิดเป็นจุดอ้างอิงเริ่มต้นของแท่งเทียน หากราคาปิดอยู่สูงกว่าราคาเปิด แท่งเทียนจะเป็นสีเขียว (Bullish) และหากราคาปิดต่ำกว่าราคาเปิด แท่งเทียนจะเป็นสีแดง (Bearish)',
    example: 'ราคาเปิดของแท่ง Day เวลา 07.00 น. ใช้เป็นเกณฑ์วัดแนวโน้มประจำวัน',
    practicalTip: 'การเปิดกระโดด (Gap Open) เหนือราคาปิดเดิม แสดงถึงความต้องการซื้อที่รุนแรงก่อนตลาดเปิด',
    tags: ['Open', 'ราคาเปิด', 'Basic']
  },
  {
    id: 'g-05',
    termTh: 'ราคาสูงสุด',
    termEn: 'High Price',
    category: 'CandleStructure',
    shortDef: 'ระดับราคาสูงสุดที่สามารถขึ้นไปถึงได้ในรอบเวลาของแท่งนั้น',
    fullExplanation: 'ยอดบนสุดของไส้เทียนด้านบน เป็นจุดที่แรงซื้อหมดกำลัง และเริ่มมีแรงขายเข้ามาต้าน',
    example: 'จุด High ของแท่งเทียนมักถูกใช้เป็นจุดวาง Buy Stop หรือ Stop Loss ฝั่ง Sell',
    practicalTip: 'หากราคาขึ้นไปทำ New High แต่เนื้อเทียนปิดต่ำลง แสดงถึง Exhaustion (แรงซื้อหมด)',
    tags: ['High', 'ยอดสูงสุด', 'Price Action']
  },
  {
    id: 'g-06',
    termTh: 'ราคาต่ำสุด',
    termEn: 'Low Price',
    category: 'CandleStructure',
    shortDef: 'ระดับราคาต่ำสุดที่ราคาเคยดิ่งลงไปถึงในรอบเวลาของแท่งนั้น',
    fullExplanation: 'ปลายล่างสุดของไส้เทียนด้านล่าง เป็นจุดที่แรงขายถูกหยุดไว้ และเริ่มมีแรงซื้อช้อนกลับขึ้นมา',
    example: 'จุด Low ของแท่ง Hammer มักถูกใช้เป็นจุดตั้ง Stop Loss ฝั่ง Buy',
    practicalTip: 'การตั้ง Stop Loss ควรเผื่อระยะใต้ Low เล็กน้อยเพื่อป้องกันโดนกวาดไส้ (Spread Buffer)',
    tags: ['Low', 'จุดต่ำสุด', 'Stop Loss']
  },
  {
    id: 'g-07',
    termTh: 'แท่งเทียนกระทิง (แท่งเขียว)',
    termEn: 'Bullish Candle',
    category: 'CandleStructure',
    shortDef: 'แท่งเทียนที่ราคาปิดสูงกว่าราคาเปิด แสดงถึงชัยชนะของฝั่งซื้อ',
    fullExplanation: 'แท่งเทียนที่บ่งบอกว่าผู้ซื้อ (Bulls) เป็นฝ่ายควบคุมตลาดในช่วงเวลานั้น มักแสดงด้วยสีเขียวหรือสีขาว',
    example: 'แท่งเขียวเต็มแท่งกลืนแท่งแดงก่อนหน้า (Bullish Engulfing)',
    practicalTip: 'ดูขนาดของเนื้อเทียนประกอบ หากเนื้อเทียนใหญ่และไม่มีไส้บน แปลว่าแรงซื้อยังคงทรงพลัง',
    tags: ['Bullish', 'แท่งเขียว', 'แรงซื้อ']
  },
  {
    id: 'g-08',
    termTh: 'แท่งเทียนหมี (แท่งแดง)',
    termEn: 'Bearish Candle',
    category: 'CandleStructure',
    shortDef: 'แท่งเทียนที่ราคาปิดต่ำกว่าราคาเปิด แสดงถึงชัยชนะของฝั่งขาย',
    fullExplanation: 'แท่งเทียนที่สะท้อนว่าผู้ขาย (Bears) สามารถกดดันราคาให้ลดลงจากราคาเปิดได้ มักแสดงด้วยสีแดงหรือสีดำ',
    example: 'แท่งแดงยาวทะลุแนวรับลงมาด้วย Volume หนาแน่น',
    practicalTip: 'การเกิดแท่งหมีติดต่อกัน 3 แท่ง (Three Black Crows) เตือนถึงการกลับตัวเป็นขาลงรุนแรง',
    tags: ['Bearish', 'แท่งแดง', 'แรงขาย']
  },
  {
    id: 'g-09',
    termTh: 'แท่งโดจิ',
    termEn: 'Doji',
    category: 'CandleStructure',
    shortDef: 'แท่งเทียนที่ราคาเปิดและราคาปิดอยู่ที่ระดับเดียวกันหรือใกล้เคียงกันมาก สะท้อนความลังเลของตลาด',
    fullExplanation: 'Doji เกิดขึ้นเมื่อแรงซื้อและแรงขายมีพลังเท่ากัน ทำให้ราคาปิดกลับมาที่เดิม บ่งชี้ถึงสภาวะลังเล (Indecision) และมักเป็นสัญญาณเตือนของการพักตัวหรือกลับตัวของแนวโน้มเดิม',
    example: 'เกิด Dragonfly Doji ที่แนวรับสำคัญ บ่งบอกถึงการปฏิเสธราคาฝั่งลง',
    practicalTip: 'อย่าเทรดทันทีเมื่อเจอ Doji ให้รอแท่งถัดไปปิดยืนยันฝั่งชนะก่อน',
    tags: ['Doji', 'ความลังเล', 'Reversal']
  },
  {
    id: 'g-10',
    termTh: 'มารุโบซุ (แท่งตันไม่มีไส้)',
    termEn: 'Marubozu',
    category: 'CandleStructure',
    shortDef: 'แท่งเทียนที่มีแต่เนื้อเทียนเต็มๆ แทบไม่มีไส้บนและไส้ล่าง บ่งชี้ Momentum ฝั่งใดฝั่งหนึ่งแบบ 100%',
    fullExplanation: 'Marubozu ในภาษาญี่ปุ่นแปลว่า "ศีรษะโล้น" เป็นแท่งเทียนที่ราคาเปิดคือจุดสูงสุด/ต่ำสุด และราคาปิดคือจุดตรงข้าม แสดงว่าฝั่งใดฝั่งหนึ่งลากราคาไปทิศทางเดียวตั้งแต่ต้นจนจบแท่ง',
    example: 'Bullish Marubozu เกิดขึ้นหลังประกาศข่าวตัวเลขเศรษฐกิจบวก',
    practicalTip: 'ใช้จุดกึ่งกลาง (50%) ของเนื้อแท่ง Marubozu เป็นแนวรับ/แนวต้านย่อยในการเทรด Pullback',
    tags: ['Marubozu', 'Momentum', 'Trend']
  },
  {
    id: 'g-11',
    termTh: 'การปฏิเสธราคา',
    termEn: 'Price Rejection',
    category: 'CandleStructure',
    shortDef: 'พฤติกรรมที่ราคาพยายามวิ่งผ่านระดับหนึ่ง แต่ถูกผลักดันกลับอย่างรวดเร็วเกิดเป็นไส้ยาว',
    fullExplanation: 'Price Rejection เกิดจากการที่มีออเดอร์ฝั่งตรงข้ามปริมาณมหาศาลรออยู่ที่ระดับราคานั้น ทำให้ราคาทะลุไม่ผ่านและทิ้งไส้เทียนยาวไว้',
    example: 'ไส้เทียนยาวแตะเส้น EMA 200 แล้วเด้งกลับทันที',
    practicalTip: 'Rejection ที่เกิดในโซน Key Level มีความแม่นยำสูงกว่า Rejection กลางอากาศ',
    tags: ['Rejection', 'ไส้เทียน', 'Liquidity']
  },
  {
    id: 'g-12',
    termTh: 'การดูดซับสภาพคล่อง (ไส้กวาด)',
    termEn: 'Liquidity Sweep / Wick Hunt',
    category: 'CandleStructure',
    shortDef: 'การที่แท่งเทียนทิ้งไส้ยื่นออกไปกิน Stop Loss เหนือ High หรือใต้ Low ก่อนจะดึงกลับอย่างรวดเร็ว',
    fullExplanation: 'พฤติกรรมของรายใหญ่ (Smart Money) ที่ดันราคาให้เลยจุดสวิงเดิม เพื่อจับคู่กับ Stop Loss ของรายย่อย แล้วจึงลากราคาไปในทิศทางจริง',
    example: 'ราคาแลบทะลุแนวต้านไป 10 จุดแล้วปิดกลับลงมาเป็นแท่ง Pinbar',
    practicalTip: 'อย่าตั้ง Stop Loss พอดีกับแนวรับแนวต้าน ให้เว้นระยะปลอดภัยเผื่อไส้กวาดเสมอ',
    tags: ['Sweep', 'Stop Hunt', 'SMC']
  },
  {
    id: 'g-13',
    termTh: 'อัตราส่วนไส้ต่อเนื้อ',
    termEn: 'Wick to Body Ratio',
    category: 'CandleStructure',
    shortDef: 'สัดส่วนความยาวของไส้เทียนเทียบกับขนาดของเนื้อเทียน ใช้ประเมินความชัดเจนของแรงซื้อขาย',
    fullExplanation: 'แท่งเทียนที่มีไส้ยาวกว่าเนื้อเทียน 2-3 เท่า (เช่น Pinbar, Hammer, Shooting Star) จะมีนัยยะของการกลับตัวมากกว่าแท่งที่เนื้อเทียนสมส่วน',
    example: 'Hammer ที่ดีควรมีไส้ล่างยาวอย่างน้อย 2 เท่าของความสูงเนื้อเทียน',
    practicalTip: 'หากเนื้อเทียนเล็กมากและไส้สองฝั่งยาวเท่ากัน (High Wave Candle) แสดงถึงความผันผวนสูงมาก',
    tags: ['Ratio', 'Pinbar', 'Analysis']
  },
  {
    id: 'g-14',
    termTh: 'กรอบเวลาแท่งเทียน (ไทม์เฟรม)',
    termEn: 'Timeframe (TF)',
    category: 'CandleStructure',
    shortDef: 'ระยะเวลาที่กำหนดสำหรับ 1 แท่งเทียน เช่น 1m, 15m, 1h, 4h, 1D, 1W',
    fullExplanation: 'แท่งเทียน 1 แท่งใน TF 4h เกิดจากการรวมตัวกันของแท่ง 1h จำนวน 4 แท่ง ยิ่งไทม์เฟรมใหญ่ สัญญาณจะยิ่งมีน้ำหนักและความน่าเชื่อถือสูงกว่า',
    example: 'วิเคราะห์แนวโน้มหลักบน D1 และหาจังหวะเข้าเทรดบน 15m (Multi-Timeframe Analysis)',
    practicalTip: 'อย่าเทรดสวนสัญญาณแท่งเทียนใน Higher Timeframe (HTF)',
    tags: ['Timeframe', 'MTF', 'Structure']
  },
  {
    id: 'g-15',
    termTh: 'ช่องว่างราคา (แก๊ป)',
    termEn: 'Price Gap',
    category: 'CandleStructure',
    shortDef: 'ช่องว่างระหว่างราคาปิดของแท่งก่อนหน้ากับราคาเปิดของแท่งใหม่ที่ไม่มีการซื้อขายคั่นกลาง',
    fullExplanation: 'Gap มักเกิดขึ้นช่วงเปิดตลาดเช้าวันจันทร์ หรือช่วงข่าวแรง สะท้อนถึงคำสั่งซื้อขายที่ล้นทะลักจนราคากระโดดข้ามระดับไป',
    example: 'Common Gap, Breakaway Gap, Runaway Gap, Exhaustion Gap',
    practicalTip: 'ตลาดมักมีแนวโน้มกลับมาปิดช่องว่างราคา (Gap Fill) ในเวลาต่อมา',
    tags: ['Gap', 'ช่องว่างราคา', 'Volatility']
  },

  // 16-35: แนวรับ-แนวต้าน & โซนราคา (Support & Resistance)
  {
    id: 'g-16',
    termTh: 'แนวรับ',
    termEn: 'Support Level',
    category: 'SupportResistance',
    shortDef: 'ระดับราคาที่มีแรงซื้อรออยู่หนาแน่น คอยพยุงไม่ให้ราคาลดต่ำลงไปกว่าเดิม',
    fullExplanation: 'แนวรับ (Support) คือโซนราคาด้านล่างที่จิตวิทยาตลาดมองว่าเป็นของถูก ทำให้ผู้ซื้อกรูกันเข้ามาเปิดออเดอร์ Buy ในขณะที่ฝั่งขายชะลอการขาย จึงเกิดเป็นแนวป้องกันราคาตก',
    example: 'ราคาลงมาแตะแนวรับ 2,000 ดอลลาร์ แล้วเกิดแท่ง Bullish Engulfing เด้งกลับขึ้นไป',
    practicalTip: 'แนวรับไม่ใช่เส้นบรรทัดเส้นเดียว แต่ควรตีเป็น "กรอบโซนราคา" (Zone)',
    tags: ['Support', 'แนวรับ', 'Key Level']
  },
  {
    id: 'g-17',
    termTh: 'แนวต้าน',
    termEn: 'Resistance Level',
    category: 'SupportResistance',
    shortDef: 'ระดับราคาที่มีแรงขายกดดันอยู่หนาแน่น คอยสกัดกั้นไม่ให้ราคาปรับตัวสูงขึ้น',
    fullExplanation: 'แนวต้าน (Resistance) คือโซนราคาด้านบนที่จิตวิทยาตลาดมองว่าเป็นของแพง ฝั่งซื้อเริ่มทำกำไรปิดออเดอร์ และฝั่งขายเริ่มเปิดออเดอร์ Sell กดดันราคาให้ร่วงลง',
    example: 'ราคาขึ้นชนแนวต้าน 2,080 ดอลลาร์ไม่ผ่านถึง 3 ครั้ง เกิดเป็น Triple Top',
    practicalTip: 'แนวต้านที่ถูกทดสอบบ่อยครั้งจะเริ่มอ่อนแอลงเรื่อยๆ และมีโอกาสทะลุในที่สุด',
    tags: ['Resistance', 'แนวต้าน', 'Supply']
  },
  {
    id: 'g-18',
    termTh: 'การสลับหน้าที่แนวรับ-แนวต้าน',
    termEn: 'Role Reversal (SR Flip)',
    category: 'SupportResistance',
    shortDef: 'ปรากฏการณ์ที่แนวต้านเดิมที่ถูกทะลุผ่าน กลายสภาพมาทำหน้าที่เป็นแนวรับใหม่ (หรือในทางกลับกัน)',
    fullExplanation: 'เมื่อแนวต้านถูก Breakout ขึ้นไป คนที่เคยตั้ง Sell ไว้จะยอมแพ้ และรอให้ราคาย่อกลับมาเพื่อปิดเสมอตัวหรือเปลี่ยนเป็น Buy ทำให้แนวต้านเดิมกลายเป็นแนวรับใหม่ที่แข็งแกร่ง (Resistance becomes Support)',
    example: 'Breakout ทะลุแนวต้าน 100 บาท แล้วราคาย่อลงมาทดสอบที่ 100 บาทอีกครั้งก่อนพุ่งต่อ',
    practicalTip: 'จังหวะ Re-test ที่จุด SR Flip คือหนึ่งในจุดเข้าเทรดที่ปลอดภัยและ Risk-to-Reward คุ้มค่าที่สุด',
    tags: ['SR Flip', 'Role Reversal', 'Breakout']
  },
  {
    id: 'g-19',
    termTh: 'แนวรับแนวต้านทางจิตวิทยา',
    termEn: 'Psychological Numbers / Round Numbers',
    category: 'SupportResistance',
    shortDef: 'ระดับราคาที่เป็นเลขกลมๆ เช่น 100, 1,000, 2,000 ซึ่งมนุษย์มักใช้ตั้งคำสั่งซื้อขายล่วงหน้า',
    fullExplanation: 'มนุษย์และอัลกอริทึมมักชอบตัวเลขกลมๆ ทำให้มี Limit Order และ Stop Loss กระจุกตัวอยู่อย่างมหาศาล กลายเป็นแนวรับแนวต้านธรรมชาติที่มองไม่เห็นบนชาร์ตเปล่า',
    example: 'ราคาทองคำมักชะลอตัวและผันผวนอย่างรุนแรงที่ระดับ 2,500 และ 2,600 ดอลลาร์',
    practicalTip: 'อย่าตั้งเป้าหมาย TP พอดีเป๊ะที่เลขกลม ให้ตั้งต่ำกว่าเลขกลม 2-3 จุดเพื่อชิงปิดก่อนคนอื่น',
    tags: ['Psychological', 'Round Numbers', 'Level']
  },
  {
    id: 'g-20',
    termTh: 'เส้นแนวโน้ม',
    termEn: 'Trendline',
    category: 'SupportResistance',
    shortDef: 'เส้นทแยงมุมที่ลากเชื่อมจุดต่ำสุด (ในขาขึ้น) หรือจุดสูงสุด (ในขาลง) เพื่อบอกทิศทางและทำหน้าที่เป็นแนวรับแนวต้านเคลื่อนที่',
    fullExplanation: 'Trendline ขาขึ้น ลากเชื่อม Higher Lows อย่างน้อย 2-3 จุด ทำหน้าที่เป็น Dynamic Support ส่วน Trendline ขาลง ลากเชื่อม Lower Highs ทำหน้าที่เป็น Dynamic Resistance',
    example: 'ราคาย่อมาสัมผัสเส้น Trendline เส้นที่ 3 แล้วเกิดแท่ง Hammer ยืนยันเด้งต่อ',
    practicalTip: 'Trendline ที่ชันเกินไป (มากกว่า 60 องศา) มักอยู่ได้ไม่นานและจะถูกเบรกได้ง่าย',
    tags: ['Trendline', 'เส้นแนวโน้ม', 'Dynamic Level']
  },
  {
    id: 'g-21',
    termTh: 'การเบรกเอาท์ (ทะลุผ่าน)',
    termEn: 'Breakout',
    category: 'SupportResistance',
    shortDef: 'เหตุการณ์ที่ราคาสามารถทะลุผ่านแนวรับ แนวต้าน หรือกรอบไซด์เวย์ออกไปได้อย่างเด็ดขาด',
    fullExplanation: 'Breakout ที่แท้จริงมักมาพร้อมกับแท่งเทียนแท่งใหญ่ (Impulsive Candle) และ Volume ปริมาณมาก ซึ่งแสดงว่าตลาดพร้อมจะเริ่มแนวโน้มรอบใหม่',
    example: 'ทะลุแนวต้าน 50 บาท ด้วยแท่งเขียวยาวและ Volume สูงกว่าค่าเฉลี่ย 3 เท่า',
    practicalTip: 'ระวังการซื้อไล่ราคาตอนเพิ่งเบรก ควรรอย่อ Pullback เพื่อลดความเสี่ยง',
    tags: ['Breakout', 'เบรกเอาท์', 'Momentum']
  },
  {
    id: 'g-22',
    termTh: 'การเบรกหลอก (ทะลุปลอม)',
    termEn: 'Fakeout / False Breakout',
    category: 'SupportResistance',
    shortDef: 'ราคาทำท่าเหมือนจะทะลุแนวรับ/แนวต้าน แต่สุดท้ายกลับทิ้งไส้แล้วม้วนตัวกลับเข้ามาในกรอบเดิม',
    fullExplanation: 'Fakeout มักเกิดจากรายใหญ่ผลักดันราคาให้ทะลุกรอบเพื่อล่อให้รายย่อยเปิดออเดอร์ตาม (Breakout Traders) แล้วทุบกลับเพื่อฮุบสภาพคล่อง',
    example: 'แท่งเทียนพุ่งทะลุแนวต้านไป 5 นาที ก่อนแท่งชั่วโมงจะปิดเป็น Shooting Star แดงเถือก',
    practicalTip: 'ให้รอการปิดแท่งเทียนสมบูรณ์ (Candle Close Confirmation) ก่อนสรุปว่าเป็น Breakout จริง',
    tags: ['Fakeout', 'False Break', 'Trap']
  },
  {
    id: 'g-23',
    termTh: 'การย่อตัวกลับมาทดสอบ',
    termEn: 'Pullback / Re-test',
    category: 'SupportResistance',
    shortDef: 'การที่ราคาหลังจากทะลุแนวต้าน/แนวรับไปแล้ว ถอยหลังกลับมาแตะระดับเดิมอีกครั้งเพื่อยืนยันความแข็งแกร่ง',
    fullExplanation: 'เมื่อราคา Breakout ผ่านแนวต้าน มักจะมีแรงขายทำกำไรระยะสั้นทำให้ราคาย่อตัวกลับมาทดสอบแนวต้านเดิมที่กลายเป็นแนวรับ หากมีแรงซื้อรับอยู่ ราคาจะพุ่งต่ออย่างมั่นคง',
    example: 'Buy เมื่อราคาย่อ Re-test แนวรับใหม่แล้วเกิดสัญญาณแท่งเทียน Bullish Pinbar',
    practicalTip: 'การเข้าที่ Pullback จะทำให้ได้ระยะ Stop Loss ที่สั้นมากเมื่อเทียบกับเป้ากำไร',
    tags: ['Pullback', 'Retest', 'Entry']
  },
  {
    id: 'g-24',
    termTh: 'โซนความต้องการซื้อ (ดีมานด์โซน)',
    termEn: 'Demand Zone',
    category: 'SupportResistance',
    shortDef: 'พื้นที่สะสมคำสั่งซื้อขนาดใหญ่ของสถาบันการเงิน ก่อนที่ราคาจะพุ่งขึ้นอย่างรวดเร็ว',
    fullExplanation: 'Demand Zone มักสังเกตได้จากบริเวณฐานราคาที่มีการพักตัวสั้นๆ แล้วตามด้วยแท่งเขียวยาวรุนแรง (Rally-Base-Rally หรือ Drop-Base-Rally)',
    example: 'เมื่อราคากลับลงมาสัมผัส Demand Zone มักจะเกิดแรงดีดกลับอย่างฉับพลัน',
    practicalTip: 'Fresh Demand Zone (โซนที่ราคายังไม่เคยกลับมาแตะเลย) จะมีโอกาสชนะสูงสุด',
    tags: ['Demand Zone', 'Supply Demand', 'SMC']
  },
  {
    id: 'g-25',
    termTh: 'โซนความต้องการขาย (ซัพพลายโซน)',
    termEn: 'Supply Zone',
    category: 'SupportResistance',
    shortDef: 'พื้นที่สะสมคำสั่งขายขนาดใหญ่ของสถาบันการเงิน ก่อนที่ราคาจะร่วงลงอย่างรวดเร็ว',
    fullExplanation: 'Supply Zone คือจุดเริ่มต้นของการทุบราคาลงอย่างหนัก (Rally-Base-Drop หรือ Drop-Base-Drop) แสดงว่ายังมีคำสั่งขายที่ยังไม่ถูกจับคู่ค้างอยู่',
    example: 'รอเปิด Sell เมื่อราคาวิ่งกลับขึ้นมาแตะขอบล่างของ Supply Zone',
    practicalTip: 'ถ้าโซนถูกทดสอบเกิน 3 ครั้ง ให้ระวังโซนแตกเนื่องจากคำสั่งซื้อขายถูกใช้ไปหมดแล้ว',
    tags: ['Supply Zone', 'Order Flow', 'Key Level']
  },
  {
    id: 'g-26',
    termTh: 'จุดสวิงไฮ (ยอดคลื่นบน)',
    termEn: 'Swing High',
    category: 'SupportResistance',
    shortDef: 'จุดสูงสุดเฉพาะจุด ที่มีแท่งเทียนซ้ายและขวาทำจุดสูงสุดต่ำกว่า',
    fullExplanation: 'Swing High คือจุดเลี้ยวของราคาจากขาขึ้นเป็นขาลงชั่วคราว เป็นจุดที่มักมี Stop Loss ฝั่ง Sell ตั้งอยู่หนาแน่น',
    example: 'โครงสร้างขาขึ้นจะสร้าง Higher High (HH) และ Higher Low (HL) ต่อเนื่อง',
    practicalTip: 'ใช้ Swing High ล่าสุดเป็นจุดอ้างอิงในการวัดการเปลี่ยนโครงสร้างตลาด (BOS/CHoCH)',
    tags: ['Swing High', 'Market Structure', 'High']
  },
  {
    id: 'g-27',
    termTh: 'จุดสวิงโลว์ (ยอดคลื่นล่าง)',
    termEn: 'Swing Low',
    category: 'SupportResistance',
    shortDef: 'จุดต่ำสุดเฉพาะจุด ที่มีแท่งเทียนซ้ายและขวาทำจุดต่ำสุดสูงกว่า',
    fullExplanation: 'Swing Low คือจุดเลี้ยวของราคาจากขาลงเป็นขาขึ้นชั่วคราว เป็นจุดที่มักมี Stop Loss ฝั่ง Buy วางอยู่ด้านล่าง',
    example: 'โครงสร้างขาลงจะสร้าง Lower Low (LL) และ Lower High (LH) ต่อเนื่อง',
    practicalTip: 'การหลุด Swing Low สำคัญในขาขึ้น เป็นสัญญาณแรกของการเปลี่ยนเทรนด์',
    tags: ['Swing Low', 'Market Structure', 'Low']
  },
  {
    id: 'g-28',
    termTh: 'กรอบไซด์เวย์ (การสะสมราคา)',
    termEn: 'Consolidation / Range',
    category: 'SupportResistance',
    shortDef: 'สภาวะที่ราคาแกว่งตัวในกรอบแคบๆ ระหว่างแนวรับและแนวต้านโดยไม่มีทิศทางชัดเจน',
    fullExplanation: 'ช่วงเวลาที่ตลาดกำลังสะสมพลัง (Accumulation หรือ Distribution) รอการเลือกทิศทาง แท่งเทียนมักจะสลับเขียวแดงและมีไส้บนล่าง',
    example: 'ราคาแกว่งตัวระหว่าง 1,800 - 1,820 มาตลอดทั้งสัปดาห์',
    practicalTip: 'อย่าเล่นแบบ Trend Following ในกรอบไซด์เวย์ ให้รอ Breakout หรือเล่นแบบ Buy Low Sell High',
    tags: ['Consolidation', 'Range', 'Sideway']
  },
  {
    id: 'g-29',
    termTh: 'แนวรับแนวต้านแบบเคลื่อนที่',
    termEn: 'Dynamic Support & Resistance',
    category: 'SupportResistance',
    shortDef: 'แนวรับแนวต้านที่เปลี่ยนแปลงระดับราคาไปตามกาลเวลา เช่น เส้นค่าเฉลี่ย EMA / SMA หรือ Bollinger Bands',
    fullExplanation: 'ต่างจากแนวรับแนวนอน (Static S/R) ที่เป็นค่าคงที่ เส้น Dynamic S/R จะขยับตามทิศทางราคา เช่น ในเทรนด์ขาขึ้นแรงๆ ราคาจะย่อลงมาแตะเส้น EMA 20 แล้วเด้งขึ้นเสมอ',
    example: 'เส้น EMA 50 และ EMA 200 บนกราฟ Day มักทำหน้าที่เป็นแนวรับต้านชั้นยอด',
    practicalTip: 'จุดที่ Dynamic S/R ตัดกับ Static Horizontal S/R เรียกว่าจุด Confluence ซึ่งทรงพลังมาก',
    tags: ['Dynamic S/R', 'EMA', 'Moving Average']
  },
  {
    id: 'g-30',
    termTh: 'จุดบรรจบของสัญญาณ',
    termEn: 'Confluence Zone',
    category: 'SupportResistance',
    shortDef: 'บริเวณที่เครื่องมือวิเคราะห์หลายชนิดชี้เป้ามาที่ระดับราคาเดียวกัน เพิ่มความน่าจะเป็นในการชนะ',
    fullExplanation: 'เช่น ที่ราคา 2,000 ดอลลาร์ มีทั้งแนวรับแนวนอน + Fibonacci Retracement 61.8% + เส้น EMA 200 + Demand Zone มารวมกัน',
    example: 'เข้าเทรดเฉพาะเมื่อมี Confluence อย่างน้อย 3 ปัจจัยขึ้นไป',
    practicalTip: 'การเทรดที่ Confluence Zone จะช่วยลดสัญญาณหลอก (Noise) ได้อย่างมหาศาล',
    tags: ['Confluence', 'ความแม่นยำ', 'Strategy']
  },

  // 31-50: Price Action & แท่งกลับตัว (Price Action & Reversal)
  {
    id: 'g-31',
    termTh: 'แท่งกลืนกินฝั่งซื้อ',
    termEn: 'Bullish Engulfing',
    category: 'PriceAction',
    shortDef: 'แท่งเขียวขนาดใหญ่ที่เปิดต่ำแล้ววิ่งขึ้นปิดคลุมเนื้อแท่งแดงก่อนหน้าจนมิด',
    fullExplanation: 'รูปแบบแท่งกลับตัวขาขึ้น 2 แท่ง โดยแท่งแรกเป็นแท่งแดง และแท่งที่สองเป็นแท่งเขียวที่มีเนื้อเทียนกลืนกินแท่งแรกอย่างสมบูรณ์ แสดงการเปลี่ยนผ่านการคุมเกมจากหมีสู่กระทิง',
    example: 'เกิด Bullish Engulfing ที่แนวรับเส้นล่างของกรอบ Channel ขาขึ้น',
    practicalTip: 'หาก Volume ของแท่งเขียวมากกว่าแท่งแดงอย่างชัดเจน จะมีความแม่นยำสูงมาก',
    tags: ['Bullish Engulfing', 'กลืนกิน', 'Reversal']
  },
  {
    id: 'g-32',
    termTh: 'แท่งกลืนกินฝั่งขาย',
    termEn: 'Bearish Engulfing',
    category: 'PriceAction',
    shortDef: 'แท่งแดงขนาดใหญ่ที่เปิดสูงแล้วเทขายปิดคลุมเนื้อแท่งเขียวก่อนหน้าจนมิด',
    fullExplanation: 'รูปแบบแท่งกลับตัวขาลง 2 แท่ง แสดงว่าแรงขายเข้ามาถล่มจนกลืนแรงซื้อของแท่งก่อนหน้าจนหมดสิ้น มักพบที่ยอดดอยหรือแนวต้านสำคัญ',
    example: 'Bearish Engulfing เกิดขึ้นหลังราคาทำ New High แต่เกิด RSI Bearish Divergence',
    practicalTip: 'ตั้ง Stop Loss ไว้เหนือจุดสูงสุดของแท่งกลืนกินฝั่งขาย',
    tags: ['Bearish Engulfing', 'กลืนกินขาลง', 'Reversal']
  },
  {
    id: 'g-33',
    termTh: 'แท่งค้อน (แฮมเมอร์)',
    termEn: 'Hammer',
    category: 'PriceAction',
    shortDef: 'แท่งเทียนที่มีเนื้อขนาดเล็กอยู่ด้านบน และมีไส้เทียนล่างยาวเป็น 2-3 เท่าของเนื้อเทียน เกิดที่ก้นเหว',
    fullExplanation: 'เกิดในแนวโน้มขาลง แสดงว่าฝั่งขายพยายามกดราคาลงไปต่ำมาก แต่ฝั่งซื้อกวาดซื้อกลับขึ้นมาจนปิดแท่งใกล้จุดสูงสุด สะท้อนการปฏิเสธราคาฝั่งลงอย่างรุนแรง',
    example: 'Hammer เกิดขึ้นหลังราคาดิ่งลงมา 5 วันติดต่อกัน',
    practicalTip: 'สีของแท่ง Hammer เขียวหรือแดงก็ได้ แต่ถ้าเป็นสีเขียวจะให้สัญญาณที่แข็งแกร่งกว่า',
    tags: ['Hammer', 'แท่งค้อน', 'Bullish Reversal']
  },
  {
    id: 'g-34',
    termTh: 'แท่งดาวตก (ชู๊ตติ้งสตาร์)',
    termEn: 'Shooting Star',
    category: 'PriceAction',
    shortDef: 'แท่งเทียนที่มีเนื้อขนาดเล็กอยู่ด้านล่าง และมีไส้เทียนบนยาว 2-3 เท่า เกิดที่ยอดดอย',
    fullExplanation: 'เกิดในแนวโน้มขาขึ้น ฝั่งซื้อพยายามลากราคาทำ New High แต่ถูกแรงขายสถาบันเทขายกระหน่ำจนราคาปิดร่วงลงมาใกล้จุดต่ำสุด บ่งชี้การจบของรอบขาขึ้น',
    example: 'เกิด Shooting Star ทะลุแนวต้านแล้วรูดกลับลงมา',
    practicalTip: 'รอแท่งเทียนถัดไปปิดเป็นแท่งแดงเพื่อยืนยันการกลับตัว',
    tags: ['Shooting Star', 'ดาวตก', 'Bearish Reversal']
  },
  {
    id: 'g-35',
    termTh: 'พินบาร์',
    termEn: 'Pin Bar (Pinocchio Bar)',
    category: 'PriceAction',
    shortDef: 'แท่งเทียนที่มีไส้ยาวข้างเดียวเหมือนจมูกพิน็อกคิโอ บ่งชี้ว่าตลาดกำลัง "โกหก" และพร้อมดีดกลับ',
    fullExplanation: 'Pin Bar คือชื่อเรียกทางสากลของแท่งเทียนประเภท Hammer / Shooting Star โดยเน้นจุดเด่นที่ไส้ยาวเกิน 66% ของความยาวแท่งทั้งหมด สะท้อน Rejection ที่รุนแรง',
    example: 'Bullish Pin Bar เด้งออกจากแนวรับ Fibonacci 50%',
    practicalTip: 'สามารถตั้งคำสั่ง Buy Limit ที่ระดับ 50% ของความยาวไส้ Pin Bar เพื่อให้ได้ต้นทุนที่ดีขึ้น',
    tags: ['Pin Bar', 'พินบาร์', 'Price Action']
  },
  {
    id: 'g-36',
    termTh: 'แท่งคนแขวนคอ',
    termEn: 'Hanging Man',
    category: 'PriceAction',
    shortDef: 'รูปร่างเหมือน Hammer ทุกประการ แต่เกิดขึ้นที่ยอดขาขึ้น เตือนว่าแรงขายเริ่มแอบแฝงเข้ามา',
    fullExplanation: 'แม้ราคาจะถูกดึงกลับมาปิดสูงได้ แต่การที่ราคาเคยร่วงลงไปลึกจนเกิดไส้ล่างยาว แสดงว่าแนวรับเริ่มมีรอยรั่วและฝั่งขายเริ่มลองเชิงตลาด',
    example: 'เกิด Hanging Man ที่แนวต้าน All Time High',
    practicalTip: 'ต้องรอแท่งถัดไปปิดต่ำกว่าเนื้อเทียนของ Hanging Man จึงจะถือว่าคอนเฟิร์มสัญญาณ Sell',
    tags: ['Hanging Man', 'คนแขวนคอ', 'Warning']
  },
  {
    id: 'g-37',
    termTh: 'แท่งค้อนกลับหัว',
    termEn: 'Inverted Hammer',
    category: 'PriceAction',
    shortDef: 'รูปร่างเหมือน Shooting Star แต่เกิดขึ้นที่ก้นเหวขาลง แสดงว่าเริ่มมีแรงซื้อเข้ามาทดสอบ',
    fullExplanation: 'เกิดหลังแนวโน้มขาลงยาวนาน แม้ราคาจะถูกทุบกลับมาปิดล่าง แต่การที่ราคาเคยพุ่งขึ้นไปทำไส้บนยาว แสดงว่าฝั่งซื้อเริ่มรวบรวมกำลังและพร้อมจะกลับตัว',
    example: 'Inverted Hammer เกิดขึ้นที่แนวรับใหญ่พร้อม Volume สูงผิดปกติ',
    practicalTip: 'ต้องรอแท่งเทียนถัดไปปิดเขียวทะลุเนื้อ Inverted Hammer เพื่อยืนยัน',
    tags: ['Inverted Hammer', 'ค้อนกลับหัว', 'Bottom']
  },
  {
    id: 'g-38',
    termTh: 'ดาวประกายพรึก (ดาวรุ่ง)',
    termEn: 'Morning Star',
    category: 'PriceAction',
    shortDef: 'รูปแบบกลับตัวขาขึ้น 3 แท่ง ประกอบด้วย [แท่งแดงยาว] + [แท่งเล็ก/โดจิ] + [แท่งเขียวยาว]',
    fullExplanation: 'เป็นหนึ่งในรูปแบบกลับตัวที่แม่นยำที่สุด แท่งแรกแสดงแรงขายเดิม แท่งกลางแสดงการหยุดชะงัก และแท่งที่สามแสดงแรงซื้อใหม่ที่เข้ามาเอาชนะได้อย่างเบ็ดเสร็จ',
    example: 'Morning Star เกิดขึ้นที่ฐานคลื่น Wave 2 ก่อนขึ้น Wave 3',
    practicalTip: 'แท่งที่สามควรปิดเกินกึ่งกลาง (50%) ของเนื้อแท่งแดงแรกเป็นอย่างน้อย',
    tags: ['Morning Star', '3 แท่งกลับตัว', 'Bullish']
  },
  {
    id: 'g-39',
    termTh: 'ดาวประกายดับ (ดาวพลบค่ำ)',
    termEn: 'Evening Star',
    category: 'PriceAction',
    shortDef: 'รูปแบบกลับตัวขาลง 3 แท่ง ประกอบด้วย [แท่งเขียวยาว] + [แท่งเล็ก/โดจิ] + [แท่งแดงยาว]',
    fullExplanation: 'สะท้อนว่าแรงซื้อหมดพลังที่ยอดดอย และฝั่งขายเริ่มเทกระจาดจนราคาปิดต่ำลงมาเกินครึ่งหนึ่งของแท่งเขียวแรก',
    example: 'Evening Star เกิดขึ้นบนกราฟรายสัปดาห์ (Weekly) เตือนถึงการปรับฐานใหญ่',
    practicalTip: 'Stop Loss วางเหนือจุดสูงสุดของแท่งกลาง (Star)',
    tags: ['Evening Star', 'ดาวพลบค่ำ', 'Bearish']
  },
  {
    id: 'g-40',
    termTh: 'อีกาสามตัว',
    termEn: 'Three Black Crows',
    category: 'PriceAction',
    shortDef: 'แท่งแดงยาว 3 แท่งเรียงตัวลดหลั่นลงมาต่อเนื่อง แสดงแรงขายถล่มทลาย',
    fullExplanation: 'รูปแบบต่อเนื่องของฝั่งขาย โดยแต่ละแท่งเปิดในเนื้อแท่งก่อนหน้าและปิดทำ New Low ใหม่เสมอ ชี้ชัดว่าตลาดเข้าสู่สภาวะขาลงสมบูรณ์แบบ',
    example: 'เกิด Three Black Crows หลังหลุดแนวรับโครงสร้างหลัก',
    practicalTip: 'อย่าเพิ่งรีบเปิด Sell ไล่ราคาแท่งที่ 3 ควรรอจังหวะดีด Pullback สั้นๆ ก่อนเข้า',
    tags: ['Three Black Crows', 'อีกาสามตัว', 'Strong Trend']
  },
  {
    id: 'g-41',
    termTh: 'ทหารเสือสามนาย',
    termEn: 'Three White Soldiers',
    category: 'PriceAction',
    shortDef: 'แท่งเขียวยาว 3 แท่งเรียงตัวไต่ระดับขึ้นต่อเนื่อง แสดงแรงซื้อที่แข็งแกร่งมาก',
    fullExplanation: 'แต่ละแท่งเปิดในเนื้อของแท่งก่อนหน้าและปิดที่ระดับราคาสูงขึ้นเรื่อยๆ แทบไม่มีไส้เทียนบน แสดงการสะสมพลังและผลักดันราคาของกลุ่มทุน',
    example: 'Three White Soldiers พลิกฟื้นจากแนวรับใหญ่',
    practicalTip: 'สัญญาณนี้บอกว่าแรงซื้อมี Momentum สูงมาก เหมาะกับการเล่นตามเทรนด์ (Trend Following)',
    tags: ['Three White Soldiers', 'ทหารสามนาย', 'Bullish']
  },
  {
    id: 'g-42',
    termTh: 'แม่ลูกอ่อนฝั่งซื้อ',
    termEn: 'Bullish Harami',
    category: 'PriceAction',
    shortDef: 'แท่งแรกเป็นแท่งแดงใหญ่ (แม่) และแท่งที่สองเป็นแท่งเขียวเล็กที่อยู่ภายในขอบเขตเนื้อของแท่งแรก (ลูก)',
    fullExplanation: 'Harami ในภาษาญี่ปุ่นแปลว่า "ตั้งครรภ์" บ่งบอกว่าความผันผวนและแรงขายเดิมลดลงอย่างฮวบฮาบ ตลาดเริ่มเข้าสู่โหมดพักตัวและเตรียมดีดกลับ',
    example: 'เกิด Bullish Harami Cross (แท่งลูกเป็น Doji) ที่แนวรับสำคัญ',
    practicalTip: 'รอให้ราคาเบรกทะลุจุดสูงสุดของแท่งแม่เพื่อยืนยันการขึ้น',
    tags: ['Harami', 'แม่ลูกอ่อน', 'Inside Bar']
  },
  {
    id: 'g-43',
    termTh: 'แม่ลูกอ่อนฝั่งขาย',
    termEn: 'Bearish Harami',
    category: 'PriceAction',
    shortDef: 'แท่งแรกเป็นแท่งเขียวใหญ่ และแท่งที่สองเป็นแท่งแดงเล็กที่ถูกโอบอุ้มอยู่ในเนื้อแท่งแรก',
    fullExplanation: 'แรงซื้อเดิมที่เคยพุ่งแรงถูกหยุดยั้งไว้ได้อย่างกะทันหัน สะท้อนการชะลอตัวของขาขึ้น',
    example: 'Bearish Harami ที่เส้นขอบบนของ Bollinger Bands',
    practicalTip: 'เป็นสัญญาณเตือนให้เริ่มทยอย Take Profit ฝั่ง Buy',
    tags: ['Bearish Harami', 'ชะลอตัว', 'Reversal']
  },
  {
    id: 'g-44',
    termTh: 'แท่งเทียนอินไซด์บาร์',
    termEn: 'Inside Bar (IB)',
    category: 'PriceAction',
    shortDef: 'แท่งเทียนที่ทั้งจุด High และ Low อยู่ภายในกรอบ High-Low ของแท่งก่อนหน้า (Mother Bar)',
    fullExplanation: 'Inside Bar แสดงถึงการบีบอัดของราคา (Volatility Contraction) เหมือนสปริงที่กำลังถูกกด เมื่อราคาเบรกออกจากกรอบ Mother Bar จะเกิดการเคลื่อนที่รุนแรง',
    example: 'วาง Buy Stop เหนือ Mother Bar และ Sell Stop ใต้ Mother Bar เพื่อดักจับ Breakout',
    practicalTip: 'Inside Bar ในเทรนด์ขาขึ้นแรงๆ มักเป็นสัญญาณการไปต่อ (Continuation Pattern)',
    tags: ['Inside Bar', 'IB', 'Mother Bar']
  },
  {
    id: 'g-45',
    termTh: 'แท่งเทียนเอาท์ไซด์บาร์',
    termEn: 'Outside Bar / Engulfing Bar',
    category: 'PriceAction',
    shortDef: 'แท่งเทียนที่ทำทั้ง High สูงกว่า และ Low ต่ำกว่าแท่งก่อนหน้า คลุมทั้งแท่งอย่างสมบูรณ์',
    fullExplanation: 'สะท้อนความผันผวนที่ระเบิดออก (Volatility Expansion) และการแย่งชิงการคุมตลาด ทิศทางราคาปิดของ Outside Bar จะบอกว่าฝั่งใดชนะในที่สุด',
    example: 'Outside Bar ปิดเป็นแท่งเขียวเต็มแท่ง บ่งบอกว่าฝั่งซื้อคว้าชัยชนะ',
    practicalTip: 'เทรดตามทิศทางราคาปิดของ Outside Bar ด้วยความระมัดระวังเนื่องจากระยะ Stop Loss จะกว้าง',
    tags: ['Outside Bar', 'Volatility', 'Engulfing']
  },
  {
    id: 'g-46',
    termTh: 'แหนบก้นคู่ (ทวีซเซอร์บ็อททอม)',
    termEn: 'Tweezer Bottom',
    category: 'PriceAction',
    shortDef: 'แท่งเทียน 2 แท่งติดกันที่มีจุดต่ำสุด (Low) หรือไส้ล่างเท่ากันเป๊ะที่แนวรับ',
    fullExplanation: 'แสดงว่าราคาพยายามลงไปทดสอบระดับราคาเดิมซ้ำสองครั้งในเวลาติดๆ กัน แต่ไม่สามารถผ่านลงไปได้ เกิดเป็นแนวรับย่อยที่แข็งแรงมาก',
    example: 'Tweezer Bottom ไส้คู่แตะเส้น Fibonacci 78.6%',
    practicalTip: 'จุดเข้า Buy ที่ดีคือตอนแท่งที่สองปิดแท่ง โดยตั้ง SL ใต้จุด Low คู่เพียงเล็กน้อย',
    tags: ['Tweezer', 'ทวีซเซอร์', 'Double Bottom']
  },
  {
    id: 'g-47',
    termTh: 'แหนบยอดคู่ (ทวีซเซอร์ท็อป)',
    termEn: 'Tweezer Top',
    category: 'PriceAction',
    shortDef: 'แท่งเทียน 2 แท่งติดกันที่มีจุดสูงสุด (High) หรือไส้บนเท่ากันเป๊ะที่แนวต้าน',
    fullExplanation: 'ฝั่งซื้อพยายามดันราคาขึ้นไปสองครั้งซ้อนแต่ชนเพดานเดียวกันแล้วร่วงลง สะท้อนแรงต้านที่หนาแน่นมาก',
    example: 'Tweezer Top เกิดขึ้นที่ขอบบนของแนวต้าน Day',
    practicalTip: 'วาง Stop Loss ไว้เหนือจุด High คู่เพียงไม่กี่จุด ได้ Risk Reward สูงมาก',
    tags: ['Tweezer Top', 'Double Top', 'Resistance']
  },
  {
    id: 'g-48',
    termTh: 'แท่งแทงทะลุ (เพียร์ซิ่งไลน์)',
    termEn: 'Piercing Line',
    category: 'PriceAction',
    shortDef: 'แท่งแรกเป็นแท่งแดงใหญ่ แท่งที่สองเปิดกระโดดต่ำลงไปแต่ดีดกลับขึ้นมาปิดเกิน 50% ของเนื้อแท่งแรก',
    fullExplanation: 'รูปแบบกลับตัวขาขึ้นที่แสดงว่าแม้ตลาดจะเปิดลงด้วยความกลัว แต่มีแรงซื้อฉกฉวยของถูกและดันราคากลับขึ้นมาอย่างหนักแน่น',
    example: 'Piercing Line เกิดขึ้นช่วงเปิดตลาดลอนดอน',
    practicalTip: 'ต้องปิดทะลุเกิน 50% ของแท่งแดงแรกเท่านั้น หากปิดไม่ถึงจะนับเป็นสัญญาณอ่อน',
    tags: ['Piercing Line', 'แทงทะลุ', 'Bullish']
  },
  {
    id: 'g-49',
    termTh: 'เมฆดำปกคลุม (ดาร์กคลาวด์คัฟเวอร์)',
    termEn: 'Dark Cloud Cover',
    category: 'PriceAction',
    shortDef: 'แท่งแรกเป็นแท่งเขียวใหญ่ แท่งที่สองเปิดกระโดดสูงแต่เทขายลงมาปิดต่ำกว่า 50% ของเนื้อแท่งแรก',
    fullExplanation: 'เปรียบเหมือนเมฆดำที่เข้ามาบดบังแสงอาทิตย์ เป็นสัญญาณเตือนว่าฝั่งขายได้เริ่มครอบงำตลาดแล้ว',
    example: 'Dark Cloud Cover ปรากฏขึ้นที่จุด Overbought ของ Stochastic',
    practicalTip: 'เป็นสัญญาณเตือนการกลับตัวขาลงที่มีประสิทธิภาพสูงบนกราฟ Daily',
    tags: ['Dark Cloud Cover', 'เมฆดำ', 'Bearish']
  },
  {
    id: 'g-50',
    termTh: 'แท่งมารุโบซุเปิดปิดกระโดด',
    termEn: 'Belt Hold (Opening Marubozu)',
    category: 'PriceAction',
    shortDef: 'แท่งเทียนที่เปิดปุ๊บก็วิ่งไปทิศทางเดียวทันทีโดยไม่มีไส้เทียนที่ราคาเปิดเลย',
    fullExplanation: 'Bullish Belt Hold เปิดที่จุดต่ำสุดแล้ววิ่งขึ้นอย่างเดียว ส่วน Bearish Belt Hold เปิดที่จุดสูงสุดแล้วร่วงลงอย่างเดียว แสดงความมั่นใจสูงสุดของผู้เล่นในตลาด',
    example: 'Belt Hold ขาขึ้นเกิดขึ้นตอนข่าว NFP ออกมาดีกว่าคาดมาก',
    practicalTip: 'ใช้จุดเปิดของแท่ง Belt Hold เป็นแนวรับ/แนวต้านที่เหนียวแน่นในการเทรดครั้งต่อไป',
    tags: ['Belt Hold', 'Marubozu', 'Momentum']
  },

  // 51-70: SMC / ICT / สภาพคล่อง (Smart Money Concepts)
  {
    id: 'g-51',
    termTh: 'การทำลายโครงสร้างเดิม (บอส)',
    termEn: 'BOS (Break of Structure)',
    category: 'SMC_ICT',
    shortDef: 'การที่ราคาปิดแท่งทะลุ Swing High ล่าสุด (ในขาขึ้น) หรือ Swing Low ล่าสุด (ในขาลง) เพื่อยืนยันเทรนด์เดิม',
    fullExplanation: 'BOS คือสัญญาณยืนยันว่าแนวโน้มเดิมยังคงแข็งแกร่งและดำเนินต่อไป โดยในขาขึ้น ราคาต้องทำ New Higher High ได้สำเร็จ',
    example: 'ราคาทำ BOS ขาขึ้นบน TF 15m ส่งสัญญาณให้หาจังหวะย่อ Buy ต่อเนื่อง',
    practicalTip: 'BOS ที่สมบูรณ์ต้องมี "เนื้อเทียนปิดทะลุ" (Candle Body Close) ไม่ใช่แค่ไส้แตะ',
    tags: ['BOS', 'SMC', 'Structure']
  },
  {
    id: 'g-52',
    termTh: 'การเปลี่ยนพฤติกรรมโครงสร้าง (ชอค)',
    termEn: 'CHoCH (Change of Character)',
    category: 'SMC_ICT',
    shortDef: 'การที่ราคาหลุด Swing Low ล่าสุดในขาขึ้น หรือทะลุ Swing High ล่าสุดในขาลง เป็นสัญญาณแรกของการกลับทิศทาง',
    fullExplanation: 'CHoCH คือจุดเริ่มต้นของการเปลี่ยนแนวโน้มจากขาขึ้นเป็นขาลง หรือขาลงเป็นขาขึ้น เกิดขึ้นก่อนที่จะฟอร์มเป็นเทรนด์ใหม่',
    example: 'ราคาทำ Higher High ต่อเนื่อง แล้วจู่ๆ แท่งเทียนทิ้งตัวลงมาปิดต่ำกว่าจุด Higher Low ล่าสุด เกิดเป็น CHoCH ขาลง',
    practicalTip: 'เมื่อเกิด CHoCH ให้หยุดเทรดตามเทรนด์เดิม แล้วรอราคาย่อกลับไปหา Order Block เพื่อเข้าสวนเทรนด์เดิม',
    tags: ['CHoCH', 'SMC', 'Trend Reversal']
  },
  {
    id: 'g-53',
    termTh: 'ออเดอร์บล็อก (โอเนอร์บล็อก)',
    termEn: 'OB (Order Block)',
    category: 'SMC_ICT',
    shortDef: 'แท่งเทียนสุดท้ายก่อนที่จะเกิดการเคลื่อนที่รุนแรงและทำลายโครงสร้าง (จุดที่สถาบันวางคำสั่งซื้อขายก้อนโต)',
    fullExplanation: 'Bullish Order Block คือแท่งแดงสุดท้ายก่อนราคาจะพุ่งทำลายโครงสร้าง BOS ส่วน Bearish Order Block คือแท่งเขียวสุดท้ายก่อนราคาร่วงหนัก สถาบันจะกลับมารับของที่โซนนี้เสมอ',
    example: 'รอราคาย่อกลับมาสัมผัส Bullish OB แล้วเกิดแท่งเทียนยืนยันจึงกด Buy',
    practicalTip: 'Order Block ที่มี Fair Value Gap (FVG) อยู่ติดกัน จะเป็นโซนที่มีคุณภาพสูงที่สุด (High Probability OB)',
    tags: ['Order Block', 'OB', 'SMC']
  },
  {
    id: 'g-54',
    termTh: 'ช่องว่างมูลค่ายุติธรรม (เอฟวีจี)',
    termEn: 'FVG (Fair Value Gap / Imbalance)',
    category: 'SMC_ICT',
    shortDef: 'ช่องว่างระหว่างไส้ของแท่งที่ 1 กับไส้ของแท่งที่ 3 ที่แท่งที่ 2 เคลื่อนที่เร็วเกินไปจนไม่มีการจับคู่ราคาอย่างสมดุล',
    fullExplanation: 'FVG เกิดขึ้นเมื่อมีคำสั่งซื้อหรือขายด้านเดียวทะลักเข้ามาอย่างรวดเร็ว ตลาดเปรียบเสมือนสุญญากาศ และมักจะต้องดึงราคากลับมา "เติมเต็ม" (Mitigate) ช่องว่างนี้ในอนาคต',
    example: 'ราคาวิ่งลงมาเติมเต็ม FVG ครบ 50% (Consequent Encroachment) แล้วดีดตัวกลับขึ้นไปตามทิศทางหลัก',
    practicalTip: 'ใช้ขอบของ FVG หรือกึ่งกลาง 50% ของ FVG เป็นจุดเข้าออเดอร์ที่มีความแม่นยำสูง',
    tags: ['FVG', 'Imbalance', 'ICT']
  },
  {
    id: 'g-55',
    termTh: 'การเติมเต็มช่องว่างราคา',
    termEn: 'Mitigation',
    category: 'SMC_ICT',
    shortDef: 'กระบวนการที่ราคาย้อนกลับมายัง Order Block หรือ FVG เพื่อปิดคำสั่งที่ค้างอยู่หรือปรับสมดุลคำสั่งซื้อขาย',
    fullExplanation: 'เมื่อรายใหญ่เปิดออเดอร์ทุบราคา พวกเขาจะติดดอยออเดอร์ Buy เล็กๆ อยู่ พวกเขาจึงลากราคากลับมาที่จุดเดิมเพื่อปิดออเดอร์ที่ขาดทุนให้เสมอตัว (Mitigate) ก่อนจะทุบจริง',
    example: 'หลังจากเกิด Mitigation ที่ Order Block ราคาจะวิ่งออกจากโซนอย่างรวดเร็ว',
    practicalTip: 'Order Block ที่ผ่านการ Mitigate ไปแล้วจะมีความสำคัญลดลง ไม่ควรใช้ซ้ำบ่อยๆ',
    tags: ['Mitigation', 'Order Block', 'SMC']
  },
  {
    id: 'g-56',
    termTh: 'สภาพคล่อง (ลิควิดิตี้)',
    termEn: 'Liquidity (BSL / SSL)',
    category: 'SMC_ICT',
    shortDef: 'จุดที่มีคำสั่ง Stop Loss และ Pending Orders ของเทรดเดอร์รายย่อยกองอยู่เป็นจำนวนมาก ซึ่งรายใหญ่ใช้เป็นเชื้อเพลิงในการดันราคา',
    fullExplanation: 'Buy Side Liquidity (BSL) อยู่เหนือยอด Highs คู่ และ Sell Side Liquidity (SSL) อยู่ใต้จุด Lows คู่ รายใหญ่ต้องการสภาพคล่องเหล่านี้เพื่อเติมเต็มออเดอร์ขนาดพันล้านของตนเอง',
    example: 'ราคาพุ่งไปกวาด BSL เหนือแนวต้าน แล้วร่วงทันที (Liquidity Grab)',
    practicalTip: 'ให้มองหาว่า "Stop Loss ของคนส่วนใหญ่อยู่ตรงไหน" เพราะนั่นคือเป้าหมายที่ราคาจะวิ่งไปหา',
    tags: ['Liquidity', 'BSL', 'SSL', 'ICT']
  },
  {
    id: 'g-57',
    termTh: 'ยอดบนเท่ากัน (อีคิวเอช)',
    termEn: 'EQH (Equal Highs)',
    category: 'SMC_ICT',
    shortDef: 'ยอด High สองยอดหรือมากกว่าที่มีระดับราคาเท่ากันเป๊ะ เปรียบเสมือนแม่เหล็กดึงดูดสภาพคล่อง',
    fullExplanation: 'รายย่อยมักมอง Equal Highs เป็นแนวต้านที่แข็งแกร่งและตั้ง Stop Loss ไว้เหนือยอดนั้น ทำให้กลายเป็นเป้าหมายชั้นดีของรายใหญ่ที่จะลากไส้ขึ้นไปกวาดกิน Stop Loss',
    example: 'มี EQH เกิดขึ้นที่ 1.1000 ราคาจึงวิ่งขึ้นไปทะลุก่อนจะปรับตัวลง',
    practicalTip: 'อย่าตั้ง Stop Loss ใกล้ EQH มากเกินไป ให้ระวังการเกิด Sweep เหนือ EQH',
    tags: ['EQH', 'Equal Highs', 'Liquidity']
  },
  {
    id: 'g-58',
    termTh: 'ยอดล่างเท่ากัน (อีคิวแอล)',
    termEn: 'EQL (Equal Lows)',
    category: 'SMC_ICT',
    shortDef: 'จุด Low สองจุดที่มีราคาเท่ากัน เปรียบเสมือนบ่อสภาพคล่องฝั่ง Sell (Sell Side Liquidity)',
    fullExplanation: 'พื้นที่ใต้ Equal Lows เต็มไปด้วย Sell Stop และ Stop Loss ของคนเปิด Buy รายใหญ่มักทุบราคาลงมากวาดสภาพคล่องจุดนี้ก่อนจะดันขึ้นจริง',
    example: 'กวาด EQL แล้วเกิดแท่งเทียน Bullish Pinbar ปิดแท่ง เป็นสัญญาณเข้า Buy ที่ทรงพลัง',
    practicalTip: 'รอให้เกิดการกวาด EQL ให้เสร็จสิ้นก่อน แล้วจึงมองหาสัญญาณ CHoCH เพื่อเข้าเทรด',
    tags: ['EQL', 'Equal Lows', 'Liquidity Pool']
  },
  {
    id: 'g-59',
    termTh: 'จุดกึ่งกลางดุลยภาพ',
    termEn: 'Equilibrium (50% Range)',
    category: 'SMC_ICT',
    shortDef: 'ระดับราคา 50% ของกรอบสวิงราคาล่าสุด แบ่งโซนระหว่างของแพงกับของถูก',
    fullExplanation: 'ราคาที่อยู่เหนือ 50% เรียกว่าโซน Premium (ของแพง เหมาะกับการ Sell) และราคาที่อยู่ใต้ 50% เรียกว่าโซน Discount (ของถูก เหมาะกับการ Buy)',
    example: 'วัด Fibonacci จาก Swing Low ไป Swing High แล้วรอให้ราคาย่อลงมาในโซน Discount ต่ำกว่า 50% ก่อนหาจังหวะ Buy',
    practicalTip: 'ห้ามเปิด Buy ในโซน Premium และห้ามเปิด Sell ในโซน Discount',
    tags: ['Equilibrium', 'Premium', 'Discount', 'ICT']
  },
  {
    id: 'g-60',
    termTh: 'โซนส่วนลด (ของถูก)',
    termEn: 'Discount Zone',
    category: 'SMC_ICT',
    shortDef: 'โซนราคาที่ต่ำกว่า 50% ของช่วงการแกว่งตัว เป็นพื้นที่ที่สถาบันเริ่มสะสมของเพื่อเปิด Buy',
    fullExplanation: 'การซื้อใน Discount Zone ช่วยให้ได้ต้นทุนที่ได้เปรียบตลาด และลดโอกาสในการติดดอย',
    example: 'รอราคาย่อเข้าสู่ OTE (Optimal Trade Entry 61.8% - 78.6%) ซึ่งอยู่ใน Discount Zone',
    practicalTip: 'มองหา Bullish Order Block หรือ Demand Zone ที่ซ่อนอยู่ใน Discount Zone',
    tags: ['Discount Zone', 'ของถูก', 'SMC']
  },
  {
    id: 'g-61',
    termTh: 'โซนพรีเมียม (ของแพง)',
    termEn: 'Premium Zone',
    category: 'SMC_ICT',
    shortDef: 'โซนราคาที่สูงกว่า 50% ของช่วงการแกว่งตัว เป็นพื้นที่ที่เหมาะแก่การเปิดออเดอร์ Sell หรือทำกำไร',
    fullExplanation: 'ในโซนนี้ราคามีมูลค่าสูงเกินความต้องการซื้อเฉลี่ย ทำให้มีความเสี่ยงสูงหากจะเข้า Buy ไล่ราคา',
    example: 'เปิด Sell เมื่อราคาวิ่งขึ้นไปทดสอบ Bearish Order Block ใน Premium Zone',
    practicalTip: 'การเปิด Sell ใน Premium Zone จะให้ค่า Risk to Reward ที่คุ้มค่าที่สุด',
    tags: ['Premium Zone', 'ของแพง', 'SMC']
  },
  {
    id: 'g-62',
    termTh: 'จุดเข้าเทรดที่เหมาะสมที่สุด',
    termEn: 'OTE (Optimal Trade Entry)',
    category: 'SMC_ICT',
    shortDef: 'โซนราคา Fibonacci Retracement ระดับ 62%, 70.5% และ 79% ซึ่งเป็นจุดเข้าเทรดสไตล์ ICT',
    fullExplanation: 'OTE คือระดับการย่อตัวที่มีสถิติการดีดกลับสูงที่สุดตามหลักการของ Michael J. Huddleston (ICT) โดยมีระดับ 70.5% เป็นจุดกึ่งกลาง (Sweet Spot)',
    example: 'กาง Fibo จากสวิงโลว์ไปสวิงไฮ แล้วตั้ง Buy Limit ที่ 70.5%',
    practicalTip: 'ตั้ง Stop Loss ใต้จุด 100% (Swing Low เดิม) เพื่อความปลอดภัย',
    tags: ['OTE', 'Fibonacci', 'ICT']
  },
  {
    id: 'g-63',
    termTh: 'แท่งเบรกเกอร์บล็อก',
    termEn: 'Breaker Block',
    category: 'SMC_ICT',
    shortDef: 'Order Block เดิมที่ล้มเหลวและถูกราคาทะลุผ่าน แต่ต่อมากลับมาทำหน้าที่เป็นแนวรับแนวต้านใหม่อย่างรุนแรง',
    fullExplanation: 'Breaker Block เกิดขึ้นหลังจากราคาไปกวาดสภาพคล่อง (Sweep Liquidity) แล้วทิ้งตัวทะลุ Order Block เดิมอย่างรวดเร็ว ทำให้ Order Block นั้นกลายสภาพเป็น Breaker Block',
    example: 'Bullish Breaker Block พยุงราคาไม่ให้ร่วงต่อหลังจบการกวาด Low',
    practicalTip: 'Breaker Block มักให้การเคลื่อนที่ของราคาที่รวดเร็วและเฉียบขาดกว่า Order Block ทั่วไป',
    tags: ['Breaker Block', 'SMC', 'Reversal']
  },
  {
    id: 'g-64',
    termTh: 'การเหนี่ยวนำให้เข้าเทรดผิดทาง (กับดัก)',
    termEn: 'Inducement (IDM)',
    category: 'SMC_ICT',
    shortDef: 'จุดสวิงย่อยหรือแนวรับต้านลวงตาที่สร้างขึ้นมาเพื่อหลอกให้รายย่อยเข้าเทรดก่อนเวลาอันควร',
    fullExplanation: 'Inducement คือกับดักที่ทำให้รายย่อยคิดว่าเป็นจุดกลับตัวจริง จึงรีบเข้าออเดอร์และวาง Stop Loss ไว้ใกล้ๆ จากนั้นราคาจะวิ่งมากวาดกิน Stop Loss ก่อนจะวิ่งไปหา Order Block ตัวจริง',
    example: 'อย่าเข้าเทรดที่ High แรก ให้รอให้ราคากวาด Inducement แล้วแตะ Extreme Order Block เสียก่อน',
    practicalTip: 'หากคุณมองไม่ออกว่าตรงไหนคือสภาพคล่อง ตัวคุณนั่นแหละคือสภาพคล่อง (You are the liquidity)',
    tags: ['Inducement', 'IDM', 'Trap']
  },
  {
    id: 'g-65',
    termTh: 'ช่วงเวลาทองของการเทรด (คิลโซน)',
    termEn: 'Killzones (London & NY Killzone)',
    category: 'SMC_ICT',
    shortDef: 'ช่วงเวลาของวันที่มีสภาพคล่องและ Volume สูงสุดจากตลาดลอนดอนและนิวยอร์กเปิดทำการ',
    fullExplanation: 'London Killzone (ช่วงบ่าย 14:00-17:00 น. ตามเวลาไทย) และ New York Killzone (ช่วงค่ำ 19:00-22:00 น.) เป็นช่วงเวลาที่เกิดการเคลื่อนที่ของราคาแท้จริงประจำวัน',
    example: 'เทรดเดอร์สไตล์ ICT มักจะเข้าเทรดเฉพาะใน Killzones และงดเทรดในช่วงตลาดเอเชีย',
    practicalTip: 'ตลาดเอเชียมักสร้างกรอบไซด์เวย์ (Range) เพื่อให้ตลาดลอนดอนมากวาดสภาพคล่อง (Judas Swing)',
    tags: ['Killzones', 'Trading Sessions', 'ICT']
  },
  {
    id: 'g-66',
    termTh: 'การสะสม การหลอกล่อ และการแจกจ่าย',
    termEn: 'AMD (Accumulation, Manipulation, Distribution)',
    category: 'SMC_ICT',
    shortDef: 'วงจรพฤติกรรมราคา 3 ขั้นตอน: ไซด์เวย์สะสมของ -> ทุบ/ลากหลอกกิน Stop Loss -> วิ่งไปในทิศทางจริง',
    fullExplanation: 'แนวคิด Power of 3 ของ ICT อธิบายว่าแท่งเทียนประจำวันมักเริ่มจากการเปิดและสะสมของ (A) จากนั้นทำไส้หลอกไปทิศทางตรงข้าม (M) แล้วจึงปิดแท่งด้วยการวิ่งยาวไปทิศทางจริง (D)',
    example: 'ตลาดเอเชียสะสม (A) -> ตลาดลอนดอนทำ Judas Swing กวาด Low (M) -> ตลาดนิวยอร์กวิ่งขึ้นระเบิด (D)',
    practicalTip: 'จับจังหวะ Manipulation ให้เจอเพื่อเข้าเทรดร่วมกับ Distribution ของรายใหญ่',
    tags: ['AMD', 'Power of 3', 'ICT']
  },
  {
    id: 'g-67',
    termTh: 'แท่งเทียนส่งกำลัง (อิมพัลส์)',
    termEn: 'Impulse Candle / Displacement',
    category: 'SMC_ICT',
    shortDef: 'แท่งเทียนขนาดใหญ่ที่มีเนื้อยาวและพุ่งทะลุแนวราคาอย่างรวดเร็ว บ่งชี้การลงมือของรายใหญ่',
    fullExplanation: 'Displacement คือหลักฐานของการเข้ามาของเงินทุนสถาบัน โดยจะเกิดแท่งเทียนแท่งใหญ่ที่ทิ้ง Fair Value Gap ไว้เสมอ',
    example: 'มองหา Displacement Candle หลังการกวาดสภาพคล่องเพื่อยืนยันว่าสถาบันกลับตัวจริง',
    practicalTip: 'หากไม่มี Displacement แสดงว่าการเบรกนั้นอาจเป็นแค่สัญญาณหลอกของรายย่อย',
    tags: ['Displacement', 'Impulse', 'Smart Money']
  },
  {
    id: 'g-68',
    termTh: 'การไหลของคำสั่งซื้อขาย',
    termEn: 'Order Flow',
    category: 'SMC_ICT',
    shortDef: 'ทิศทางกระแสเงินทุนหลักที่สะท้อนผ่านการสร้างโครงสร้างราคาอย่างต่อเนื่อง',
    fullExplanation: 'Bullish Order Flow คือการที่ราคาให้ความเคารพ Demand Zone และ Bullish Order Block ในขณะที่ทะลุทำลาย Supply Zone ทิ้งอย่างต่อเนื่อง',
    example: 'เมื่อ Order Flow เป็นขาขึ้น ให้มองหาเฉพาะโอกาสในการ Buy เท่านั้น',
    practicalTip: 'อย่าเทรดสวน Order Flow ของ Higher Timeframe เป็นอันขาด',
    tags: ['Order Flow', 'Trend', 'Institutional']
  },
  {
    id: 'g-69',
    termTh: 'สภาพคล่องภายในและภายนอกกรอบ',
    termEn: 'Internal & External Liquidity',
    category: 'SMC_ICT',
    shortDef: 'การหมุนเวียนของราคาระหว่างสภาพคล่องภายนอกกรอบ (Swing High/Low) กับสภาพคล่องภายในกรอบ (FVG/OB)',
    fullExplanation: 'ราคาในตลาดจะเคลื่อนที่จาก Internal Liquidity (เช่น FVG ในกรอบ) วิ่งไปหา External Liquidity (จุด High/Low ของกรอบ) สลับกันไปมาเสมอ',
    example: 'หลังราคากวาด External High เสร็จ ราคาจะย่อกลับลงมาหา Internal FVG',
    practicalTip: 'ใช้ Internal Liquidity เป็นจุดเข้า และใช้ External Liquidity เป็นเป้าหมาย Take Profit',
    tags: ['Internal Liquidity', 'External Liquidity', 'SMC']
  },
  {
    id: 'g-70',
    termTh: 'ราคาเปิดตลาดนิวยอร์กเที่ยงคืน',
    termEn: 'Midnight Open (NY Midnight)',
    category: 'SMC_ICT',
    shortDef: 'ราคา ณ เวลา 00:00 น. ตามเวลานิวยอร์ก ใช้เป็นเส้นแบ่งระดับราคาของถูก/ของแพงประจำวัน',
    fullExplanation: 'ในวันที่ตลาดเป็นขาขึ้น ราคามักจะย่อลงต่ำกว่าระดับ NY Midnight Open ในช่วงแรก เพื่อสร้างไส้ล่าง ก่อนจะดีดขึ้นทำเนื้อแท่งเขียว',
    example: 'หาจังหวะ Buy เมื่อราคาอยู่ต่ำกว่า NY Midnight Open ในช่วง London หรือ NY Killzone',
    practicalTip: 'เป็นเกณฑ์อ้างอิงชั้นยอดสำหรับ Day Traders ในการประเมินทิศทางแท่งเทียน Daily',
    tags: ['Midnight Open', 'ICT', 'Day Trading']
  },

  // 71-85: การบริหารความเสี่ยง & การส่งคำสั่ง (Risk Management & Orders)
  {
    id: 'g-71',
    termTh: 'จุดตัดขาดทุน (สต็อปลอส)',
    termEn: 'Stop Loss (SL)',
    category: 'RiskManagement',
    shortDef: 'คำสั่งตัดขาดทุนอัตโนมัติเมื่อราคาผิดทาง เพื่อปกป้องเงินทุนไม่ให้พอร์ตแตก',
    fullExplanation: 'Stop Loss คือเข็มขัดนิรภัยของเทรดเดอร์ เป็นสิ่งที่ต้องกำหนดไว้ "ก่อน" เปิดออเดอร์เสมอ โดยคำนวณจากแนวรับแนวต้านในกราฟ ไม่ใช่ตามอารมณ์',
    example: 'ตั้ง Stop Loss ใต้ Low ของแท่ง Bullish Engulfing เผื่อระยะ 5-10 จุด',
    practicalTip: 'ห้ามเลื่อน Stop Loss หนีราคาเด็ดขาด (Never move SL further away)',
    tags: ['Stop Loss', 'SL', 'Risk Management']
  },
  {
    id: 'g-72',
    termTh: 'จุดทำกำไร (เทคโพรฟิต)',
    termEn: 'Take Profit (TP)',
    category: 'RiskManagement',
    shortDef: 'คำสั่งปิดออเดอร์อัตโนมัติเมื่อราคาไปถึงเป้าหมายกำไรที่วางแผนไว้',
    fullExplanation: 'Take Profit ควรกำหนดไว้ที่แนวรับแนวต้านถัดไป หรือจุดที่มี Liquidity รออยู่ ไม่ควรโลภตั้งเป้าไกลเกินความเป็นจริง',
    example: 'ตั้ง TP1 ที่แนวต้านแรก (50% ของพอร์ต) และปล่อย TP2 รันเทรนด์ต่อ',
    practicalTip: 'การแบ่งปิดทำกำไรเป็นขั้นๆ (Partial Close) ช่วยลดความเครียดทางจิตวิทยาได้ดีเยี่ยม',
    tags: ['Take Profit', 'TP', 'Target']
  },
  {
    id: 'g-73',
    termTh: 'อัตราส่วนผลตอบแทนต่อความเสี่ยง',
    termEn: 'Risk to Reward Ratio (R:R / RR)',
    category: 'RiskManagement',
    shortDef: 'สัดส่วนเปรียบเทียบระหว่างจำนวนเงินที่ยอมเสีย (Risk) กับจำนวนเงินที่คาดว่าจะได้ (Reward)',
    fullExplanation: 'หากเทรดด้วย RR 1:2 หมายความว่าถ้ายอมเสี่ยงเสีย 100 ดอลลาร์ ต้องมีเป้าหมายกำไรอย่างน้อย 200 ดอลลาร์ ด้วย RR 1:2 แม้คุณจะทายถูกแค่ 40% พอร์ตก็ยังคงเติบโตได้',
    example: 'Risk 1% เพื่อลุ้น Reward 3% (RR 1:3)',
    practicalTip: 'อย่าเข้าเทรดในแผนที่มีค่า RR ต่ำกว่า 1:1.5 เพราะไม่คุ้มค่าทางคณิตศาสตร์ระยะยาว',
    tags: ['Risk Reward', 'RR', 'Mathematics']
  },
  {
    id: 'g-74',
    termTh: 'การคำนวณขนาดการเปิดออเดอร์',
    termEn: 'Position Sizing / Lot Size Calculation',
    category: 'RiskManagement',
    shortDef: 'การคำนวณจำนวนหุ้นหรือ Lot ที่จะเข้าเทรด เพื่อให้จำนวนเงินที่เสี่ยงต่อการขาดทุนคงที่ตามเปอร์เซ็นต์ที่กำหนด',
    fullExplanation: 'สูตร: Lot Size = (เงินทุน x % ความเสี่ยง) / (ระยะ Stop Loss เป็น Pips x Pip Value) วิธีนี้จะทำให้ไม่ว่าระยะ SL จะกว้างหรือแคบ คุณจะเสียเงินเท่าเดิมเสมอ',
    example: 'พอร์ต 10,000$ เสี่ยง 1% (100$) ถ้าระยะ SL 20 pips ต้องเปิด 0.50 lot',
    practicalTip: 'อย่าเปิด Lot สุ่มสี่สุ่มห้าโดยไม่คำนวณระยะ Stop Loss ก่อนเด็ดขาด',
    tags: ['Position Sizing', 'Lot Size', 'Money Management']
  },
  {
    id: 'g-75',
    termTh: 'กฎความเสี่ยง 1-2%',
    termEn: '1-2% Risk Rule',
    category: 'RiskManagement',
    shortDef: 'หลักการบริหารเงินทุนที่ไม่ยอมให้พอร์ตขาดทุนเกิน 1-2% ต่อการเทรด 1 ออเดอร์',
    fullExplanation: 'หากเสี่ยงไม้ละ 1% คุณต้องเทรดแพ้ติดต่อกันถึง 100 ไม้พอร์ตจึงจะหมด ซึ่งในความเป็นจริงแทบเป็นไปไม่ได้ ช่วยให้รอดพ้นจากช่วง Drawdown',
    example: 'พอร์ต 1,000 ดอลลาร์ กำหนดขาดทุนสูงสุดต่อไม้ไม่เกิน 10-20 ดอลลาร์',
    practicalTip: 'ความอยู่รอดในตลาด (Capital Preservation) สำคัญกว่าการรีบรวย',
    tags: ['1% Rule', 'Capital Preservation', 'Risk']
  },
  {
    id: 'g-76',
    termTh: 'การเลื่อนจุดตัดขาดทุนมากันทุน',
    termEn: 'Breakeven (BE)',
    category: 'RiskManagement',
    shortDef: 'การเลื่อน Stop Loss มาไว้ที่ระดับราคาเปิดออเดอร์หลังจากราคาเริ่มวิ่งไปในแดนบวก เพื่อเปลี่ยนเป็น "การเทรดไร้ความเสี่ยง"',
    fullExplanation: 'เมื่อราคาวิ่งไปถึง 1R หรือผ่านแนวรับต้านย่อยแรก การเลื่อน SL มาที่ทุนจะรับประกันว่าไม้นั้นจะไม่มีทางขาดทุนอย่างแน่นอน',
    example: 'เมื่อราคาบวก 30 pips ให้เลื่อน SL มาไว้ที่ราคา Entry (BE)',
    practicalTip: 'อย่ารีบเลื่อน BE เร็วเกินไปจนตลาดไม่มีพื้นที่หายใจ (Market Noise) อาจทำให้โดนดีดออกก่อนราคาจะวิ่งจริง',
    tags: ['Breakeven', 'BE', 'Risk Free']
  },
  {
    id: 'g-77',
    termTh: 'การเลื่อนสต็อปลอสล็อกกำไรตามเทรนด์',
    termEn: 'Trailing Stop',
    category: 'RiskManagement',
    shortDef: 'การขยับ Stop Loss ตามหลังราคาขึ้นไปเรื่อยๆ ตามโครงสร้างสวิงใหม่เพื่อล็อกกำไรที่เพิ่มขึ้น',
    fullExplanation: 'ในเทรนด์ขาขึ้น เมื่อราคาทำ Higher Low ใหม่ ให้เลื่อน Stop Loss มาไว้ใต้ Higher Low ล่าสุดเรื่อยๆ จนกว่าราคาจะตัดลงมาชน',
    example: 'เลื่อน Trailing Stop ตามเส้น EMA 20 บนกราฟ 1h',
    practicalTip: 'เหมาะสำหรับการรันเทรนด์ยาว (Trend Riding) ในวันที่ตลาดมี Super Trend',
    tags: ['Trailing Stop', 'Lock Profit', 'Trend Following']
  },
  {
    id: 'g-78',
    termTh: 'อัตราการเทรดชนะ',
    termEn: 'Win Rate',
    category: 'RiskManagement',
    shortDef: 'เปอร์เซ็นต์ของจำนวนไม้ที่ได้กำไรเทียบกับจำนวนไม้ที่เทรดทั้งหมด',
    fullExplanation: 'Win Rate ไม่ใช่สิ่งเดียวที่ชี้วัดความสำเร็จของเทรดเดอร์ เทรดเดอร์ที่มี Win Rate 40% แต่มี RR 1:3 สามารถทำกำไรมหาศาลได้มากกว่าคนที่มี Win Rate 80% แต่ RR 1:0.2',
    example: 'เทรด 100 ไม้ ชนะ 50 ไม้ แพ้ 50 ไม้ = Win Rate 50%',
    practicalTip: 'อย่าหมกมุ่นกับการตามหา Holy Grail ที่ Win Rate 90-100% ให้โฟกัสที่ R:R และการควบคุมอารมณ์',
    tags: ['Win Rate', 'สถิติ', 'Performance']
  },
  {
    id: 'g-79',
    termTh: 'การย่อตัวสูงสุดของพอร์ต',
    termEn: 'Drawdown (DD)',
    category: 'RiskManagement',
    shortDef: 'เปอร์เซ็นต์การลดลงของเงินทุนในพอร์ตจากจุดสูงสุด (Peak) ลงมายังจุดต่ำสุด (Trough)',
    fullExplanation: 'Drawdown สะท้อนถึงความเสี่ยงและความผันผวนของกลยุทธ์ หาก Drawdown เกิน 20-30% แสดงว่าการจัดการความเสี่ยงเริ่มมีปัญหา',
    example: 'พอร์ตจาก 10,000$ ลดลงเหลือ 8,500$ = Drawdown 15%',
    practicalTip: 'เมื่อเจอ Drawdown ติดต่อกัน 3 ไม้ ให้หยุดเทรดและทบทวนสภาพจิตใจรวมถึงสภาวะตลาด',
    tags: ['Drawdown', 'DD', 'Risk Assessment']
  },
  {
    id: 'g-80',
    termTh: 'คำสั่งซื้อขายทันที ณ ราคาตลาด',
    termEn: 'Market Order',
    category: 'RiskManagement',
    shortDef: 'การกดส่งคำสั่งซื้อหรือขายทันที ณ ราคาที่ดีที่สุดในขณะนั้น',
    fullExplanation: 'ได้ออเดอร์ทันทีแน่นอน แต่อาจเกิดปัญหา Slippage หรือได้ราคาแย่กว่าที่เห็นบนจอในช่วงที่ตลาดผันผวนแรง',
    example: 'กด Instant Buy เมื่อเห็นแท่ง Hammer ปิดแท่งสมบูรณ์',
    practicalTip: 'หลีกเลี่ยงการใช้ Market Order ในช่วงก่อนและหลังข่าวแรงประกาศ 5 นาที',
    tags: ['Market Order', 'Instant Order', 'Execution']
  },
  {
    id: 'g-81',
    termTh: 'คำสั่งซื้อขายล่วงหน้าแบบจำกัดราคา',
    termEn: 'Limit Order (Buy Limit / Sell Limit)',
    category: 'RiskManagement',
    shortDef: 'การตั้งคำสั่งซื้อในราคาที่ต่ำกว่าปัจจุบัน หรือตั้งคำสั่งขายในราคาที่สูงกว่าปัจจุบัน',
    fullExplanation: 'Buy Limit ตั้งรอช้อนซื้อที่แนวรับด้านล่าง ส่วน Sell Limit ตั้งรอดักขายที่แนวต้านด้านบน การันตีว่าจะได้ราคาที่ระบุหรือดีกว่าเสมอ',
    example: 'ตั้ง Buy Limit รอไว้ที่ Order Block ราคา 1.0850',
    practicalTip: 'ช่วยให้ไม่จำเป็นต้องนั่งเฝ้าหน้าจอตลอด 24 ชั่วโมง และป้องกันการใช้อารมณ์ตัดสินใจ',
    tags: ['Limit Order', 'Buy Limit', 'Sell Limit']
  },
  {
    id: 'g-82',
    termTh: 'คำสั่งซื้อขายล่วงหน้าแบบตามน้ำ',
    termEn: 'Stop Order (Buy Stop / Sell Stop)',
    category: 'RiskManagement',
    shortDef: 'การตั้งคำสั่งซื้อเมื่อราคาวิ่งทะลุสูงขึ้นไป หรือตั้งคำสั่งขายเมื่อราคาวิ่งทะลุต่ำลงไป',
    fullExplanation: 'Buy Stop ตั้งไว้เหนือแนวต้าน (เพื่อดักจับ Breakout ขาขึ้น) ส่วน Sell Stop ตั้งไว้ใต้แนวรับ (เพื่อดักจับ Breakout ขาลง)',
    example: 'ตั้ง Buy Stop เหนือจุด High ของกรอบไซด์เวย์',
    practicalTip: 'ระวังการโดน Fakeout เมื่อใช้ Stop Order ในกรอบราคาที่ไม่ชัดเจน',
    tags: ['Stop Order', 'Buy Stop', 'Sell Stop']
  },
  {
    id: 'g-83',
    termTh: 'การเปิดออเดอร์มากเกินไป / เสี่ยงเกินขนาด',
    termEn: 'Overtrading & Overleveraging',
    category: 'RiskManagement',
    shortDef: 'มหันตภัยร้ายแรงของเทรดเดอร์: การเปิดออเดอร์ถี่เกินความจำเป็น หรือการใช้ Lot ใหญ่เกินขนาดพอร์ต',
    fullExplanation: 'มักเกิดจากความโลภหรือความต้องการเอาคืนตลาดหลังขาดทุน (Revenge Trading) ซึ่งเป็นสาเหตุอันดับ 1 ที่ทำให้เทรดเดอร์พอร์ตแตก',
    example: 'พอร์ต 100 ดอลลาร์ แต่เปิด Lot 1.00 หวังรวยข้ามคืน',
    practicalTip: 'กำหนดเพดานการเทรดสูงสุดไม่เกิน 2-3 ออเดอร์ต่อวัน และหยุดเทรดทันทีเมื่อถึงเป้า',
    tags: ['Overtrade', 'Overleveraging', 'Psychology']
  },
  {
    id: 'g-84',
    termTh: 'สมุดบันทึกการเทรด',
    termEn: 'Trading Journal',
    category: 'RiskManagement',
    shortDef: 'การจดบันทึกรายละเอียด เหตุผล และผลลัพธ์ของทุกออเดอร์ที่เข้าเทรดเพื่อนำมาวิเคราะห์ปรับปรุง',
    fullExplanation: 'เทรดเดอร์ระดับท็อป 1% ทุกคนมี Trading Journal บันทึกภาพชาร์ตก่อน-หลังเข้าเทรด เหตุผลการเข้า อารมณ์ขณะเทรด และข้อผิดพลาด',
    example: 'บันทึกสถิติว่ากลยุทธ์ Bullish Engulfing ทำกำไรได้ดีที่สุดในช่วงตลาดลอนดอน',
    practicalTip: 'ชาร์ตที่ไม่ถูกบันทึก จะไม่สร้างบทเรียน (What gets measured gets improved)',
    tags: ['Journal', 'บันทึกการเทรด', 'Improvement']
  },
  {
    id: 'g-85',
    termTh: 'ความลำเอียงทางความคิดและจิตวิทยา',
    termEn: 'FOMO & Revenge Trading',
    category: 'RiskManagement',
    shortDef: 'FOMO (กลัวตกรถ) และ Revenge Trading (เทรดแก้แค้นเอาคืน) สองอารมณ์ด้านมืดที่ทำลายระบบเทรด',
    fullExplanation: 'FOMO ทำให้เราเข้าซื้อที่ยอดดอยเพราะกลัวไม่ได้กำไร ส่วน Revenge Trading ทำให้เราเบิ้ล Lot หลังแพ้จนพอร์ตพังพินาศ',
    example: 'เห็นกราฟเขียวพุ่งยาวแล้วรีบกระโดดกด Buy ทันทีโดยไม่มีจุด Stop Loss ที่ชัดเจน',
    practicalTip: 'หากตกรถ ให้ปล่อยไป ตลาดเปิดทุกวันและมีโอกาสใหม่ๆ เกิดขึ้นเสมอ',
    tags: ['FOMO', 'Revenge Trading', 'Mindset']
  },

  // 86-100: Volume & อินดิเคเตอร์ (Volume & Technical Indicators)
  {
    id: 'g-86',
    termTh: 'ปริมาณการซื้อขาย (วอลุ่ม)',
    termEn: 'Trading Volume',
    category: 'VolumeIndicators',
    shortDef: 'จำนวนหุ้น สัญญา หรือมูลค่าที่มีการซื้อขายเปลี่ยนมือจริงในช่วงเวลาของแท่งเทียนนั้น',
    fullExplanation: 'Volume คือน้ำมันเชื้อเพลิงของราคา แท่งเทียนที่ Breakout พร้อม Volume มหาศาล จะมีความน่าเชื่อถือสูงมาก ในขณะที่การขึ้นโดยไร้ Volume มักเป็นสัญญาณการหมดแรง',
    example: 'เกิด Bullish Pinbar พร้อม Volume สูงที่สุดในรอบเดือนที่แนวรับ',
    practicalTip: 'ปริมาณ Volume ยืนยันแนวโน้มเสมอ (Volume precedes price)',
    tags: ['Volume', 'สภาพคล่อง', 'Confirmation']
  },
  {
    id: 'g-87',
    termTh: 'สัญญาณขัดแย้งของราคาและอินดิเคเตอร์ (ไดเวอร์เจนท์)',
    termEn: 'Divergence (Regular & Hidden)',
    category: 'VolumeIndicators',
    shortDef: 'ปรากฏการณ์ที่ทิศทางการเคลื่อนที่ของราคาสวนทางกับเครื่องมือวัดโมเมนตัม (เช่น RSI หรือ MACD)',
    fullExplanation: 'Regular Bullish Divergence เกิดขึ้นเมื่อราคาทำ Lower Low แต่ RSI ทำ Higher Low เตือนถึงการกลับตัวขึ้น ส่วน Hidden Divergence บ่งชี้การไปต่อตามเทรนด์เดิม',
    example: 'ราคาทำ New High แต่ยอด RSI ลดต่ำลง เตือนว่าแรงซื้อกำลังจะหมด (Bearish Divergence)',
    practicalTip: 'อย่าเข้าสวนเทรนด์ทันทีที่เห็น Divergence ให้รอแท่งเทียน Price Action กลับตัวยืนยันก่อน',
    tags: ['Divergence', 'RSI', 'MACD', 'Momentum']
  },
  {
    id: 'g-88',
    termTh: 'ดัชนีกำลังสัมพัทธ์ (อาร์เอสไอ)',
    termEn: 'RSI (Relative Strength Index)',
    category: 'VolumeIndicators',
    shortDef: 'อินดิเคเตอร์วัดความเร็วและขนาดของการเปลี่ยนแปลงของราคา มีค่าตั้งแต่ 0 ถึง 100',
    fullExplanation: 'ระดับเหนือ 70 บ่งบอกสภาวะซื้อมากเกินไป (Overbought) และระดับต่ำกว่า 30 บ่งบอกสภาวะขายมากเกินไป (Oversold) โดยระดับ 50 ใช้เป็นเกณฑ์วัดแนวโน้มกระทิง/หมี',
    example: 'ในเทรนด์ขาขึ้นแรงๆ RSI มักจะย่อลงมาแตะแนวรับ 40-50 แล้วดีดต่อ',
    practicalTip: 'ใน Super Trend ขาขึ้น RSI สามารถค้างอยู่ในโซน Overbought ได้เป็นเวลานาน อย่าเพิ่งรีบดัก Sell',
    tags: ['RSI', 'Overbought', 'Oversold']
  },
  {
    id: 'g-89',
    termTh: 'เส้นค่าเฉลี่ยเคลื่อนที่แบบเอ็กซ์โพเนนเชียล (อีเอ็มเอ)',
    termEn: 'EMA (Exponential Moving Average)',
    category: 'VolumeIndicators',
    shortDef: 'เส้นค่าเฉลี่ยราคาที่ให้น้ำหนักกับข้อมูลราคาล่าสุดมากกว่าแบบ Simple Moving Average (SMA)',
    fullExplanation: 'EMA ตอบสนองต่อการเปลี่ยนแปลงของราคาได้รวดเร็ว นิยมใช้ EMA 20, 50, 100, 200 เพื่อดูทิศทางแนวโน้มและหาจุดเข้าเทรดแบบ Dynamic Support/Resistance',
    example: 'เมื่อราคาอยู่เหนือเส้น EMA 200 ถือว่าเป็นตลาดขาขึ้นระยะยาว (Bull Market)',
    practicalTip: 'Golden Cross (EMA 50 ตัดขึ้นเหนือ EMA 200) เป็นสัญญาณกระทิงรอบใหญ่',
    tags: ['EMA', 'Moving Average', 'Trend Indicator']
  },
  {
    id: 'g-90',
    termTh: 'เส้นตัดทองคำและเส้นตัดมรณะ',
    termEn: 'Golden Cross & Death Cross',
    category: 'VolumeIndicators',
    shortDef: 'สัญญาณการตัดกันของเส้นค่าเฉลี่ยระยะสั้น (50) และระยะยาว (200)',
    fullExplanation: 'Golden Cross คือ EMA 50 ตัดขึ้นเหนือ EMA 200 เป็นสัญญาณเริ่มต้นขาขึ้นใหญ่ ส่วน Death Cross คือ EMA 50 ตัดลงใต้ EMA 200 เป็นสัญญาณเข้าสู่ตลาดหมี',
    example: 'เกิด Golden Cross บนกราฟ Daily ของ Bitcoin ดึงดูดเงินทุนสถาบันไหลเข้า',
    practicalTip: 'เป็นสัญญาณที่ Lagging (ตามหลังราคา) เหมาะสำหรับดูภาพใหญ่ มากกว่าใช้เข้าเทรดสั้น',
    tags: ['Golden Cross', 'Death Cross', 'Long Term']
  },
  {
    id: 'g-91',
    termTh: 'อินดิเคเตอร์แมคดี',
    termEn: 'MACD (Moving Average Convergence Divergence)',
    category: 'VolumeIndicators',
    shortDef: 'เครื่องมือวัดโมเมนตัมและทิศทางแนวโน้มผ่านความต่างของเส้นค่าเฉลี่ย 2 เส้นพร้อม Histogram',
    fullExplanation: 'ประกอบด้วยเส้น MACD, Signal Line และ Histogram เมื่อ MACD ตัดเหนือ Signal Line และอยู่เหนือเส้น 0 แสดงว่าแรงซื้อแข็งแกร่งมาก',
    example: 'รอจังหวะ MACD Cross ขาขึ้นในจังหวะที่ราคาย่อแตะแนวรับสำคัญ',
    practicalTip: 'Histogram ที่เริ่มหดสั้นลงเตือนว่าโมเมนตัมปัจจุบันกำลังชะลอตัว',
    tags: ['MACD', 'Momentum', 'Histogram']
  },
  {
    id: 'g-92',
    termTh: 'กรอบโบลลิงเจอร์แบนด์',
    termEn: 'Bollinger Bands (BB)',
    category: 'VolumeIndicators',
    shortDef: 'อินดิเคเตอร์วัดความผันผวนของราคา ประกอบด้วยเส้นกลาง (SMA 20) และแถบเบี่ยงเบนมาตรฐานบน-ล่าง',
    fullExplanation: 'เมื่อแถบ BB บีบแคบเข้าหากัน (Squeeze) แสดงว่าตลาดกำลังสะสมพลัง และเตรียมเกิดการ Breakout รุนแรง',
    example: 'ราคาแตะขอบล่าง Lower Band พร้อมเกิดแท่ง Hammer มักเกิดการดีดกลับเข้าหาเส้นกลาง',
    practicalTip: 'การที่ราคาไถไปตามขอบ Upper Band ต่อเนื่อง (Walking the Bands) แสดงถึง Super Trend ขาขึ้น',
    tags: ['Bollinger Bands', 'BB', 'Volatility']
  },
  {
    id: 'g-93',
    termTh: 'ระยะการแกว่งตัวเฉลี่ยจริง (เอทีอาร์)',
    termEn: 'ATR (Average True Range)',
    category: 'VolumeIndicators',
    shortDef: 'อินดิเคเตอร์วัดความผันผวนของราคาในหน่วยระยะราคาจริง (ไม่ใช่เปอร์เซ็นต์)',
    fullExplanation: 'ATR บอกว่าในแต่ละวันหรือแต่ละแท่ง ราคามีการวิ่งเฉลี่ยกว้างกี่ Pips หรือกี่บาท นิยมใช้ในการตั้งระยะ Stop Loss และ Trailing Stop ที่ยืดหยุ่นตามความผันผวนของตลาด',
    example: 'ตั้ง Stop Loss ห่างจากจุดเข้าเป็นระยะ 1.5 x ATR',
    practicalTip: 'เมื่อ ATR พุ่งสูงขึ้น ให้ลดขนาด Lot Size ลงเพื่อควบคุมความเสี่ยงจากความผันผวน',
    tags: ['ATR', 'Volatility', 'Stop Loss Sizing']
  },
  {
    id: 'g-94',
    termTh: 'การย่อตัวตามสัดส่วนฟีโบนัชชี',
    termEn: 'Fibonacci Retracement',
    category: 'VolumeIndicators',
    shortDef: 'เครื่องมือวัดระดับการพักตัวของราคาตามอัตราส่วนทองคำ (เช่น 38.2%, 50%, 61.8%, 78.6%)',
    fullExplanation: 'ในแนวโน้มขาขึ้น เมื่อราคาทำจุดสูงสุดใหม่และเริ่มย่อตัว ระดับ 61.8% (Golden Ratio) มักทำหน้าที่เป็นแนวรับที่เกิดการกลับตัวบ่อยที่สุด',
    example: 'กาง Fibo จากจุดต่ำสุดไปสูงสุด แล้วรอเปิด Buy ที่โซน 50% - 61.8%',
    practicalTip: 'อย่าใช้ Fibonacci โดดๆ ให้มองหาแท่งเทียน Price Action ยืนยันที่แนว Fibo เสมอ',
    tags: ['Fibonacci', 'Golden Ratio', 'Support']
  },
  {
    id: 'g-95',
    termTh: 'ระดับการขยายตัวเป้าหมายฟีโบนัชชี',
    termEn: 'Fibonacci Extension',
    category: 'VolumeIndicators',
    shortDef: 'เครื่องมือหาเป้าหมายราคาทำกำไรในอนาคต เช่น ระดับ 127.2%, 161.8%, 200%, 261.8%',
    fullExplanation: 'เมื่อราคา Breakout ทะลุ New High ไปในดินแดนที่ไม่มีแนวต้านเดิมในอดีต (Uncharted Territory) ระดับ 161.8% Extension คือเป้าหมาย TP ที่แม่นยำที่สุด',
    example: 'ใช้ Fibo Extension 161.8% เป็นจุด Take Profit ไม้สุดท้าย',
    practicalTip: 'แบ่งปิดกำไรทีละส่วนที่ระดับ 127.2% และ 161.8%',
    tags: ['Fibonacci Extension', 'Take Profit Target', 'Projection']
  },
  {
    id: 'g-96',
    termTh: 'ราคาเฉลี่ยถ่วงน้ำหนักด้วยวอลุ่ม (วีแวป)',
    termEn: 'VWAP (Volume Weighted Average Price)',
    category: 'VolumeIndicators',
    shortDef: 'ราคาเฉลี่ยที่แท้จริงของสินทรัพย์โดยคำนวณถ่วงน้ำหนักด้วยปริมาณการซื้อขายในรอบวัน',
    fullExplanation: 'เป็นเครื่องมือโปรดของเทรดเดอร์สถาบันและ Day Trader หากราคาอยู่เหนือ VWAP ถือว่าฝั่งซื้อคุมตลาด และหากราคาอยู่ใต้ VWAP ถือว่าฝั่งขายคุมตลาด',
    example: 'หาจังหวะ Buy เมื่อราคาย่อลงมาแตะเส้น VWAP แล้วไม่หลุด',
    practicalTip: 'สถาบันมักจะเปิด Buy เมื่อราคาอยู่ต่ำกว่า VWAP (ได้ของถูกกว่าค่าเฉลี่ยวัน) และ Sell เมื่ออยู่เหนือ VWAP',
    tags: ['VWAP', 'Day Trading', 'Institutional Benchmark']
  },
  {
    id: 'g-97',
    termTh: 'โปรไฟล์ปริมาณการซื้อขายตามระดับราคา',
    termEn: 'Volume Profile (POC / VAH / VAL)',
    category: 'VolumeIndicators',
    shortDef: 'การแสดงปริมาณการซื้อขายในแนวนอนตามระดับราคา (ไม่ใช่ตามเวลาด้านล่าง)',
    fullExplanation: 'POC (Point of Control) คือระดับราคาที่มีการซื้อขายเปลี่ยนมือมากที่สุดในประวัติศาสตร์ ทำหน้าที่เป็นแนวรับแนวต้านที่ทรงพลังที่สุด',
    example: 'ราคาหลุดกรอบ Value Area High (VAH) แล้วดิ่งลงมาหา POC ด้านล่าง',
    practicalTip: 'บริเวณที่ Volume Profile แหว่งหรือเบาบาง (Low Volume Node) ราคาจะวิ่งผ่านอย่างรวดเร็ว',
    tags: ['Volume Profile', 'POC', 'Order Flow']
  },
  {
    id: 'g-98',
    termTh: 'การวิเคราะห์สเปรดและวอลุ่มแท่งเทียน',
    termEn: 'VSA (Volume Spread Analysis)',
    category: 'VolumeIndicators',
    shortDef: 'ศาสตร์การวิเคราะห์ความสัมพันธ์ระหว่างขนาดของแท่งเทียน (Spread), ราคาปิด และปริมาณ Volume',
    fullExplanation: 'หากแท่งเทียนมีเนื้อขนาดเล็กมากแต่ Volume มหาศาลผิดปกติ (Stopping Volume) แสดงว่ามีรายใหญ่กำลังแอบรับของอยู่เบื้องหลัง และเตรียมกลับตัว',
    example: 'No Demand Bar (แท่งเขียวเล็กแต่ Volume แห้งสนิท) เตือนว่าขาขึ้นไร้พลังหนุน',
    practicalTip: 'VSA ช่วยให้คุณมองเห็นร่องรอยการกระทำของ Smart Money ที่ซ่อนอยู่หลังแท่งเทียน',
    tags: ['VSA', 'Volume Spread Analysis', 'Wyckoff']
  },
  {
    id: 'g-99',
    termTh: 'ดัชนีวัดกระแสเงินไหลเข้าออก',
    termEn: 'MFI (Money Flow Index)',
    category: 'VolumeIndicators',
    shortDef: 'Volume-weighted RSI อินดิเคเตอร์ที่นำทั้งราคาและปริมาณการซื้อขายมารวมกันเพื่อวัดแรงขับเคลื่อนของเม็ดเงิน',
    fullExplanation: 'MFI ช่วยกรองสัญญาณหลอกของ RSI ธรรมดาได้ดี เพราะคำนวณการไหลเข้าออกของเม็ดเงินจริงในแต่ละแท่งเทียน',
    example: 'เกิด Bullish MFI Divergence ในขณะที่ราคาทำ Double Bottom',
    practicalTip: 'ระดับ MFI ต่ำกว่า 20 ถือเป็นภาวะ Oversold รุนแรงที่มีโอกาสเกิดการเด้งกลับสูง',
    tags: ['MFI', 'Money Flow', 'Volume Indicator']
  },
  {
    id: 'g-100',
    termTh: 'แผนผังตลาดตามทฤษฎีไวกอฟฟ์',
    termEn: 'Wyckoff Schematic (Phase A-E)',
    category: 'VolumeIndicators',
    shortDef: 'วัฏจักรตลาด 4 ช่วงตามหลักการของ Richard Wyckoff: สะสมของ (Accumulation) -> ลากราคา (Markup) -> กระจายของ (Distribution) -> ทุบราคา (Markdown)',
    fullExplanation: 'อธิบายกระบวนการที่เจ้ามือสถาบันกวาดของจากรายย่อยในช่วง Spring (เขย่าครั้งสุดท้ายใต้แนวรับ) ก่อนที่จะจุดพลุราคาขึ้นสู่ระยะ Markup',
    example: 'ระบุจุด Spring ใน Phase C เพื่อเข้าซื้อที่ต้นรอบคลื่นใหญ่ที่สุด',
    practicalTip: 'การเข้าใจ Wyckoff ทำให้เทรดเดอร์มองภาพรวมของแท่งเทียนในกรอบใหญ่ได้อย่างทะลุปรุโปร่ง',
    tags: ['Wyckoff', 'Accumulation', 'Distribution', 'Spring']
  }
];
