// เครื่องคำนวณคำทำนาย + น้ำเสียง "แม่หมอยิปซีสุดคิ้วท์"

export const CATEGORIES = [
  { key: 'work', th: 'การงาน', en: 'Work', hint: 'หน้าที่ ตำแหน่ง ทีม โปรเจกต์' },
  { key: 'money', th: 'การเงิน', en: 'Finance', hint: 'รายได้ รายจ่าย เงินเก็บ หนี้' },
  { key: 'health', th: 'สุขภาพ', en: 'Health', hint: 'พลังกาย ความเครียด การพักผ่อน' },
  { key: 'love', th: 'ความรัก', en: 'Love', hint: 'คนคุย คนรัก ความสัมพันธ์' }
];

export const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.key, c]));

export const POSITIONS = [
  { th: 'ช่วงต้นเดือน', sub: 'จุดตั้งต้น สิ่งที่กำลังเกิดขึ้นตอนนี้' },
  { th: 'ช่วงกลางเดือน', sub: 'บทที่ต้องเจอ อุปสรรคหรือจังหวะเปลี่ยน' },
  { th: 'ช่วงปลายเดือน', sub: 'ผลลัพธ์และทางที่ไพ่ชี้ให้ไป' }
];

const LEAD_UP = [
  'ไพ่ตั้งขึ้นสวย ๆ แม่หมอเห็นแล้วยิ้มเลย',
  'ใบนี้หน้าตรงมาแบบมั่นใจ',
  'เปิดมาตั้งขึ้น ถือว่าพลังไหลดีนะ',
  'ไพ่ใบนี้ตั้งขึ้น อ่านง่ายเลยจ้า'
];

const LEAD_REV = [
  'ใบนี้กลับหัวมา ไม่ได้แย่นะแต่ต้องรู้ทัน',
  'กลับหัวแบบนี้แม่หมอขอกระซิบเบา ๆ',
  'ไพ่คว่ำหัวลง แปลว่าพลังยังติดขัดอยู่หน่อย',
  'ใบนี้กลับหัว เป็นสัญญาณให้เบรกคิดสักนิด'
];

const MOOD = {
  smooth: { label: 'ไหลลื่นสุด ๆ', tone: 'good' },
  steady: { label: 'ดีแบบต้องประคอง', tone: 'ok' },
  bumpy: { label: 'ท้าทายแต่เอาอยู่', tone: 'warn' },
  reset: { label: 'ช่วงรีเซ็ตตัวเอง', tone: 'warn' }
};

// ธาตุที่ขึ้นเยอะในสำรับ บอกอะไรในแต่ละหมวด
const SUIT_TONE = {
  major: {
    work: 'ไพ่ชุดใหญ่ขึ้นเยอะ แปลว่าเรื่องงานเดือนนี้ไม่ใช่เรื่องจุกจิก แต่เป็นจุดเปลี่ยนทิศทางเลย',
    money: 'ไพ่ชุดใหญ่ขึ้นเยอะ เรื่องเงินเดือนนี้เป็นการวางโครงสร้างระยะยาว ไม่ใช่แค่ยอดในบัญชีวันนี้',
    health: 'ไพ่ชุดใหญ่ขึ้นเยอะ ร่างกายกำลังส่งสัญญาณให้เปลี่ยนวิถีชีวิตแบบจริงจัง ไม่ใช่แค่พักสองวันแล้วหาย',
    love: 'ไพ่ชุดใหญ่ขึ้นเยอะ ความรักเดือนนี้เป็นบทเรียนใหญ่ที่จะเปลี่ยนวิธีรักของเราไปเลย'
  },
  wands: {
    work: 'ธาตุไฟมาเยอะ งานเดือนนี้ต้องใช้ความกล้าและความเร็ว ใครลงมือก่อนได้เปรียบ',
    money: 'ธาตุไฟมาเยอะ เงินเข้าจากการลงมือทำเอง เช่นงานเสริมหรือโปรเจกต์ที่กล้ารับ',
    health: 'ธาตุไฟมาเยอะ พลังเยอะแต่ใจร้อน ระวังหักโหมจนตัวร้อนใจรุ่มร้อน หาที่ระบายพลังให้ถูกทาง',
    love: 'ธาตุไฟมาเยอะ ความสัมพันธ์แรงและร้อน สนุกแต่ต้องคุมอารมณ์ตอนทะเลาะให้ดี'
  },
  cups: {
    work: 'ธาตุน้ำมาเยอะ เรื่องคนและความรู้สึกในที่ทำงานสำคัญกว่าเนื้องานเสียอีก',
    money: 'ธาตุน้ำมาเยอะ ระวังใช้เงินตามอารมณ์ ของที่ซื้อเพราะเหงามักไม่ได้ใช้',
    health: 'ธาตุน้ำมาเยอะ สุขภาพใจกับสุขภาพกายผูกกันแน่น ดูแลอารมณ์แล้วร่างกายจะดีตาม',
    love: 'ธาตุน้ำมาเยอะ เดือนนี้หัวใจเป็นพระเอก ความรู้สึกจะนำเหตุผลไปทุกก้าว'
  },
  swords: {
    work: 'ธาตุลมมาเยอะ เดือนนี้ชนะด้วยข้อมูลและการสื่อสาร เอกสารกับคำพูดต้องเคลียร์',
    money: 'ธาตุลมมาเยอะ ก่อนเซ็นหรือกดจ่ายอะไรอ่านเงื่อนไขให้ครบทุกบรรทัด',
    health: 'ธาตุลมมาเยอะ ตัวการหลักคือความคิดที่ไม่หยุด ระวังนอนไม่พอและเครียดสะสม',
    love: 'ธาตุลมมาเยอะ ปัญหาส่วนใหญ่มาจากการสื่อสาร ไม่ใช่เพราะไม่รักกัน'
  },
  pentacles: {
    work: 'ธาตุดินมาเยอะ งานเดือนนี้เน้นสะสมฝีมือและความน่าเชื่อถือ ผลจะมาแบบช้าแต่ชัวร์',
    money: 'ธาตุดินมาเยอะ เดือนนี้เหมาะวางระบบเงิน ทำบัญชี ตั้งเป้าเก็บ แล้วจะเห็นผลจริง',
    health: 'ธาตุดินมาเยอะ ร่างกายตอบสนองกับกิจวัตร กินนอนออกกำลังให้เป็นเวลาแล้วดีขึ้นเอง',
    love: 'ธาตุดินมาเยอะ ความรักเดือนนี้วัดกันที่ความสม่ำเสมอและความมั่นคง ไม่ใช่คำหวาน'
  }
};

const ADVICE_POOL = {
  work: [
    'จดงานที่ค้างทั้งหมดออกมาแล้วเลือกทำสามอย่างที่สำคัญที่สุดก่อน',
    'อัปเดตความคืบหน้าให้หัวหน้ารู้ก่อนที่เขาจะต้องมาถาม',
    'อย่ารับงานเพิ่มถ้าของเดิมยังไม่ปิด ฝึกบอกกำหนดเวลาที่ทำได้จริง',
    'เก็บผลงานเด่นของเดือนนี้ไว้เป็นหลักฐานตอนขอขึ้นเงินเดือน',
    'ถ้าคิดจะย้ายงาน อัปเดตเรซูเม่ไว้ก่อนแต่ยังไม่ต้องรีบยื่น'
  ],
  money: [
    'แยกบัญชีเงินเก็บกับบัญชีใช้จ่ายให้ขาดกัน แล้วโอนเก็บทันทีที่เงินเข้า',
    'ลิสต์รายจ่ายรายเดือนออกมาดู แล้วตัดตัวที่จ่ายเพราะความเคยชินออกหนึ่งตัว',
    'ก่อนซื้อของเกินหลักพันให้พักไว้สองวันก่อน ถ้ายังอยากได้ค่อยซื้อ',
    'เช็กยอดหนี้และดอกเบี้ยให้เห็นตัวเลขจริง อย่าเดาแล้วปล่อยผ่าน',
    'ตั้งเป้าเงินสำรองฉุกเฉินเป็นตัวเลขที่ชัดเจน แล้วเดินไปทีละก้าว'
  ],
  health: [
    'ตั้งเวลานอนให้เป็นเวลาเดิมทุกวัน เริ่มจากปิดจอก่อนนอนหนึ่งชั่วโมง',
    'ดื่มน้ำให้พอและกินให้ตรงมื้อ อย่าอดแล้วไปหนักมื้อเดียว',
    'ขยับร่างกายวันละยี่สิบนาที เดินเร็วก็นับ ไม่ต้องรอเข้าฟิตเนส',
    'ถ้ามีอาการที่ค้างคาใจมานาน ให้ไปตรวจให้สบายใจ อย่าปล่อยไว้กังวลเปล่า ๆ',
    'หาเวลาว่างที่ไม่ทำอะไรเลยสัปดาห์ละหนึ่งช่วง ให้ระบบประสาทได้พัก'
  ],
  love: [
    'สื่อสารความต้องการตรง ๆ ด้วยน้ำเสียงดี ๆ อย่าใช้การงอนเป็นภาษา',
    'ถามอีกฝ่ายว่าช่วงนี้เขาต้องการอะไรจากเรา แล้วฟังให้จบก่อนตอบ',
    'ให้เวลาคุณภาพแบบไม่มีมือถือกันสักหนึ่งชั่วโมงในสัปดาห์นี้',
    'อย่าเอาเรื่องเก่ามาขึ้นศาลใหม่ทุกครั้งที่ทะเลาะ คุยทีละเรื่อง',
    'ถ้ายังโสด เปิดพื้นที่ให้ตัวเองได้เจอคนใหม่ อย่านั่งรอคนเดิมกลับมา'
  ]
};

const CAUTION_ADVICE = {
  work: 'อาทิตย์ที่ไพ่กลับหัวชี้อยู่ ให้เช็กรายละเอียดงานซ้ำอีกรอบก่อนส่ง',
  money: 'ช่วงที่ไพ่กลับหัว ระวังรายจ่ายก้อนที่โผล่มาแบบไม่ได้ตั้งงบไว้',
  health: 'ช่วงที่ไพ่กลับหัว ร่างกายจะฟ้องก่อนใจ อย่าฝืนต่อเมื่อรู้สึกล้า',
  love: 'ช่วงที่ไพ่กลับหัว เลี่ยงการตัดสินใจเรื่องหัวใจตอนอารมณ์ยังร้อน'
};

function seedFrom(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = (h * 33 + str.charCodeAt(i)) % 2147483647;
  return h;
}

function pickBy(list, seed) {
  return list[seed % list.length];
}

/** คำอธิบายไพ่หนึ่งใบตามหมวดที่เลือก */
export function cardInterpretation(card, reversed, categoryKey) {
  const lens = card.cat?.[categoryKey];
  const body = reversed ? lens?.rev : lens?.up;
  const seed = seedFrom(card.id + categoryKey + (reversed ? 'r' : 'u'));
  const lead = reversed ? pickBy(LEAD_REV, seed) : pickBy(LEAD_UP, seed);
  const fallback = (reversed ? card.rev : card.up).join(' · ');
  return `${lead} ${body || fallback}`;
}

/** คำอธิบายแบบไม่จำกัดหมวด (ใช้กับการปรึกษาแบบพิมพ์คำถามเอง) */
export function cardKeywordLine(card, reversed) {
  const kw = (reversed ? card.rev : card.up).join(' · ');
  return `${card.th} (${card.en})${reversed ? ' กลับหัว' : ''} — ${kw}`;
}

/** สร้างคำทำนาย 3 ใบสำหรับหมวดที่เลือก (ดวงรายเดือน) */
export function buildReading(categoryKey, draws) {
  const category = CATEGORY_MAP[categoryKey];
  const reversedCount = draws.filter((d) => d.reversed).length;
  const majorCount = draws.filter((d) => d.card.arcana === 'major').length;

  const suitCount = {};
  draws.forEach((d) => {
    suitCount[d.card.suit] = (suitCount[d.card.suit] || 0) + 1;
  });
  const dominantSuit = Object.entries(suitCount)
    .filter(([, n]) => n >= 2)
    .sort((a, b) => b[1] - a[1])[0]?.[0];

  let mood = MOOD.steady;
  if (reversedCount === 0) mood = MOOD.smooth;
  else if (reversedCount === 1) mood = MOOD.steady;
  else if (reversedCount === 2) mood = MOOD.bumpy;
  else mood = MOOD.reset;

  const cards = draws.map((d, i) => ({
    position: POSITIONS[i],
    card: d.card,
    reversed: d.reversed,
    keywords: d.reversed ? d.card.rev : d.card.up,
    text: cardInterpretation(d.card, d.reversed, categoryKey)
  }));

  const opener =
    reversedCount === 0
      ? `โอ๊ยยย เปิดมาตั้งขึ้นทั้งสามใบ ดวง${category.th}เดือนนี้ไหลลื่นแบบไม่ต้องออกแรงมากเลยจ้า`
      : reversedCount === 3
        ? `แม่หมอเห็นไพ่กลับหัวทั้งสามใบ ใจเย็นก่อนนะ นี่ไม่ใช่ดวงร้ายแต่คือสัญญาณให้รีเซ็ตวิธีจัดการเรื่อง${category.th}ใหม่`
        : `แม่หมอเปิดไพ่ให้แล้วจ้า เรื่อง${category.th}เดือนนี้มีทั้งจังหวะดีและจุดที่ต้องระวัง อ่านให้ครบนะ`;

  const bits = [opener];
  if (majorCount >= 2) bits.push(SUIT_TONE.major[categoryKey]);
  else if (dominantSuit && SUIT_TONE[dominantSuit]) bits.push(SUIT_TONE[dominantSuit][categoryKey]);
  if (reversedCount > 0) bits.push(CAUTION_ADVICE[categoryKey]);
  bits.push(
    reversedCount <= 1
      ? 'สรุปคือถ้ารักษาจังหวะนี้ไว้ ปลายเดือนจะยิ้มได้แน่นอน'
      : 'สรุปคือเดือนนี้ขอความสม่ำเสมอมากกว่าความเร็ว ค่อย ๆ แก้ทีละจุดแล้วมันดีขึ้นจริง'
  );

  const seed = seedFrom(draws.map((d) => d.card.id).join('-') + categoryKey);
  const pool = ADVICE_POOL[categoryKey];
  const advice = [];
  for (let i = 0; advice.length < 3 && i < pool.length * 2; i++) {
    const item = pool[(seed + i * 3) % pool.length];
    if (!advice.includes(item)) advice.push(item);
  }

  return {
    category,
    mood,
    reversedCount,
    majorCount,
    dominantSuit,
    cards,
    summary: bits.join(' '),
    advice
  };
}

/* ---------- โหมดปรึกษาแม่หมอ (พิมพ์คำถามเอง) ---------- */

const TOPIC_KEYWORDS = {
  work: ['งาน', 'ทำงาน', 'บริษัท', 'หัวหน้า', 'เจ้านาย', 'ลาออก', 'ย้ายงาน', 'สมัคร', 'สัมภาษณ์', 'โปรเจกต์', 'เลื่อนตำแหน่ง', 'เพื่อนร่วมงาน', 'ธุรกิจ', 'ขายของ', 'ร้าน', 'เรียน', 'สอบ'],
  money: ['เงิน', 'รายได้', 'เงินเดือน', 'หนี้', 'ผ่อน', 'กู้', 'ลงทุน', 'หุ้น', 'ออม', 'เก็บเงิน', 'ค่าใช้จ่าย', 'ทุน', 'กำไร', 'ขาดทุน', 'โชคลาภ'],
  health: ['สุขภาพ', 'ป่วย', 'เครียด', 'นอน', 'นอนไม่หลับ', 'เหนื่อย', 'ปวด', 'หมอ', 'โรงพยาบาล', 'ลดน้ำหนัก', 'ออกกำลังกาย', 'พักผ่อน', 'ซึมเศร้า', 'พลังงาน'],
  love: ['รัก', 'แฟน', 'คนคุย', 'จีบ', 'แต่งงาน', 'เลิก', 'นอก', 'กิ๊ก', 'ครัช', 'โสด', 'อดีต', 'แฟนเก่า', 'หึง', 'คบ', 'ง้อ', 'ใจ', 'ความสัมพันธ์']
};

/** เดาหมวดของคำถามจากคำสำคัญ (คืน null ถ้าเดาไม่ได้) */
export function detectTopic(question) {
  const q = String(question || '');
  let best = null;
  let bestScore = 0;
  for (const [key, words] of Object.entries(TOPIC_KEYWORDS)) {
    const score = words.reduce((n, w) => (q.includes(w) ? n + 1 : n), 0);
    if (score > bestScore) {
      bestScore = score;
      best = key;
    }
  }
  return bestScore > 0 ? best : null;
}

export const CONSULT_POSITIONS = [
  { th: 'ต้นตอของเรื่อง', sub: 'สิ่งที่พาเรามาถึงจุดนี้' },
  { th: 'สิ่งที่ยังมองไม่เห็น', sub: 'มุมที่ไพ่อยากให้รู้เพิ่ม' },
  { th: 'คำตอบและทางออก', sub: 'ไพ่แนะนำให้เดินทางไหน' }
];

/** คำตอบสำรอง (ใช้เมื่อไม่ได้ต่อ LLM) — สังเคราะห์จากหลักไพ่จริง */
export function buildConsultAnswer(question, draws) {
  const topic = detectTopic(question);
  const lensName = topic ? CATEGORY_MAP[topic].th : null;

  let score = 0;
  draws.forEach((d) => {
    const weight = d.card.arcana === 'major' ? 1.5 : 1;
    score += d.reversed ? -weight : weight;
  });

  const verdict =
    score >= 2
      ? 'ไพ่โน้มไปทาง "ใช่" ค่อนข้างชัด ถ้าลงมือด้วยความตั้งใจดีโอกาสสำเร็จสูง'
      : score <= -2
        ? 'ไพ่ยังบอกว่า "ยังไม่ใช่จังหวะ" ไม่ได้แปลว่าไม่ได้เลย แต่ต้องแก้เงื่อนไขบางอย่างก่อน'
        : 'ไพ่ตอบว่า "ก้ำกึ่ง" คือมันขึ้นอยู่กับการตัดสินใจของเราจริง ๆ ไม่ใช่ดวงลิขิตมาแล้ว';

  const blocks = draws.map((d, i) => {
    const lens = topic ? d.card.cat?.[topic] : null;
    const body = lens ? (d.reversed ? lens.rev : lens.up) : (d.reversed ? d.card.rev : d.card.up).join(' และ ');
    return {
      position: CONSULT_POSITIONS[i],
      card: d.card,
      reversed: d.reversed,
      keywords: d.reversed ? d.card.rev : d.card.up,
      text: body
    };
  });

  const intro = `แม่หมออ่านคำถามแล้วนะ${lensName ? ` เรื่องนี้เป็นแนว${lensName}เลย` : ''} สับไพ่ให้เรียบร้อยแล้วเปิดออกมาสามใบจ้า`;
  const closing =
    'ไพ่ไม่ได้มาตัดสินชีวิตเรานะ มันมาบอกว่าตอนนี้พลังอยู่ตรงไหน เลือกทางแล้วเดินให้เต็มที่ แม่หมอเชียร์อยู่จ้า';

  return { intro, blocks, verdict, closing, topic, source: 'local' };
}
