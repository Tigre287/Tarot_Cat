// เชื่อมต่อ LLM สำหรับโหมด "ปรึกษาหมอดู" — ถ้าเรียกไม่ได้จะใช้เครื่องสังเคราะห์คำตอบในเครื่องแทน

import { buildConsultAnswer, resolveTopic } from './reading.js';

export const MAX_QUESTION_LENGTH = 500;

/** แปลงไพ่ที่เปิดได้ให้เป็นข้อมูลสั้น ๆ สำหรับส่งให้โมเดล */
export function cardsToPayload(draws) {
  return draws.map((d, i) => ({
    position: ['ต้นตอของเรื่อง', 'สิ่งที่ยังมองไม่เห็น', 'คำตอบและทางออก'][i] || `ใบที่ ${i + 1}`,
    nameTh: d.card.th,
    nameEn: d.card.en,
    arcana: d.card.arcana,
    suit: d.card.suit,
    orientation: d.reversed ? 'กลับหัว (reversed)' : 'ตั้งขึ้น (upright)',
    keywords: d.reversed ? d.card.rev : d.card.up
  }));
}

/**
 * ถามแม่หมอแมวอ้วน
 * @param {string} question
 * @param {{ card: object, reversed: boolean }[]} draws
 * @param {'work' | 'money' | 'health' | 'love' | null} [categoryKey=null]
 * @param {{ recentKeys: string[], recentReadingKeys: string[], maxRecent: number }} [session]
 * @returns {Promise<object>} { source: 'gemini' | 'local', ... }
 */
export async function askFortuneTeller(question, draws, categoryKey = null, session) {
  const trimmed = String(question || '').slice(0, MAX_QUESTION_LENGTH).trim();
  const body = {
    question: trimmed,
    topic: resolveTopic(trimmed, categoryKey),
    cards: cardsToPayload(draws)
  };

  try {
    const res = await fetch('/api/consult', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error(`สถานะ ${res.status}`);
    const data = await res.json();
    if (data?.answer) {
      return {
        source: 'gemini',
        model: data.model || 'gemini',
        paragraphs: String(data.answer)
          .split(/\n{2,}|\n/)
          .map((s) => s.trim())
          .filter(Boolean),
        topic: body.topic
      };
    }
    throw new Error(data?.error || 'คำตอบว่างเปล่า');
  } catch (err) {
    const local = buildConsultAnswer(trimmed, draws, body.topic, session);
    local.notice = 'ตอนนี้แม่หมอแมวอ้วนเปิดตำราอ่านให้จากในเครื่อง ถึงยังไม่ได้ต่อ AI แต่ความหมายไพ่ยังครบ ไม่อ่านมั่วให้เสียชื่อแมวนะ';
    local.reason = err?.message || String(err);
    return local;
  }
}
