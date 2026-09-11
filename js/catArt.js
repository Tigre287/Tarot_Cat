// วาดแมวการ์ตูนลายเส้นหนาแบบสติกเกอร์ — สร้าง SVG จาก id ของไพ่ (ผลลัพธ์เหมือนกันทุกครั้งสำหรับไพ่ใบเดิม)

const INK = '#111111';
const BLUSH = '#FFD3DA';
const SOFT = '#F4F4F4';

// hash แบบง่ายเพื่อให้แมวแต่ละใบหน้าไม่ซ้ำกันแต่คงที่เสมอ
function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function pick(list, seed) {
  return list[seed % list.length];
}

const ROMAN = [
  '0', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X',
  'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX', 'XXI'
];

const RANK_LABEL = { 1: 'A', 11: 'P', 12: 'N', 13: 'Q', 14: 'K' };

function pipLabel(card) {
  if (card.arcana === 'oracle') return '\u2661';
  if (card.arcana === 'major') return ROMAN[card.num] ?? String(card.num);
  return RANK_LABEL[card.num] ?? String(card.num);
}

/* ---------- ตา 8 แบบ (เอาให้ดูเบลอ ๆ งง ๆ น่ารัก) ---------- */
function eyes(variant, lx, rx, y) {
  const line = (d, w = 4) =>
    `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w}" stroke-linecap="round"/>`;
  switch (variant) {
    case 0: // ตาจุดกลม
      return `<circle cx="${lx}" cy="${y}" r="6.5" fill="${INK}"/><circle cx="${rx}" cy="${y}" r="6.5" fill="${INK}"/>`;
    case 1: // ตาโตแวววาว
      return `
        <circle cx="${lx}" cy="${y}" r="10" fill="#fff" stroke="${INK}" stroke-width="3.5"/>
        <circle cx="${rx}" cy="${y}" r="10" fill="#fff" stroke="${INK}" stroke-width="3.5"/>
        <circle cx="${lx + 1}" cy="${y + 1}" r="4.6" fill="${INK}"/>
        <circle cx="${rx + 1}" cy="${y + 1}" r="4.6" fill="${INK}"/>
        <circle cx="${lx - 2.6}" cy="${y - 3}" r="1.9" fill="#fff"/>
        <circle cx="${rx - 2.6}" cy="${y - 3}" r="1.9" fill="#fff"/>`;
    case 2: // ตาเบี้ยว งง ๆ
      return `
        <circle cx="${lx}" cy="${y - 1}" r="9" fill="#fff" stroke="${INK}" stroke-width="3.5"/>
        <circle cx="${lx - 1}" cy="${y + 1}" r="4" fill="${INK}"/>
        <circle cx="${rx}" cy="${y + 2}" r="5" fill="${INK}"/>`;
    case 3: // ตาหยีมีความสุข ^ ^
      return line(`M ${lx - 9} ${y + 4} Q ${lx} ${y - 8} ${lx + 9} ${y + 4}`) +
             line(`M ${rx - 9} ${y + 4} Q ${rx} ${y - 8} ${rx + 9} ${y + 4}`);
    case 4: // ตาปิดยาว (ง่วง)
      return line(`M ${lx - 9} ${y} Q ${lx} ${y + 7} ${lx + 9} ${y}`) +
             line(`M ${rx - 9} ${y} Q ${rx} ${y + 7} ${rx + 9} ${y}`);
    case 5: // ตาครึ่งเปลือก เบื่อโลก
      return `
        <circle cx="${lx}" cy="${y}" r="9" fill="#fff" stroke="${INK}" stroke-width="3.5"/>
        <circle cx="${rx}" cy="${y}" r="9" fill="#fff" stroke="${INK}" stroke-width="3.5"/>
        <circle cx="${lx}" cy="${y + 2}" r="4" fill="${INK}"/>
        <circle cx="${rx}" cy="${y + 2}" r="4" fill="${INK}"/>
        ${line(`M ${lx - 10} ${y - 3} L ${lx + 10} ${y - 3}`, 4.5)}
        ${line(`M ${rx - 10} ${y - 3} L ${rx + 10} ${y - 3}`, 4.5)}`;
    case 6: // ตาก้นหอย มึน
      return `
        ${line(`M ${lx} ${y} m -7 0 a 7 7 0 1 1 7 7 a 4.5 4.5 0 1 1 -4.5 -4.5`, 3.2)}
        ${line(`M ${rx} ${y} m -7 0 a 7 7 0 1 1 7 7 a 4.5 4.5 0 1 1 -4.5 -4.5`, 3.2)}`;
    default: // ชำเลืองมอง
      return `
        <circle cx="${lx}" cy="${y}" r="9.5" fill="#fff" stroke="${INK}" stroke-width="3.5"/>
        <circle cx="${rx}" cy="${y}" r="9.5" fill="#fff" stroke="${INK}" stroke-width="3.5"/>
        <circle cx="${lx + 4}" cy="${y}" r="4.2" fill="${INK}"/>
        <circle cx="${rx + 4}" cy="${y}" r="4.2" fill="${INK}"/>`;
  }
}

/* ---------- ปาก 6 แบบ ---------- */
function mouth(variant, cx, y) {
  const line = (d, w = 3.6) =>
    `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w}" stroke-linecap="round"/>`;
  switch (variant) {
    case 0: // ปาก :3
      return line(`M ${cx - 12} ${y} Q ${cx - 6} ${y + 8} ${cx} ${y + 0.5} Q ${cx + 6} ${y + 8} ${cx + 12} ${y}`);
    case 1: // อ้าปากกลม เหวอ
      return `<ellipse cx="${cx}" cy="${y + 5}" rx="6" ry="7.5" fill="${INK}"/>`;
    case 2: // ปากหยักงอ ๆ
      return line(`M ${cx - 12} ${y + 1} q 6 7 12 0 q 6 -7 12 0`);
    case 3: // ยิ้มกว้าง
      return line(`M ${cx - 14} ${y - 3} Q ${cx} ${y + 14} ${cx + 14} ${y - 3}`);
    case 4: // ปากจิ๋ว
      return line(`M ${cx - 5} ${y + 2} Q ${cx} ${y + 6} ${cx + 5} ${y + 2}`);
    default: // แลบลิ้น
      return line(`M ${cx - 11} ${y} Q ${cx} ${y + 9} ${cx + 11} ${y}`) +
        `<path d="M ${cx - 5} ${y + 5} q 5 12 10 0 z" fill="${BLUSH}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>`;
  }
}

/* ---------- สัญลักษณ์ประจำชุดไพ่ ---------- */
function emblem(suit, x, y, s = 1) {
  const g = (inner) => `<g transform="translate(${x} ${y}) scale(${s})">${inner}</g>`;
  const st = `fill="#fff" stroke="${INK}" stroke-width="3.4" stroke-linejoin="round" stroke-linecap="round"`;
  switch (suit) {
    case 'wands':
      return g(`
        <path d="M -12 16 L 12 -16" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>
        <path d="M 4 -8 q 10 -2 9 -11 q -9 1 -9 11 z" ${st}/>
        <path d="M -4 4 q -10 -2 -11 -10 q 9 0 11 10 z" ${st}/>`);
    case 'cups':
      return g(`
        <path d="M -12 -14 H 12 L 8 2 q -8 6 -16 0 z" ${st}/>
        <path d="M 0 4 V 12" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
        <path d="M -9 16 H 9" fill="none" stroke="${INK}" stroke-width="4.4" stroke-linecap="round"/>`);
    case 'swords':
      return g(`
        <path d="M 0 -18 L 5 -6 V 8 H -5 V -6 z" ${st}/>
        <path d="M -11 9 H 11" fill="none" stroke="${INK}" stroke-width="4.4" stroke-linecap="round"/>
        <path d="M 0 11 V 18" fill="none" stroke="${INK}" stroke-width="4.4" stroke-linecap="round"/>`);
    case 'pentacles':
      return g(`
        <circle cx="0" cy="0" r="15" ${st}/>
        <path d="M 0 -9 L 2.6 -2.8 L 9 -2.8 L 3.8 1.4 L 5.6 8 L 0 4.2 L -5.6 8 L -3.8 1.4 L -9 -2.8 L -2.6 -2.8 z"
          fill="${INK}" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"/>`);
    case 'oracle': // ไพ่คำแนะนำ = หัวใจ
      return g(`
        <path d="M 0 14 C -16 2 -15 -12 -7 -14 Q 0 -15 0 -7 Q 0 -15 7 -14 C 15 -12 16 2 0 14 z" ${st}/>`);
    default: // ไพ่ชุดใหญ่ = ดาวประกาย
      return g(`
        <path d="M 0 -17 Q 3 -4 15 0 Q 3 4 0 17 Q -3 4 -15 0 Q -3 -4 0 -17 z" ${st}/>`);
  }
}

/* ---------- หมวก/มงกุฎของไพ่อัศวิน-ราชา-ราชินี และประกายของไพ่ชุดใหญ่ ---------- */
function headwear(card, seed) {
  const st = `fill="#fff" stroke="${INK}" stroke-width="3.6" stroke-linejoin="round" stroke-linecap="round"`;
  if (card.arcana === 'major') {
    return `
      <path d="M 100 62 Q 102 71 110 74 Q 102 77 100 86 Q 98 77 90 74 Q 98 71 100 62 z" ${st}/>
      <circle cx="${44 + (seed % 7)}" cy="70" r="3.2" fill="${INK}"/>
      <circle cx="${156 - (seed % 5)}" cy="86" r="2.4" fill="${INK}"/>`;
  }
  if (card.num === 11) { // เพจ — หมวกแก๊ป
    return `<path d="M 66 84 q 34 -30 68 -2 q -34 -12 -68 2 z" ${st}/>
            <path d="M 60 84 q 8 -6 14 -3" fill="none" stroke="${INK}" stroke-width="3.6" stroke-linecap="round"/>`;
  }
  if (card.num === 12) { // อัศวิน — ผ้าพันคอปลิว
    return `<path d="M 138 168 q 30 -6 36 12 q -18 -4 -34 4 z" fill="${SOFT}" stroke="${INK}" stroke-width="3.4" stroke-linejoin="round"/>`;
  }
  if (card.num === 13) { // ราชินี — มงกุฎเล็ก
    return `<path d="M 78 80 L 86 66 L 94 78 L 100 62 L 106 78 L 114 66 L 122 80 z" ${st}/>`;
  }
  if (card.num === 14) { // ราชา — มงกุฎใหญ่
    return `<path d="M 72 82 L 78 60 L 90 76 L 100 54 L 110 76 L 122 60 L 128 82 z" ${st}/>
            <path d="M 92 172 q 8 12 16 0" fill="none" stroke="${INK}" stroke-width="3.4" stroke-linecap="round"/>`;
  }
  return '';
}

/**
 * สร้าง SVG แมวประจำไพ่หนึ่งใบ
 * @param {object} card - ไพ่จากสำรับ (ต้องมี id, arcana, suit, num)
 * @param {object} [opts] - { className }
 */
export function catCardSVG(card, opts = {}) {
  const seed = hash(card.id);
  const eyeVariant = seed % 8;
  const mouthVariant = (seed >> 3) % 6;
  const tilt = ((seed >> 6) % 9) - 4;
  const blush = (seed >> 9) % 3 !== 0;
  const stroke = `fill="#fff" stroke="${INK}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"`;
  const label = pipLabel(card);

  return `
<svg viewBox="0 0 200 300" class="${opts.className || ''}" role="img"
     aria-label="ไพ่${card.th} (${card.en})" xmlns="http://www.w3.org/2000/svg">
  <rect x="3" y="3" width="194" height="294" rx="18" fill="#fff" stroke="${INK}" stroke-width="3.5"/>
  <rect x="11" y="11" width="178" height="278" rx="12" fill="none" stroke="${INK}" stroke-width="1.2" opacity="0.35"/>

  <g transform="rotate(${tilt} 100 170)">
    <!-- หาง -->
    <path d="M 137 232 C 174 234 180 194 160 180" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>
    <!-- ลำตัว -->
    <path d="M 63 172 C 52 220 62 258 100 258 C 138 258 148 220 137 172 z" ${stroke}/>
    <ellipse cx="82" cy="252" rx="11" ry="7.5" ${stroke}/>
    <ellipse cx="118" cy="252" rx="11" ry="7.5" ${stroke}/>
    <!-- หู -->
    <path d="M 62 104 L 60 62 L 94 84 z" ${stroke}/>
    <path d="M 138 104 L 140 62 L 106 84 z" ${stroke}/>
    <path d="M 68 96 L 68 74 L 85 85 z" fill="${BLUSH}" stroke="none"/>
    <path d="M 132 96 L 132 74 L 115 85 z" fill="${BLUSH}" stroke="none"/>
    <!-- หัว -->
    <circle cx="100" cy="132" r="50" ${stroke}/>
    ${headwear(card, seed)}
    ${blush ? `<ellipse cx="66" cy="150" rx="9" ry="5.5" fill="${BLUSH}"/><ellipse cx="134" cy="150" rx="9" ry="5.5" fill="${BLUSH}"/>` : ''}
    ${eyes(eyeVariant, 82, 118, 128)}
    <path d="M 96 146 L 104 146 L 100 151 z" fill="${INK}"/>
    ${mouth(mouthVariant, 100, 152)}
    <!-- หนวด -->
    <g stroke="${INK}" stroke-width="2.6" stroke-linecap="round" fill="none">
      <path d="M 54 132 L 30 126"/><path d="M 54 140 L 29 141"/><path d="M 55 148 L 32 156"/>
      <path d="M 146 132 L 170 126"/><path d="M 146 140 L 171 141"/><path d="M 145 148 L 168 156"/>
    </g>
  </g>

  ${emblem(card.suit, 38, 44, 0.92)}
  ${emblem(card.suit, 162, 256, 0.92)}
  <text x="162" y="50" text-anchor="middle" font-family="'Noto Sans Thai',system-ui,sans-serif"
        font-size="19" font-weight="700" fill="${INK}">${label}</text>
  <text x="38" y="262" text-anchor="middle" font-family="'Noto Sans Thai',system-ui,sans-serif"
        font-size="19" font-weight="700" fill="${INK}" transform="rotate(180 38 256)">${label}</text>
</svg>`;
}

/** ไพ่คว่ำ (ใช้ตอนสับไพ่และตอนกางสำรับ) */
export function cardBackSVG(opts = {}) {
  return `
<svg viewBox="0 0 200 300" class="${opts.className || ''}" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
  <rect x="3" y="3" width="194" height="294" rx="18" fill="#fff" stroke="${INK}" stroke-width="3.5"/>
  <rect x="14" y="14" width="172" height="272" rx="12" fill="none" stroke="${INK}" stroke-width="2.4"/>
  <g transform="translate(100 150)">
    <circle cx="0" cy="-6" r="30" fill="#fff" stroke="${INK}" stroke-width="4"/>
    <path d="M -22 -24 L -24 -50 L -2 -36 z" fill="#fff" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M 22 -24 L 24 -50 L 2 -36 z" fill="#fff" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <circle cx="-11" cy="-9" r="4.2" fill="${INK}"/>
    <circle cx="11" cy="-9" r="4.2" fill="${INK}"/>
    <path d="M -8 2 Q -4 8 0 2 Q 4 8 8 2" fill="none" stroke="${INK}" stroke-width="3.2" stroke-linecap="round"/>
    <path d="M 0 34 Q 3 46 14 50 Q 3 54 0 66 Q -3 54 -14 50 Q -3 46 0 34 z"
          fill="#fff" stroke="${INK}" stroke-width="3.4" stroke-linejoin="round"/>
    <path d="M 0 -74 Q 2 -66 10 -63 Q 2 -60 0 -52 Q -2 -60 -10 -63 Q -2 -66 0 -74 z"
          fill="#fff" stroke="${INK}" stroke-width="3.4" stroke-linejoin="round"/>
  </g>
</svg>`;
}
