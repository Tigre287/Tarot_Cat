// เชื่อมต่อ LLM สำหรับโหมด "ปรึกษาหมอดู" — ถ้าเรียกไม่ได้จะใช้เครื่องสังเคราะห์คำตอบในเครื่องแทน

import { buildConsultAnswer, detectTopic } from './reading.js';

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
 * ถามแม่หมอ
 * @returns {Promise<object>} { source: 'gemini' | 'local', ... }
 */
export async function askFortuneTeller(question, draws) {
  const trimmed = String(question || '').slice(0, MAX_QUESTION_LENGTH).trim();
  const body = {
    question: trimmed,
    topic: detectTopic(trimmed),
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
    const local = buildConsultAnswer(trimmed, draws);
    local.notice = 'ตอนนี้แม่หมออ่านไพ่ด้วยตำราในเครื่อง (ยังไม่ได้ต่อ AI) แต่ความแม่นตามหลักไพ่ยังอยู่ครบนะ';
    local.reason = err?.message || String(err);
    return local;
  }
}
