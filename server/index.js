// เซิร์ฟเวอร์เล็ก ๆ: เสิร์ฟหน้าเว็บ + เป็นตัวกลางเรียก LLM (ไม่ให้ API key หลุดไปฝั่งเบราว์เซอร์)

import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PORT = Number(process.env.PORT) || 4173;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '';
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
const MAX_QUESTION_LENGTH = 500;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.json': 'application/json; charset=utf-8',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.woff2': 'font/woff2'
};

const SYSTEM_PROMPT = `คุณคือ "แม่หมอเหมียว" นักพยากรณ์ไพ่ยิปซี (Tarot) มืออาชีพของเว็บ "ดูดวงไพ่ยิปซีแมวเหมียว"

บุคลิกและน้ำเสียง
- เป็นแม่หมอยิปซีสุดคิ้วท์ วัยรุ่น เม้าท์สนุก เป็นกันเอง อบอุ่น เหมือนเพื่อนสนิทที่ดูไพ่แม่น
- ใช้ภาษาไทยพูดคุยธรรมชาติ ลงท้ายด้วย "นะ" "จ้า" "ค่ะ" ได้ตามจังหวะ เรียกผู้ถามว่า "เธอ" หรือ "คุณ" ก็ได้ แทนตัวเองว่า "แม่หมอ"
- ห้ามใช้อีโมจิ ห้ามใช้สัญลักษณ์ markdown เช่น * # หรือ ** ให้เขียนเป็นย่อหน้าข้อความล้วน
- สนุกได้แต่ต้องแม่นยำตามหลักไพ่ยิปซีจริง ไม่มั่ว

กติกาการตีความ (สำคัญมาก)
- ตีความจากไพ่ 3 ใบที่ระบบเปิดมาให้เท่านั้น ห้ามเปลี่ยน ห้ามเพิ่ม ห้ามลดไพ่ และต้องเคารพว่าใบไหนตั้งขึ้นหรือกลับหัว
- ยึดความหมายมาตรฐานสาย Rider-Waite-Smith ทั้งความหมายของไพ่ ธาตุประจำชุด และความหมายเมื่อกลับหัว
- ผูกความหมายไพ่เข้ากับคำถามของผู้ถามให้ตรงประเด็น ห้ามตอบกว้าง ๆ แบบใช้กับใครก็ได้
- ต้องเอ่ยชื่อไพ่ทั้งสามใบพร้อมตำแหน่งของมัน แล้วอธิบายว่าไพ่ใบนั้นตอบคำถามอย่างไร

รูปแบบคำตอบ (เขียนเป็นย่อหน้า ไม่ต้องใส่หัวข้อกำกับ ความยาวรวม 180-320 คำ)
1. ย่อหน้าเปิด ทักทายสั้น ๆ และสรุปว่าไพ่มองเรื่องนี้เป็นภาพรวมอย่างไร
2. ย่อหน้าอ่านไพ่ อธิบายไพ่ทั้งสามใบเรียงตามตำแหน่ง เชื่อมโยงกันเป็นเรื่องเดียว
3. ย่อหน้าสรุปคำตอบ ตอบให้ชัดว่าแนวโน้มไปทางไหน ถ้าเป็นคำถามใช่/ไม่ใช่ ให้ตอบตรง ๆ ว่าโน้มไปทางไหนและเพราะไพ่ใบใด
4. ย่อหน้าปิด ให้คำแนะนำที่ทำได้จริง 2-3 ข้อ แบบเล่าเป็นประโยคต่อกัน และให้กำลังใจปิดท้าย

ข้อห้ามเด็ดขาด
- ห้ามทำนายเรื่องความเป็นความตาย โรคร้าย หรือวันเวลาที่จะเสียชีวิต ถ้าถามเรื่องสุขภาพให้พูดถึงพลังกาย ความเครียด การพักผ่อน พฤติกรรม และแนะนำให้ไปพบแพทย์เมื่อมีอาการ
- ห้ามให้คำแนะนำการลงทุนแบบเจาะจงหรือรับประกันผลตอบแทน ให้พูดถึงวินัยการเงินและจังหวะแทน
- ห้ามให้คำแนะนำที่ผิดกฎหมายหรือทำร้ายผู้อื่น
- ถ้าคำถามสื่อถึงการทำร้ายตัวเอง ให้ตอบด้วยความอบอุ่น ชวนให้คุยกับคนที่ไว้ใจหรือสายด่วนสุขภาพจิต 1323 และไม่ต้องทำนายเรื่องนั้นต่อ`;

function buildUserPrompt({ question, cards, topic }) {
  const topicLabel = { work: 'การงาน', money: 'การเงิน', health: 'สุขภาพ', love: 'ความรัก' }[topic];
  const cardLines = cards
    .map(
      (c, i) =>
        `ใบที่ ${i + 1} (ตำแหน่ง: ${c.position}) — ${c.nameTh} / ${c.nameEn} | ${c.orientation} | คำสำคัญ: ${
          Array.isArray(c.keywords) ? c.keywords.join(', ') : ''
        }`
    )
    .join('\n');

  return `คำถามของผู้ถาม:
"""
${question}
"""
${topicLabel ? `\nหมวดที่ระบบตรวจจับได้: ${topicLabel}\n` : ''}
ไพ่ที่ระบบสับและเปิดออกมา (ห้ามเปลี่ยน):
${cardLines}

กรุณาอ่านไพ่ให้ผู้ถามตามกติกาและรูปแบบที่กำหนดไว้`;
}

async function callGemini(payload) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    GEMINI_MODEL
  )}:generateContent`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': GEMINI_API_KEY },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{ role: 'user', parts: [{ text: buildUserPrompt(payload) }] }],
      generationConfig: { temperature: 0.9, topP: 0.95, maxOutputTokens: 1200 }
    })
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`Gemini ตอบกลับสถานะ ${res.status}: ${detail.slice(0, 300)}`);
  }

  const data = await res.json();
  const text = (data?.candidates?.[0]?.content?.parts || [])
    .map((p) => p.text || '')
    .join('')
    .trim();
  if (!text) throw new Error('Gemini ไม่ได้ส่งข้อความกลับมา');
  return text;
}

function readBody(req, limit = 64 * 1024) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > limit) {
        reject(new Error('คำขอใหญ่เกินไป'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function sendJson(res, status, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(body);
}

async function handleConsult(req, res) {
  let payload;
  try {
    payload = JSON.parse(await readBody(req));
  } catch {
    return sendJson(res, 400, { error: 'รูปแบบข้อมูลไม่ถูกต้อง' });
  }

  const question = String(payload?.question || '').trim();
  const cards = Array.isArray(payload?.cards) ? payload.cards.slice(0, 3) : [];
  if (!question) return sendJson(res, 400, { error: 'กรุณาพิมพ์คำถามก่อนนะ' });
  if (question.length > MAX_QUESTION_LENGTH) {
    return sendJson(res, 400, { error: `คำถามยาวเกิน ${MAX_QUESTION_LENGTH} ตัวอักษร` });
  }
  if (cards.length !== 3) return sendJson(res, 400, { error: 'ต้องส่งไพ่มา 3 ใบ' });
  if (!GEMINI_API_KEY) {
    return sendJson(res, 503, { error: 'ยังไม่ได้ตั้งค่า GEMINI_API_KEY บนเซิร์ฟเวอร์' });
  }

  try {
    const answer = await callGemini({ question, cards, topic: payload?.topic || null });
    return sendJson(res, 200, { answer, model: GEMINI_MODEL });
  } catch (err) {
    console.error('[consult]', err.message);
    return sendJson(res, 502, { error: 'เรียก AI ไม่สำเร็จ' });
  }
}

async function serveStatic(req, res) {
  const urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  const rel = urlPath === '/' ? 'index.html' : urlPath.replace(/^\/+/, '');
  const filePath = path.join(ROOT, rel);

  // กันการไล่ path ออกนอกโฟลเดอร์โปรเจกต์
  if (!filePath.startsWith(ROOT + path.sep) && filePath !== path.join(ROOT, 'index.html')) {
    res.writeHead(403).end('Forbidden');
    return;
  }

  try {
    const data = await fs.readFile(filePath);
    res.writeHead(200, {
      'Content-Type': MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-cache'
    });
    res.end(data);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('ไม่พบไฟล์ที่ขอ');
  }
}

const server = http.createServer((req, res) => {
  if (req.url.startsWith('/api/consult')) {
    if (req.method !== 'POST') return sendJson(res, 405, { error: 'ใช้ POST เท่านั้น' });
    return handleConsult(req, res);
  }
  if (req.url === '/api/health') {
    return sendJson(res, 200, { ok: true, ai: Boolean(GEMINI_API_KEY), model: GEMINI_MODEL });
  }
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405).end('Method Not Allowed');
    return;
  }
  return serveStatic(req, res);
});

server.listen(PORT, () => {
  console.log(`🐱 ดูดวงไพ่ยิปซีแมวเหมียว: http://localhost:${PORT}`);
  console.log(GEMINI_API_KEY ? `   AI: เปิดใช้งาน (${GEMINI_MODEL})` : '   AI: ปิดอยู่ — ตั้งค่า GEMINI_API_KEY เพื่อเปิดใช้');
});
