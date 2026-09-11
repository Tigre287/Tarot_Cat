import assert from 'node:assert/strict';

import { FULL_DECK } from '../js/deck.js';
import {
  buildConsultAnswer,
  buildReading,
  createPredictionSession,
  resolveTopic
} from '../js/reading.js';

const draws = [FULL_DECK[0], FULL_DECK[22], FULL_DECK[64]].map((card, index) => ({
  card,
  reversed: index === 1
}));

assert.equal(resolveTopic('หัวหน้าจะให้งานใหม่ไหม', 'money'), 'money');
assert.equal(resolveTopic('แฟนเก่าจะกลับมาไหม'), 'love');
assert.throws(() => resolveTopic('คำถามทั่วไป', 'career'), /Unknown prediction category/);

const session = createPredictionSession();
assert.equal(createPredictionSession(Number.POSITIVE_INFINITY).maxRecent, 80);
const workReading = buildReading('work', draws, session);
const moneyReading = buildReading('money', draws, session);

assert.equal(workReading.category.key, 'work');
assert.equal(moneyReading.category.key, 'money');
moneyReading.cards.forEach(({ card, reversed, text }) => {
  const moneyText = reversed ? card.cat.money.rev : card.cat.money.up;
  const workText = reversed ? card.cat.work.rev : card.cat.work.up;
  assert.ok(text.includes(moneyText), `${card.id} must use money context`);
  assert.ok(!text.includes(workText), `${card.id} must not retain work context`);
});

const firstRepeatedReading = buildReading('love', draws, session);
const secondRepeatedReading = buildReading('love', draws, session);
assert.equal(firstRepeatedReading.key, secondRepeatedReading.key);
assert.notEqual(firstRepeatedReading.summary, secondRepeatedReading.summary);
assert.notDeepEqual(
  firstRepeatedReading.cards.map((card) => card.text),
  secondRepeatedReading.cards.map((card) => card.text)
);
assert.ok(session.recentReadingKeys.some((key) => key.startsWith('love:')));

const firstConsult = buildConsultAnswer('งานใหม่จะดีไหม', draws, 'health', session);
const secondConsult = buildConsultAnswer('งานใหม่จะดีไหม', draws, 'health', session);
assert.equal(firstConsult.topic, 'health');
assert.equal(secondConsult.topic, 'health');
assert.notEqual(firstConsult.intro, secondConsult.intro);
assert.notEqual(firstConsult.verdict, secondConsult.verdict);
assert.notEqual(firstConsult.closing, secondConsult.closing);
firstConsult.blocks.forEach(({ card, reversed, text }) => {
  const healthText = reversed ? card.cat.health.rev : card.cat.health.up;
  const workText = reversed ? card.cat.work.rev : card.cat.work.up;
  assert.ok(text.includes(healthText), `${card.id} must use explicit health context`);
  assert.ok(!text.includes(workText), `${card.id} must not infer work over explicit health`);
});

console.log('Verified strict category context and session-level prediction deduplication.');
