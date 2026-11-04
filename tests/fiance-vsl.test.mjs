import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { questions, questionsApproved } from '../fiance-visas/vsl/schema.js';
test('fiancé preview cannot activate intake or reuse spouse screening', () => {
  const html = readFileSync('fiance-visas/vsl/index.html', 'utf8');
  const runtime = readFileSync('fiance-visas/vsl/preview.js', 'utf8');
  const template = html.match(/<template id="calendar-template">([\s\S]*?)<\/template>/)[1];
  assert.match(template, /9c9f0d5f-c64c-4b61-94d4-fb4ebb771220/);
  assert.doesNotMatch(html.replace(template,''), /lm_intake|navi\.lawmatics/);
  assert.doesNotMatch(runtime, /createElement\(['"]script|fetch\(|lm_intake|loadCalendar|calendar-template/);
  assert.doesNotMatch(html, /76942df5|wZI6hQDL8cobVxgW|href="\/book\/"|src="\/vsl\/vsl.js"/);
  assert.match(html, /huvcGAfeK4JoHBrx/);
  assert.equal(questionsApproved, false);
  assert.deepEqual(questions, []);
});
