import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { questions, questionsApproved, nextStep, isDisqualified, disqualificationMessage } from '../fiance-visas/vsl/schema.js';
test('fiancé flow isolates its intake and does not reuse spouse screening', () => {
  const html = readFileSync('fiance-visas/vsl/index.html', 'utf8');
  const runtime = readFileSync('fiance-visas/vsl/preview.js', 'utf8');
  const template = html.match(/<template id="calendar-template">([\s\S]*?)<\/template>/)[1];
  assert.match(template, /9c9f0d5f-c64c-4b61-94d4-fb4ebb771220/);
  assert.doesNotMatch(html.replace(template,''), /lm_intake|navi\.lawmatics/);
  assert.doesNotMatch(runtime, /fetch\(|lm_intake|sendBeacon/);
  assert.doesNotMatch(html, /76942df5|wZI6hQDL8cobVxgW|href="\/book\/"|src="\/vsl\/vsl.js"/);
  assert.match(html, /huvcGAfeK4JoHBrx/);
  assert.equal(questionsApproved, true);
  assert.equal(questions.length, 5);
});

test('free or pro bono consultation answer disqualifies; every other choice proceeds', () => {
  const free = 'C. I am looking for free or pro bono immigration assistance.';
  let qualified = 0;
  let disqualified = 0;
  function walk(step) {
    if (step === 5) { qualified++; return; }
    for (const option of questions[step].options) {
      const answers = { [questions[step].name]: option };
      if (isDisqualified(answers)) {
        assert.equal(option, free);
        assert.equal(questions[step].name, 'consultation');
        assert.equal(nextStep(step, option), step);
        disqualified++;
        continue;
      }
      assert.equal(nextStep(step, option), step + 1);
      walk(step + 1);
    }
    assert.equal(nextStep(step, 'invalid'), step);
    assert.equal(isDisqualified({ [questions[step].name]: 'invalid' }), false);
  }
  walk(0);
  assert.equal(qualified, 216);
  assert.equal(disqualified, 108);
  assert.equal(isDisqualified({}), false);
  assert.equal(isDisqualified(undefined), false);
  assert.equal(disqualificationMessage, "Based on your answers, we're not able to offer a consultation through this form. Your request has not been sent.");
  const page = readFileSync('fiance-visas/vsl/index.html', 'utf8');
  assert.doesNotMatch(page, /a0860595-7233-408e-989e-fde9fbd1d926|SjeCq22yzIFJF0xC/);
  assert.match(page, /noindex, follow/);
});
test('questions retain supplied English wording and order', () => {
  assert.deepEqual(questions.map(q => [q.title, q.options]), [
    ['Are you a U.S. citizen?', ['Yes', 'No', 'Not sure']],
    ['Where is your fiancé(e) currently living?', ['Outside the United States', 'Inside the United States', 'Other', 'not sure']],
    ['Are you currently legally married?', ['No', 'Yes', 'Not sure about our legal status']],
    ['Have you met in person within the past two years?', ['Yes', 'No', 'Not sure']],
    ['Would you be willing to invest $150 in a 45-minute consultation directly with an immigration attorney to discuss your case and immigration options?', [
      'A. Yes, I am ready to invest $150 to speak directly with an immigration attorney about my case.',
      'B. I am open to a paid consultation, but I am not ready to schedule it yet.',
      'C. I am looking for free or pro bono immigration assistance.'
    ]]
  ]);
  const runtime = readFileSync('fiance-visas/vsl/preview.js', 'utf8');
  assert.match(runtime, /if \(isDisqualified\(answers\)\) \{\s*finish\('Thank you for sharing your situation', disqualificationMessage\);\s*return;\s*\}/);
  const finish = runtime.slice(runtime.indexOf('function finish'), runtime.indexOf('function render'));
  assert.match(finish, /calendar\.hidden = true/);
  assert.match(finish, /quiz\.hidden = true/);
  assert.match(finish, /#result-message/);
  assert.doesNotMatch(finish, /loadCalendar|dataLayer|booking-calendar-opened|dispatchEvent|fetch\(|lm_intake|fbq|gtag|sendBeacon|XMLHttpRequest|localStorage|sessionStorage/);
  assert.doesNotMatch(runtime, /localStorage|sessionStorage|sendBeacon|XMLHttpRequest|dataLayer|booking-calendar-opened|fbq\(|gtag\(/);
  assert.match(runtime, /event.detail > 1/);
  assert.match(runtime, /if \(terminal\) \{\s*loadCalendar\(\)/);
});
