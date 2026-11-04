import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { questions, questionsApproved, nextStep } from '../fiance-visas/vsl/schema.js';
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
  assert.equal(questions.length, 5);
});

test('every combination proceeds to inactive booking; invalid choices do not advance', () => {
  let paths = 0;
  function walk(step) {
    if (step === 5) { paths++; return; }
    for (const option of questions[step].options) {
      assert.equal(nextStep(step, option), step + 1);
      walk(nextStep(step, option));
    }
    assert.equal(nextStep(step, 'invalid'), step);
  }
  walk(0);
  assert.equal(paths, 243);
  const page = readFileSync('fiance-visas/vsl/index.html', 'utf8');
  assert.doesNotMatch(page, /a0860595-7233-408e-989e-fde9fbd1d926|SjeCq22yzIFJF0xC/);
  assert.match(page, /noindex, follow/);
});
test('questions retain supplied English wording and order', () => {
  assert.deepEqual(questions.map(q => [q.title, q.options]), [
    ['Are you a U.S. citizen?', ['Yes', 'No', 'Not sure']],
    ['Where is your fiancé(e) currently living?', ['Outside the United States', 'Inside the United States', 'Other / not sure']],
    ['Are you currently legally married?', ['No', 'Yes', 'Not sure about our legal status']],
    ['Have you met in person within the past two years?', ['Yes', 'No', 'Not sure']],
    ['Would you be willing to invest $150 in a 45-minute consultation directly with an immigration attorney to discuss your case and immigration options?', [
      'A. Yes, I am ready to invest $150 to speak directly with an immigration attorney about my case.',
      'B. I am open to a paid consultation, but I am not ready to schedule it yet.',
      'C. I am looking for free or pro bono immigration assistance.'
    ]]
  ]);
  const runtime = readFileSync('fiance-visas/vsl/preview.js', 'utf8');
  assert.doesNotMatch(runtime, /isDisqualified|disqualification|localStorage|sessionStorage|sendBeacon|XMLHttpRequest/);
  assert.match(runtime, /event.detail > 1/);
});
