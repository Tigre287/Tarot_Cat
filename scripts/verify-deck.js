import assert from 'node:assert/strict';

import { FULL_DECK } from '../js/deck.js';
import { CATEGORIES } from '../js/reading.js';

assert.equal(FULL_DECK.length, 78, 'The tarot deck must contain 78 cards');
assert.equal(new Set(FULL_DECK.map((card) => card.id)).size, 78, 'Every card ID must be unique');

const expectedSuitSizes = { major: 22, wands: 14, cups: 14, swords: 14, pentacles: 14 };
for (const [suit, expected] of Object.entries(expectedSuitSizes)) {
  const cards = FULL_DECK.filter((card) => card.suit === suit);
  assert.equal(cards.length, expected, `${suit} must contain ${expected} cards`);
  const firstRank = suit === 'major' ? 0 : 1;
  assert.deepEqual(
    cards.map((card) => card.num).sort((a, b) => a - b),
    Array.from({ length: expected }, (_, index) => firstRank + index),
    `${suit} must contain every expected rank exactly once`
  );
}

for (const card of FULL_DECK) {
  assert.ok(card.th && card.en, `${card.id} must have Thai and English names`);
  assert.ok(['major', 'minor'].includes(card.arcana), `${card.id} has an invalid arcana`);
  assert.ok(Object.hasOwn(expectedSuitSizes, card.suit), `${card.id} has an invalid suit`);
  assert.equal(card.arcana === 'major', card.suit === 'major', `${card.id} arcana and suit disagree`);
  for (const [orientation, keywords] of Object.entries({ up: card.up, rev: card.rev })) {
    assert.ok(Array.isArray(keywords) && keywords.length >= 3, `${card.id} needs ${orientation} keywords`);
    assert.ok(
      keywords.every((keyword) => typeof keyword === 'string' && keyword.trim()),
      `${card.id} has an invalid ${orientation} keyword`
    );
  }
  for (const category of CATEGORIES) {
    for (const orientation of ['up', 'rev']) {
      assert.ok(
        typeof card.cat?.[category.key]?.[orientation] === 'string' &&
          card.cat[category.key][orientation].trim(),
        `${card.id} needs a ${orientation} ${category.key} reading`
      );
    }
  }
}

console.log('Verified 78 tarot cards and all category readings.');
