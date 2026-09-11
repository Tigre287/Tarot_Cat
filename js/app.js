// เชื่อมทุกอย่างเข้ากับหน้าเว็บ: เลือกหมวด → สับไพ่ → เปิดไพ่ → อ่านคำทำนาย → ไพ่คำแนะนำ → ปรึกษาแม่หมอ

import { FULL_DECK, drawCards, drawOne } from './deck.js';
import { oracle } from './data/oracle.js';
import { catCardSVG, cardBackSVG } from './catArt.js';
import { CATEGORIES, buildReading, CONSULT_POSITIONS } from './reading.js';
import { askFortuneTeller, MAX_QUESTION_LENGTH } from './consult.js';

const $ = (id) => document.getElementById(id);

const el = {
  stepCategory: $('stepCategory'),
  categoryGrid: $('categoryGrid'),
  stepShuffle: $('stepShuffle'),
  shuffleCategoryName: $('shuffleCategoryName'),
  shuffleCategoryHint: $('shuffleCategoryHint'),
  shuffleForm: $('shuffleForm'),
  shuffleCount: $('shuffleCount'),
  shuffleError: $('shuffleError'),
  backToCategory: $('backToCategory'),
  stepShuffling: $('stepShuffling'),
  shuffleStage: $('shuffleStage'),
  shuffleStatus: $('shuffleStatus'),
  stepReading: $('stepReading'),
  readingTitle: $('readingTitle'),
  readingMood: $('readingMood'),
  readingMeta: $('readingMeta'),
  cardRow: $('cardRow'),
  cardDetails: $('cardDetails'),
  readingSummary: $('readingSummary'),
  adviceList: $('adviceList'),
  oracleBtn: $('oracleBtn'),
  oracleResult: $('oracleResult'),
  resetBtn: $('resetBtn'),
  consultForm: $('consultForm'),
  consultInput: $('consultInput'),
  consultCounter: $('consultCounter'),
  consultSubmit: $('consultSubmit'),
  consultError: $('consultError'),
  consultLoading: $('consultLoading'),
  consultResult: $('consultResult')
};

const MOOD_STYLE = {
  good: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  ok: 'border-line bg-gray-50 text-gray-700',
  warn: 'border-amber-200 bg-amber-50 text-amber-700'
};

const CATEGORY_ICON = {
  work: '<path d="M8 18h32v20H8z"/><path d="M19 18v-5h10v5"/><path d="M8 27h32"/>',
  money: '<circle cx="24" cy="24" r="15"/><path d="M24 15v18"/><path d="M29 19.5c0-2.5-2.2-3.5-5-3.5s-5 1.2-5 3.5 2.5 3 5 3.8 5 1.4 5 4-2.2 3.7-5 3.7-5-1.2-5-3.7"/>',
  health: '<path d="M24 39C13 31 8 26 8 19.5A8.5 8.5 0 0 1 24 15a8.5 8.5 0 0 1 16 4.5C40 26 35 31 24 39z"/><path d="M11 24h6l3-5 4 9 3-4h10"/>',
  love: '<path d="M24 40C12 31.5 7 26 7 19.8A9.3 9.3 0 0 1 24 14.5a9.3 9.3 0 0 1 17 5.3C41 26 36 31.5 24 40z"/>'
};

const state = { category: null, draws: null, reading: null, consultBusy: false };

/* ---------- utils ---------- */
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function show(node) { node.classList.remove('hidden'); }
function hide(node) { node.classList.add('hidden'); }

function scrollToNode(node) {
  requestAnimationFrame(() => node.scrollIntoView({ behavior: 'smooth', block: 'start' }));
}

function chips(keywords) {
  return keywords
    .map((k) => `<span class="rounded-full border border-line px-2.5 py-1 text-xs text-gray-600">${escapeHtml(k)}</span>`)
    .join('');
}

function orientationBadge(reversed) {
  return reversed
    ? '<span class="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">ไพ่กลับหัว</span>'
    : '<span class="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">ไพ่ตั้งขึ้น</span>';
}

/** ไพ่หนึ่งใบพร้อมอนิเมชันพลิก */
function cardTile(draw, index, label) {
  return `
    <div class="fade-up" style="animation-delay:${index * 90}ms">
      <div class="card-frame tarot-card" data-flip="${index}">
        <div class="flip-inner">
          <div class="flip-face flip-face--back">${cardBackSVG()}</div>
          <div class="flip-face flip-face--front${draw.reversed ? ' card-reversed' : ''}">${catCardSVG(draw.card)}</div>
        </div>
      </div>
      <p class="mt-2 text-center text-[11px] font-semibold uppercase tracking-wide text-gray-400">${escapeHtml(label)}</p>
      <p class="mt-0.5 text-center text-[13px] font-bold leading-tight">${escapeHtml(draw.card.th)}</p>
      <p class="text-center text-[11px] leading-tight text-gray-400">${escapeHtml(draw.card.en)}</p>
    </div>`;
}

function revealCards(container, delay = 260) {
  const frames = container.querySelectorAll('[data-flip]');
  frames.forEach((frame, i) => {
    setTimeout(() => frame.classList.add('is-flipped'), delay + i * 240);
  });
}

/* ---------- ขั้นที่ 1: หมวด ---------- */
function renderCategories() {
  el.categoryGrid.innerHTML = CATEGORIES.map(
    (c) => `
    <button type="button" data-category="${c.key}"
      class="group rounded-3xl border border-line p-5 text-left transition hover:border-ink hover:shadow-[0_10px_30px_rgba(17,17,17,0.06)] active:scale-[0.99] sm:p-6">
      <span class="block w-9">
        <svg viewBox="0 0 48 48" fill="none" stroke="#111" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          ${CATEGORY_ICON[c.key]}
        </svg>
      </span>
      <span class="mt-4 block text-lg font-bold">${c.th}</span>
      <span class="block text-xs text-gray-400">${c.en}</span>
      <span class="mt-2 block text-[13px] leading-snug text-gray-500">${c.hint}</span>
    </button>`
  ).join('');

  el.categoryGrid.querySelectorAll('[data-category]').forEach((btn) => {
    btn.addEventListener('click', () => selectCategory(btn.dataset.category));
  });
}

function selectCategory(key) {
  state.category = CATEGORIES.find((c) => c.key === key) || null;
  if (!state.category) return;
  el.shuffleCategoryName.textContent = `${state.category.th} (${state.category.en})`;
  el.shuffleCategoryHint.textContent = `ดูแนวโน้มล่วงหน้า 1 เดือน · ${state.category.hint}`;
  hide(el.stepReading);
  hide(el.stepShuffling);
  hide(el.shuffleError);
  show(el.stepShuffle);
  scrollToNode(el.stepShuffle);
  el.shuffleCount.focus({ preventScroll: true });
}

/* ---------- ขั้นที่ 2-3: สับไพ่ ---------- */
function runShuffleAnimation(times) {
  el.shuffleStage.innerHTML = Array.from({ length: 7 })
    .map(() => `<div class="shuffle-card">${cardBackSVG()}</div>`)
    .join('');
  el.shuffleStatus.textContent = `กำลังสับไพ่ ${times} ครั้ง...`;
  hide(el.stepShuffle);
  show(el.stepShuffling);
  scrollToNode(el.stepShuffling);
  const duration = Math.min(3800, 1400 + times * 110);
  return new Promise((resolve) => setTimeout(resolve, duration));
}

async function handleShuffleSubmit(event) {
  event.preventDefault();
  const raw = el.shuffleCount.value.trim();
  const times = Number(raw);
  if (!raw || !Number.isInteger(times) || times < 1 || times > 99) {
    el.shuffleError.textContent = 'ใส่จำนวนครั้งเป็นเลขจำนวนเต็ม 1 ถึง 99 นะจ้า';
    show(el.shuffleError);
    return;
  }
  hide(el.shuffleError);

  await runShuffleAnimation(times);

  state.draws = drawCards(3, times);
  state.reading = buildReading(state.category.key, state.draws);
  renderReading(times);
}

/* ---------- ขั้นที่ 4: คำทำนาย ---------- */
function renderReading(times) {
  const r = state.reading;
  el.readingTitle.textContent = `${r.category.th} · 1 เดือนข้างหน้า`;
  el.readingMood.textContent = r.mood.label;
  el.readingMood.className = `rounded-full border px-4 py-1.5 text-sm font-semibold ${MOOD_STYLE[r.mood.tone]}`;
  el.readingMeta.textContent =
    `สับไพ่ ${times} ครั้ง จากสำรับ ${FULL_DECK.length} ใบ · เปิดได้ไพ่ชุดใหญ่ ${r.majorCount} ใบ · ไพ่กลับหัว ${r.reversedCount} ใบ`;

  el.cardRow.innerHTML = r.cards.map((c, i) => cardTile(c, i, c.position.th)).join('');

  el.cardDetails.innerHTML = r.cards
    .map(
      (c, i) => `
      <article class="fade-up rounded-3xl border border-line p-5 sm:p-6" style="animation-delay:${300 + i * 90}ms">
        <div class="flex flex-wrap items-center gap-2">
          <span class="rounded-full bg-ink px-3 py-1 text-xs font-semibold text-white">${escapeHtml(c.position.th)}</span>
          ${orientationBadge(c.reversed)}
        </div>
        <h3 class="mt-3 text-lg font-bold">${escapeHtml(c.card.th)}
          <span class="text-sm font-medium text-gray-400">${escapeHtml(c.card.en)}</span>
        </h3>
        <p class="text-xs text-gray-400">${escapeHtml(c.position.sub)}</p>
        <div class="mt-3 flex flex-wrap gap-1.5">${chips(c.keywords)}</div>
        <p class="mt-3 text-[15px] leading-relaxed text-gray-700">${escapeHtml(c.text)}</p>
      </article>`
    )
    .join('');

  el.readingSummary.textContent = r.summary;
  el.adviceList.innerHTML = r.advice
    .map(
      (a) => `<li class="flex gap-2"><span class="mt-[3px] text-ink">•</span><span>${escapeHtml(a)}</span></li>`
    )
    .join('');

  hide(el.oracleResult);
  el.oracleResult.innerHTML = '';
  hide(el.stepShuffling);
  show(el.stepReading);
  revealCards(el.cardRow);
  scrollToNode(el.stepReading);
}

/* ---------- ไพ่คำแนะนำ ---------- */
function handleOracle() {
  const card = drawOne(oracle);
  el.oracleResult.innerHTML = `
    <div class="fade-up rounded-3xl border-2 border-dashed border-ink p-6 sm:p-7">
      <div class="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
        <div class="w-32 shrink-0 sm:w-36">
          <div class="card-frame tarot-card" data-flip="0">
            <div class="flip-inner">
              <div class="flip-face flip-face--back">${cardBackSVG()}</div>
              <div class="flip-face flip-face--front">${catCardSVG(card)}</div>
            </div>
          </div>
        </div>
        <div class="text-center sm:text-left">
          <p class="text-xs font-medium uppercase tracking-widest text-gray-400">ไพ่คำแนะนำจากแมวเหมียว</p>
          <h3 class="mt-1 text-xl font-bold">${escapeHtml(card.th)}
            <span class="text-sm font-medium text-gray-400">${escapeHtml(card.en)}</span>
          </h3>
          <p class="mt-3 text-[15px] leading-relaxed text-gray-700">${escapeHtml(card.msg)}</p>
        </div>
      </div>
    </div>`;
  show(el.oracleResult);
  revealCards(el.oracleResult, 180);
  el.oracleBtn.textContent = 'สุ่มไพ่คำแนะนำใบใหม่';
}

/* ---------- ปรึกษาหมอดู ---------- */
function updateCounter() {
  const len = el.consultInput.value.length;
  el.consultCounter.textContent = `${len} / ${MAX_QUESTION_LENGTH}`;
  el.consultCounter.className = len >= MAX_QUESTION_LENGTH ? 'text-rose-500 font-semibold' : '';
}

async function handleConsult(event) {
  event.preventDefault();
  if (state.consultBusy) return;

  const question = el.consultInput.value.trim();
  if (!question) {
    el.consultError.textContent = 'พิมพ์คำถามที่อยากรู้มาก่อนนะจ้า';
    show(el.consultError);
    return;
  }
  if (question.length > MAX_QUESTION_LENGTH) {
    el.consultError.textContent = `คำถามยาวเกิน ${MAX_QUESTION_LENGTH} ตัวอักษรนะ ตัดให้สั้นลงหน่อยจ้า`;
    show(el.consultError);
    return;
  }

  hide(el.consultError);
  hide(el.consultResult);
  state.consultBusy = true;
  el.consultSubmit.disabled = true;
  el.consultSubmit.textContent = 'แม่หมอกำลังอ่านไพ่...';
  show(el.consultLoading);

  const draws = drawCards(3, 3);
  const answer = await askFortuneTeller(question, draws);
  renderConsult(question, draws, answer);

  hide(el.consultLoading);
  el.consultSubmit.disabled = false;
  el.consultSubmit.textContent = 'ส่งคำถามใหม่';
  state.consultBusy = false;
}

function renderConsult(question, draws, answer) {
  const cardsHtml = draws.map((d, i) => cardTile(d, i, CONSULT_POSITIONS[i].th)).join('');

  const bodyHtml =
    answer.source === 'gemini'
      ? answer.paragraphs
          .map((p) => `<p class="text-[15px] leading-relaxed text-gray-700">${escapeHtml(p)}</p>`)
          .join('')
      : `
        <p class="text-[15px] leading-relaxed text-gray-700">${escapeHtml(answer.intro)}</p>
        ${answer.blocks
          .map(
            (b) => `
          <div class="rounded-2xl bg-gray-50 p-4">
            <div class="flex flex-wrap items-center gap-2">
              <span class="rounded-full bg-ink px-3 py-1 text-xs font-semibold text-white">${escapeHtml(b.position.th)}</span>
              ${orientationBadge(b.reversed)}
            </div>
            <p class="mt-2 text-sm font-bold">${escapeHtml(b.card.th)}
              <span class="font-medium text-gray-400">${escapeHtml(b.card.en)}</span>
            </p>
            <p class="mt-1 text-[15px] leading-relaxed text-gray-700">${escapeHtml(b.text)}</p>
          </div>`
          )
          .join('')}
        <p class="text-[15px] font-semibold leading-relaxed">${escapeHtml(answer.verdict)}</p>
        <p class="text-[15px] leading-relaxed text-gray-700">${escapeHtml(answer.closing)}</p>`;

  el.consultResult.innerHTML = `
    <div class="fade-up">
      <div class="rounded-2xl bg-gray-50 p-4">
        <p class="text-xs font-medium uppercase tracking-widest text-gray-400">คำถามของคุณ</p>
        <p class="mt-1 text-[15px] leading-relaxed">${escapeHtml(question)}</p>
      </div>
      <div id="consultCards" class="mt-6 grid grid-cols-3 gap-3 sm:gap-5">${cardsHtml}</div>
      <div class="mt-7 space-y-3">${bodyHtml}</div>
      ${
        answer.notice
          ? `<p class="mt-5 rounded-2xl border border-line px-4 py-3 text-xs leading-relaxed text-gray-400">${escapeHtml(answer.notice)}</p>`
          : `<p class="mt-5 text-xs text-gray-400">อ่านไพ่โดยแม่หมอเหมียว · ผู้ช่วย AI (${escapeHtml(answer.model || 'gemini')})</p>`
      }
    </div>`;

  show(el.consultResult);
  revealCards(el.consultResult, 200);
}

/* ---------- reset ---------- */
function resetAll() {
  state.category = null;
  state.draws = null;
  state.reading = null;
  hide(el.stepReading);
  hide(el.stepShuffling);
  hide(el.stepShuffle);
  el.oracleBtn.textContent = 'คำแนะนำจากไพ่';
  scrollToNode(el.stepCategory);
}

/* ---------- init ---------- */
renderCategories();
updateCounter();
el.shuffleForm.addEventListener('submit', handleShuffleSubmit);
el.backToCategory.addEventListener('click', resetAll);
el.oracleBtn.addEventListener('click', handleOracle);
el.resetBtn.addEventListener('click', resetAll);
el.consultForm.addEventListener('submit', handleConsult);
el.consultInput.addEventListener('input', updateCounter);
