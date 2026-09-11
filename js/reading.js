// เครื่องคำนวณคำทำนาย + น้ำเสียง "แม่หมอแมวอ้วน" ขี้แซวนิด ๆ แต่หวังดี

/** @typedef {'work' | 'money' | 'health' | 'love'} CategoryKey */
/** @typedef {{ recentKeys: string[], recentReadingKeys: string[], maxRecent: number }} PredictionSession */

export const CATEGORIES = [
  { key: 'work', th: 'การงาน', en: 'Work', hint: 'หน้าที่ ตำแหน่ง ทีม โปรเจกต์' },
  { key: 'money', th: 'การเงิน', en: 'Finance', hint: 'รายได้ รายจ่าย เงินเก็บ หนี้' },
  { key: 'health', th: 'สุขภาพ', en: 'Health', hint: 'พลังกาย ความเครียด การพักผ่อน' },
  { key: 'love', th: 'ความรัก', en: 'Love', hint: 'คนคุย คนรัก ความสัมพันธ์' }
];

export const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.key, c]));

/** @returns {PredictionSession} */
export function createPredictionSession(maxRecent = 80) {
  const requestedLimit = Number(maxRecent);
  const finiteLimit = Number.isFinite(requestedLimit) ? Math.floor(requestedLimit) : 80;
  return {
    recentKeys: [],
    recentReadingKeys: [],
    maxRecent: Math.min(500, Math.max(12, finiteLimit))
  };
}

/** @returns {CategoryKey} */
export function assertCategoryKey(categoryKey) {
  if (!Object.hasOwn(CATEGORY_MAP, categoryKey)) {
    throw new TypeError(`Unknown prediction category: ${String(categoryKey)}`);
  }
  return categoryKey;
}

export const POSITIONS = [
  { th: 'ช่วงต้นเดือน', sub: 'จุดตั้งต้น สิ่งที่กำลังเกิดขึ้นตอนนี้' },
  { th: 'ช่วงกลางเดือน', sub: 'บทที่ต้องเจอ อุปสรรคหรือจังหวะเปลี่ยน' },
  { th: 'ช่วงปลายเดือน', sub: 'ผลลัพธ์และทางที่ไพ่ชี้ให้ไป' }
];

const LEAD_UP = [
  'อุ๊ย ใบนี้หงายหน้ามาชัด แม่หมอแมวอ้วนขอเคาะโต๊ะเบา ๆ ว่าอย่ามองข้ามนะ',
  'ไพ่ใบนี้พูดตรงแบบไม่อ้อมค้อม ฟังแม่หมอให้ดีจ้า',
  'พลังใบนี้มาเต็ม แมวอ้วนเห็นแล้วต้องพยักหน้าจนแก้มสั่น',
  'ใบนี้เปิดมาสวย แต่แม่หมอไม่อวยเกินจริงนะ มาดูเนื้อหากัน'
];

const LEAD_REV = [
  'ใบนี้กลับหัวมา แมวอ้วนขอหรี่ตานิดหนึ่ง ไม่ได้น่ากลัวแต่ต้องรู้ทัน',
  'ไพ่กลับหัวแบบนี้ แม่หมอขอกระซิบตรง ๆ ว่าอย่าเพิ่งรีบ',
  'พลังใบนี้ยังติดพุง เอ๊ย ติดขัดอยู่หน่อย ค่อย ๆ แก้จะดีกว่า',
  'ใบนี้คว่ำมาเตือนเบา ๆ ถ้าฝืนต่อมีสิทธิ์เหนื่อยฟรีนะจ๊ะ'
];

const CATEGORY_TAILS = {
  work: [
    'ดูที่ผลงานจริงกับขอบเขตหน้าที่ อย่าเดาใจหัวหน้าจนเหนื่อยเอง',
    'ถ้าต้องคุยกับทีม พูดให้ชัดตั้งแต่ต้น งานจะไม่ย้อนกลับมากองบนโต๊ะเรา',
    'เลือกหนึ่งเรื่องที่ควบคุมได้แล้วจัดการก่อน เรื่องอื่นจะค่อย ๆ คลายตาม',
    'ความขยันดีนะ แต่ขยันผิดจุดก็เสียแรงฟรี แม่หมอขอให้จัดลำดับก่อน'
  ],
  money: [
    'เช็กยอดจริงก่อนตัดสินใจ กระเป๋าเงินไม่ชอบคำว่า “น่าจะพอ” นะจ๊ะ',
    'แยกสิ่งที่จำเป็นออกจากสิ่งที่ใจอยากได้ แล้วตัวเลขจะพูดความจริงเอง',
    'รอบนี้วินัยเล็ก ๆ ทุกวันช่วยได้มากกว่าหวังเงินก้อนแบบลุ้นเอา',
    'อย่าให้ความเกรงใจทำงบพัง เรื่องเงินคุยตรง ๆ แล้วสบายใจกว่าทีหลัง'
  ],
  health: [
    'ร่างกายไม่ใช่เครื่องจักรนะ เหนื่อยก็คือเหนื่อย พักก่อนค่อยไปต่อ',
    'เริ่มจากนอนและกินให้เป็นเวลา เรื่องพื้นฐานนี่แหละตัวจริง ไม่ใช่ตัวประกอบ',
    'สังเกตอาการตามจริง อย่าวินิจฉัยตัวเองจากความกังวล ถ้าไม่ดีขึ้นให้พบแพทย์',
    'ใจที่ตึงทำให้กายล้าตาม หาเวลาว่างแบบไม่ต้องมีผลงานบ้างก็ได้จ้า'
  ],
  love: [
    'ดูการกระทำให้พอ ๆ กับคำพูด คนจริงใจไม่ปล่อยให้เราต้องเดาคนเดียวตลอด',
    'อย่าเอาความเงียบไปแปลเป็นคำตอบ เปิดใจถามตรง ๆ จะได้ไม่แต่งเรื่องเอง',
    'รักที่ดีไม่ต้องลดคุณค่าตัวเองเพื่อให้ใครอยู่ แม่หมอย้ำตรงนี้เลยนะ',
    'ถ้าความต้องการไม่ตรงกัน คุยให้ชัดก่อน ใจเราก็สำคัญพอ ๆ กับใจเขา'
  ]
};

const SUMMARY_OPENERS = {
  smooth: [
    (category) => `โอ๊ย ไพ่หงายครบสามใบ เรื่อง${category.th}รอบนี้ไหลดีจนแม่หมอแมวอ้วนอยากตบพุงฉลอง`,
    (category) => `แม่หมอเปิดแล้วต้องยิ้ม เรื่อง${category.th}มีทางไปต่อชัดกว่าที่คิด แต่ยังต้องลงมือเองนะ`,
    (category) => `สามใบนี้จับมือกันมาดี เรื่อง${category.th}มีลมส่งหลังให้ เดินต่อได้แบบไม่ต้องฝืนมาก`,
    (category) => `ภาพรวม${category.th}ดูโล่ง ไพ่ไม่ได้บอกให้นอนรอโชค แต่บอกว่าขยับตอนนี้มีแรงหนุนจ้า`
  ],
  reset: [
    (category) => `ไพ่กลับหัวครบสามใบ ใจเย็นก่อน เรื่อง${category.th}ไม่ได้พัง แค่ถึงเวลาหยุดวิ่งวนแบบเดิม`,
    (category) => `แมวอ้วนขอวางขนมก่อนพูดจริงจัง เรื่อง${category.th}ต้องรีเซ็ตวิธีคิด ไม่ใช่ฝืนให้หนักกว่าเดิม`,
    (category) => `ชุดนี้มาเตือนพร้อมกันสามใบ เรื่อง${category.th}ควรชะลอ ตั้งหลัก แล้วค่อยเลือกทางใหม่`,
    (category) => `ภาพรวม${category.th}ยังติดขัด แต่ไพ่กำลังชี้จุดให้แก้ ไม่ได้มาขู่ให้กลัวนะ`
  ],
  mixed: [
    (category) => `เรื่อง${category.th}รอบนี้มีทั้งไฟเขียวกับไฟกะพริบ แม่หมอแมวอ้วนจะชี้ให้ว่าตรงไหนควรไป ตรงไหนควรพัก`,
    (category) => `ไพ่สามใบคุยกันเสียงดังเชียว เรื่อง${category.th}มีจังหวะดี แต่มีรายละเอียดที่ห้ามทำเป็นไม่เห็น`,
    (category) => `ภาพรวม${category.th}ไม่ได้แย่ แค่ต้องฉลาดเลือก แรงมีเท่าไรก็ใช้ให้ถูกจุดนะจ๊ะ`,
    (category) => `แม่หมอเห็นทางไปต่อของเรื่อง${category.th}แล้ว แต่ขอเตือนไว้ก่อนว่าใจร้อนเมื่อไร งานเข้าเมื่อนั้น`
  ]
};

const SUMMARY_ENDINGS = {
  light: [
    'สรุปสั้น ๆ คือจังหวะมาแล้ว อย่ามัวแต่เล็งจนโอกาสเดินผ่านหน้าบ้าน',
    'ปลายเดือนมีสิทธิ์ยิ้มแก้มปริ ถ้าทำสิ่งสำคัญให้ต่อเนื่องและไม่วอกแวก',
    'ไพ่ให้ผ่าน แต่แม่หมอขอหักคะแนนคนผัดวันประกันพรุ่ง ลงมือก่อนแล้วค่อยกังวล',
    'ทางเปิดอยู่จ้า เดินแบบมีสติแล้วผลลัพธ์จะค่อย ๆ เข้าที่เอง'
  ],
  careful: [
    'สรุปคือช้าได้ แต่อย่าหลอกตัวเอง แก้ทีละจุดแล้วปลายเดือนจะเบากว่าเดิม',
    'รอบนี้ความสม่ำเสมอชนะความรีบ แมวอ้วนรับรองว่าฝืนเร็วไปมีแต่เหนื่อย',
    'ยังไม่ต้องตัดสินทุกอย่างวันนี้ ตั้งหลักให้แน่นแล้วคำตอบจะชัดขึ้นเอง',
    'ไพ่ไม่ได้ปิดทาง แค่ให้เก็บรายละเอียดก่อนก้าวต่อ จะได้ไม่ต้องย้อนกลับมาแก้'
  ]
};

const CONSULT_INTROS = [
  (lensName) => `แม่หมอแมวอ้วนอ่านคำถามแล้ว${lensName ? ` กลิ่นเรื่อง${lensName}ชัดมาก` : ''} เลยสับไพ่ให้สามใบแบบตั้งใจสุด ๆ`,
  (lensName) => `คำถามนี้มีอะไรให้ขบคิดนะ${lensName ? ` เป็นประเด็น${lensName}ตรง ๆ` : ''} แมวอ้วนเปิดไพ่ไว้ให้แล้ว มาค่อย ๆ อ่านกัน`,
  (lensName) => `โอเค แม่หมอรับเรื่องแล้ว${lensName ? ` โฟกัสที่${lensName}ให้แบบไม่วอกแวก` : ''} ไพ่สามใบกำลังเล่าเป็นเรื่องเดียวกันจ้า`,
  (lensName) => `มานี่ เดี๋ยวแมวอ้วนดูให้${lensName ? ` เรื่อง${lensName}นี้ต้องฟังทั้งเหตุและผล` : ''} เปิดไพ่มาสามใบครบแล้วนะ`
];

const VERDICT_POOLS = {
  yes: [
    'ไพ่เอนไปทาง “ใช่” ค่อนข้างชัด มีโอกาสไปต่อได้ดีถ้าลงมือจริง ไม่ใช่แค่คิดวนก่อนนอน',
    'คำตอบออกทางบวกจ้า ทางเปิดอยู่ แต่ต้องพกความตั้งใจไปด้วย โชคอย่างเดียวแบกไม่ไหว',
    'แมวอ้วนให้ไฟเขียวแบบมีเงื่อนไข ทำให้ชัดและสม่ำเสมอ แล้วผลจะเข้าข้างเรา',
    'แนวโน้มคือไปต่อได้ ไพ่หนุนพอสมควร แต่อย่าปล่อยรายละเอียดเล็ก ๆ ให้มาสะดุดตอนท้าย'
  ],
  no: [
    'ตอนนี้ไพ่ยังบอกว่า “ช้าก่อน” ไม่ใช่หมดหวัง แค่มีเงื่อนไขที่ต้องแก้ก่อนจะเดินต่อ',
    'แมวอ้วนยังไม่ให้รีบพุ่งนะ จังหวะนี้ตั้งหลักและเก็บข้อมูลเพิ่มจะคุ้มกว่า',
    'คำตอบยังไม่ใช่ตอนนี้ ฝืนไปมีสิทธิ์เหนื่อยฟรี แก้ต้นเหตุแล้วค่อยลองใหม่',
    'ไพ่ขอให้พักเกมรุกไว้ก่อน มีบางอย่างยังไม่พร้อม และเราควรรู้ให้ชัดว่าคืออะไร'
  ],
  maybe: [
    'คำตอบยังก้ำกึ่ง เพราะผลขึ้นอยู่กับการตัดสินใจของเรามากกว่าดวงล้วน ๆ เลือกให้ชัดแล้วทางจะชัดตาม',
    'ไพ่ยังไม่ฟันธงจ้า ตอนนี้การกระทำหนึ่งอย่างของเราสามารถเปลี่ยนปลายทางได้เลย',
    'แมวอ้วนเห็นสองทางพอ ๆ กัน อย่ารอให้จักรวาลเลือกแทน คุยข้อมูลให้ครบแล้วตัดสินใจเอง',
    'สถานการณ์ยังพลิกได้ จุดสำคัญไม่ใช่เดาว่าจะเกิดอะไร แต่คือเราจะวางตัวอย่างไรต่อจากนี้'
  ]
};

const CONSULT_CLOSINGS = [
  'ไพ่มีไว้ส่องไฟ ไม่ได้มาจับพวงมาลัยแทนเรา เลือกทางที่เคารพตัวเอง แล้วเดินให้เต็มฝีเท้านะ',
  'แม่หมอแมวอ้วนขอฝากไว้ว่า คำตอบที่ดีต้องทำให้ใจเบาและชีวิตเดินต่อได้ ไม่ใช่ยิ่งคิดยิ่งติดหล่ม',
  'ฟังไพ่แล้วกลับมาฟังตัวเองด้วยนะ อะไรควรคุยก็คุย อะไรควรวางก็วาง แมวอ้วนเอาใจช่วย',
  'ไม่ต้องเก่งทุกอย่างในวันเดียว แค่ทำก้าวถัดไปให้ซื่อตรงกับใจตัวเองก็พอจ้า'
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
    'ถ้าคิดจะย้ายงาน อัปเดตเรซูเม่ไว้ก่อนแต่ยังไม่ต้องรีบยื่น',
    'นัดคุยเรื่องที่ค้างกับคนเกี่ยวข้องให้จบ อย่าปล่อยงานแขวนจนแมวหลับไปสามตื่น',
    'กันเวลาหนึ่งชั่วโมงไว้ทำงานยากก่อนเปิดแชต งานจะเดินเร็วกว่าคอยตอบทุกคน',
    'เลือกสกิลหนึ่งอย่างที่ช่วยงานตอนนี้แล้วฝึกให้เห็นผลจริง ไม่ต้องเรียนสิบอย่างพร้อมกัน'
  ],
  money: [
    'แยกบัญชีเงินเก็บกับบัญชีใช้จ่ายให้ขาดกัน แล้วโอนเก็บทันทีที่เงินเข้า',
    'ลิสต์รายจ่ายรายเดือนออกมาดู แล้วตัดตัวที่จ่ายเพราะความเคยชินออกหนึ่งตัว',
    'ก่อนซื้อของเกินหลักพันให้พักไว้สองวันก่อน ถ้ายังอยากได้ค่อยซื้อ',
    'เช็กยอดหนี้และดอกเบี้ยให้เห็นตัวเลขจริง อย่าเดาแล้วปล่อยผ่าน',
    'ตั้งเป้าเงินสำรองฉุกเฉินเป็นตัวเลขที่ชัดเจน แล้วเดินไปทีละก้าว',
    'ตั้งงบกินเล่นรายสัปดาห์ไว้เลย แมวอ้วนเข้าใจเรื่องของอร่อย แต่กระเป๋าต้องรอดด้วย',
    'คุยเงื่อนไขเรื่องเงินให้ครบก่อนตกลงงาน อย่ารอให้ทำเสร็จแล้วค่อยถาม',
    'เลือกวันเช็กบัญชีประจำสัปดาห์ แค่สิบนาทีก็ช่วยไม่ให้ปลายเดือนตกใจ'
  ],
  health: [
    'ตั้งเวลานอนให้เป็นเวลาเดิมทุกวัน เริ่มจากปิดจอก่อนนอนหนึ่งชั่วโมง',
    'ดื่มน้ำให้พอและกินให้ตรงมื้อ อย่าอดแล้วไปหนักมื้อเดียว',
    'ขยับร่างกายวันละยี่สิบนาที เดินเร็วก็นับ ไม่ต้องรอเข้าฟิตเนส',
    'ถ้ามีอาการที่ค้างคาใจมานาน ให้ไปตรวจให้สบายใจ อย่าปล่อยไว้กังวลเปล่า ๆ',
    'หาเวลาว่างที่ไม่ทำอะไรเลยสัปดาห์ละหนึ่งช่วง ให้ระบบประสาทได้พัก',
    'เช็กว่าช่วงไหนของวันหมดแรงที่สุด แล้วปรับมื้ออาหารหรือเวลาพักตรงนั้นก่อน',
    'ยืดตัวและพักสายตาระหว่างงานทุกชั่วโมง ร่างกายไม่ควรถูกพับไว้หน้าโต๊ะทั้งวัน',
    'เลือกกิจกรรมที่ทำแล้วใจนิ่งสักอย่าง แล้วใส่ไว้ในตารางเหมือนนัดสำคัญ'
  ],
  love: [
    'สื่อสารความต้องการตรง ๆ ด้วยน้ำเสียงดี ๆ อย่าใช้การงอนเป็นภาษา',
    'ถามอีกฝ่ายว่าช่วงนี้เขาต้องการอะไรจากเรา แล้วฟังให้จบก่อนตอบ',
    'ให้เวลาคุณภาพแบบไม่มีมือถือกันสักหนึ่งชั่วโมงในสัปดาห์นี้',
    'อย่าเอาเรื่องเก่ามาขึ้นศาลใหม่ทุกครั้งที่ทะเลาะ คุยทีละเรื่อง',
    'ถ้ายังโสด เปิดพื้นที่ให้ตัวเองได้เจอคนใหม่ อย่านั่งรอคนเดิมกลับมา',
    'ดูว่าอีกฝ่ายทำสม่ำเสมอไหม อย่าให้ข้อความหวานหนึ่งคืนลบความเงียบทั้งเดือนได้',
    'ตั้งขอบเขตหนึ่งข้อที่ช่วยให้ใจปลอดภัย แล้วพูดให้ชัดโดยไม่ประชด',
    'ถ้าคิดถึงใคร ลองถามตัวเองว่าคิดถึงเขาหรือคิดถึงความรู้สึกตอนมีเขา'
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

function rememberKey(session, key) {
  if (!session) return;
  session.recentKeys.push(key);
  if (session.recentKeys.length > session.maxRecent) {
    session.recentKeys.splice(0, session.recentKeys.length - session.maxRecent);
  }
}

function drawSignature(draws) {
  return draws.map((d) => `${d.card.id}:${d.reversed ? 'r' : 'u'}`).join('|');
}

function beginReading(session, readingKey) {
  if (!session) return 0;
  const repeatCount = session.recentReadingKeys.filter((key) => key === readingKey).length;
  session.recentReadingKeys.push(readingKey);
  if (session.recentReadingKeys.length > session.maxRecent) {
    session.recentReadingKeys.splice(0, session.recentReadingKeys.length - session.maxRecent);
  }
  return repeatCount;
}

function pickFresh(list, seed, scope, session) {
  if (!session) return pickBy(list, seed);
  const prefix = `${scope}:`;
  const recent = new Set(session.recentKeys);
  let index = seed % list.length;

  for (let offset = 0; offset < list.length; offset++) {
    const candidateIndex = (index + offset) % list.length;
    if (!recent.has(`${prefix}${candidateIndex}`)) {
      index = candidateIndex;
      rememberKey(session, `${prefix}${index}`);
      return list[index];
    }
  }

  const previous = session.recentKeys.at(-1);
  session.recentKeys = session.recentKeys.filter((key) => !key.startsWith(prefix));
  if (list.length > 1 && `${prefix}${index}` === previous) index = (index + 1) % list.length;
  rememberKey(session, `${prefix}${index}`);
  return list[index];
}

/** คำอธิบายไพ่หนึ่งใบตามหมวดที่เลือก */
export function cardInterpretation(card, reversed, categoryKey, session) {
  const category = assertCategoryKey(categoryKey);
  const lens = card.cat?.[categoryKey];
  const body = reversed ? lens?.rev : lens?.up;
  const orientation = reversed ? 'rev' : 'up';
  const seed = seedFrom(card.id + category + orientation);
  const lead = pickFresh(
    reversed ? LEAD_REV : LEAD_UP,
    seed,
    `card-lead:${orientation}`,
    session
  );
  const tail = pickFresh(CATEGORY_TAILS[category], seed + 1, `card-tail:${category}`, session);
  const fallback = (reversed ? card.rev : card.up).join(' · ');
  return `${lead} ${body || fallback} ${tail}`;
}

/** คำอธิบายแบบไม่จำกัดหมวด (ใช้กับการปรึกษาแบบพิมพ์คำถามเอง) */
export function cardKeywordLine(card, reversed) {
  const kw = (reversed ? card.rev : card.up).join(' · ');
  return `${card.th} (${card.en})${reversed ? ' กลับหัว' : ''} — ${kw}`;
}

/** สร้างคำทำนาย 3 ใบสำหรับหมวดที่เลือก (ดวงรายเดือน) */
export function buildReading(categoryKey, draws, session) {
  const key = assertCategoryKey(categoryKey);
  const category = CATEGORY_MAP[key];
  const readingKey = `${key}:${drawSignature(draws)}`;
  const repeatCount = beginReading(session, readingKey);
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
    text: cardInterpretation(d.card, d.reversed, key, session)
  }));

  const summaryTone = reversedCount === 0 ? 'smooth' : reversedCount === 3 ? 'reset' : 'mixed';
  const openerTemplate = pickFresh(
    SUMMARY_OPENERS[summaryTone],
    seedFrom(draws.map((d) => d.card.id).join('-') + key) + repeatCount,
    `summary-opener:${summaryTone}`,
    session
  );
  const opener = openerTemplate(category);

  const bits = [opener];
  if (majorCount >= 2) bits.push(SUIT_TONE.major[key]);
  else if (dominantSuit && SUIT_TONE[dominantSuit]) bits.push(SUIT_TONE[dominantSuit][key]);
  if (reversedCount > 0) bits.push(CAUTION_ADVICE[key]);
  bits.push(
    pickFresh(
      SUMMARY_ENDINGS[reversedCount <= 1 ? 'light' : 'careful'],
      seedFrom(draws.map((d) => `${d.card.id}:${d.reversed}`).join('-')),
      `summary-ending:${reversedCount <= 1 ? 'light' : 'careful'}`,
      session
    )
  );

  const seed = seedFrom(draws.map((d) => d.card.id).join('-') + key);
  const pool = ADVICE_POOL[key];
  const advice = [];
  for (let i = 0; advice.length < 3 && i < pool.length * 2; i++) {
    const item = pickFresh(pool, seed + i * 3, `advice:${key}`, session);
    if (!advice.includes(item)) advice.push(item);
  }

  return {
    key: readingKey,
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

/** ใช้หมวดที่เลือกก่อนเสมอ และเดาจากคำถามเฉพาะเมื่อไม่มีหมวดบังคับ */
export function resolveTopic(question, categoryKey = null) {
  return categoryKey == null ? detectTopic(question) : assertCategoryKey(categoryKey);
}

export const CONSULT_POSITIONS = [
  { th: 'ต้นตอของเรื่อง', sub: 'สิ่งที่พาเรามาถึงจุดนี้' },
  { th: 'สิ่งที่ยังมองไม่เห็น', sub: 'มุมที่ไพ่อยากให้รู้เพิ่ม' },
  { th: 'คำตอบและทางออก', sub: 'ไพ่แนะนำให้เดินทางไหน' }
];

/** คำตอบสำรอง (ใช้เมื่อไม่ได้ต่อ LLM) — สังเคราะห์จากหลักไพ่จริง */
export function buildConsultAnswer(question, draws, categoryKey = null, session) {
  const topic = resolveTopic(question, categoryKey);
  const lensName = topic ? CATEGORY_MAP[topic].th : null;
  const readingKey = `consult:${topic || 'general'}:${drawSignature(draws)}`;
  const repeatCount = beginReading(session, readingKey);
  const seed = seedFrom(`${question}:${drawSignature(draws)}`) + repeatCount;

  let score = 0;
  draws.forEach((d) => {
    const weight = d.card.arcana === 'major' ? 1.5 : 1;
    score += d.reversed ? -weight : weight;
  });

  const verdictTone = score >= 2 ? 'yes' : score <= -2 ? 'no' : 'maybe';
  const verdict = pickFresh(
    VERDICT_POOLS[verdictTone],
    seed,
    `consult-verdict:${verdictTone}`,
    session
  );

  const blocks = draws.map((d, i) => {
    const lens = topic ? d.card.cat?.[topic] : null;
    const body = lens
      ? cardInterpretation(d.card, d.reversed, topic, session)
      : (d.reversed ? d.card.rev : d.card.up).join(' และ ');
    return {
      position: CONSULT_POSITIONS[i],
      card: d.card,
      reversed: d.reversed,
      keywords: d.reversed ? d.card.rev : d.card.up,
      text: body
    };
  });

  const intro = pickFresh(
    CONSULT_INTROS,
    seed + 1,
    'consult-intro',
    session
  )(lensName);
  const closing = pickFresh(
    CONSULT_CLOSINGS,
    seed + 2,
    'consult-closing',
    session
  );

  return { key: readingKey, intro, blocks, verdict, closing, topic, source: 'local' };
}
