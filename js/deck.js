// ประกอบสำรับไพ่ยิปซี 78 ใบ + ระบบสับและเปิดไพ่

import { majors } from './data/majors.js';
import { wands } from './data/wands.js';
import { cups } from './data/cups.js';
import { swords } from './data/swords.js';
import { pentacles } from './data/pentacles.js';

export const SUIT_INFO = {
  major: { th: 'ไพ่ชุดใหญ่', en: 'Major Arcana', element: 'บทเรียนใหญ่ของชีวิต' },
  wands: { th: 'ไม้เท้า', en: 'Wands', element: 'ธาตุไฟ — แรงผลักดันและการลงมือ' },
  cups: { th: 'ถ้วย', en: 'Cups', element: 'ธาตุน้ำ — อารมณ์และความสัมพันธ์' },
  swords: { th: 'ดาบ', en: 'Swords', element: 'ธาตุลม — ความคิดและการสื่อสาร' },
  pentacles: { th: 'เหรียญ', en: 'Pentacles', element: 'ธาตุดิน — เงินทองและความมั่นคง' }
};

export const FULL_DECK = Object.freeze([...majors, ...wands, ...cups, ...swords, ...pentacles]);

if (FULL_DECK.length !== 78) {
  console.error(`สำรับไพ่ไม่ครบ 78 ใบ (ตอนนี้มี ${FULL_DECK.length} ใบ)`);
}

/** สุ่มจำนวนเต็ม 0..max-1 แบบไม่เอนเอียง (ใช้ crypto ถ้ามี) */
function randomInt(max) {
  if (max <= 0) return 0;
  const crypto = globalThis.crypto;
  if (crypto?.getRandomValues) {
    const limit = Math.floor(0xffffffff / max) * max;
    const buf = new Uint32Array(1);
    let v;
    do {
      crypto.getRandomValues(buf);
      v = buf[0];
    } while (v >= limit);
    return v % max;
  }
  return Math.floor(Math.random() * max);
}

/** สับไพ่ตามจำนวนครั้งที่ผู้ใช้ระบุ (Fisher-Yates ซ้ำหลายรอบ + ตัดสำรับ) */
export function shuffleDeck(times = 1, deck = FULL_DECK) {
  const cards = [...deck];
  const rounds = Math.max(1, Math.min(99, Math.floor(times) || 1));
  for (let r = 0; r < rounds; r++) {
    for (let i = cards.length - 1; i > 0; i--) {
      const j = randomInt(i + 1);
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    const cut = randomInt(cards.length);
    cards.push(...cards.splice(0, cut));
  }
  return cards;
}

/**
 * เปิดไพ่ n ใบแบบไม่ซ้ำกัน พร้อมสุ่มหัว/กลับหัว
 * @returns {{card: object, reversed: boolean}[]}
 */
export function drawCards(n = 3, times = 1) {
  const cards = shuffleDeck(times);
  const picked = [];
  const used = new Set();
  while (picked.length < n && used.size < cards.length) {
    const idx = randomInt(cards.length);
    if (used.has(idx)) continue;
    used.add(idx);
    picked.push({ card: cards[idx], reversed: randomInt(100) < 38 });
  }
  return picked;
}

/** สุ่มไพ่คำแนะนำ 1 ใบจากชุดที่ให้มา */
export function drawOne(pool) {
  return pool[randomInt(pool.length)];
}
