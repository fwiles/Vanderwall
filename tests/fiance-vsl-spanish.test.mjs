import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { questions, questionsApproved, nextStep, isDisqualified, disqualificationMessage } from '../es/fiance-visas/vsl/schema.js';
import { questions as enQuestions, nextStep as enNextStep, isDisqualified as enIsDisqualified, disqualificationMessage as enDisqualificationMessage } from '../fiance-visas/vsl/schema.js';
test('Spanish fiancé questions preserve source wording, order and four location choices', () => {
  assert.equal(questionsApproved, true);
  assert.deepEqual(questions.map(q => [q.title, q.options]), [
    ['¿Es usted ciudadano(a) de Estados Unidos?', ['Sí', 'No', 'No estoy seguro(a)']],
    ['¿Dónde vive actualmente su prometido(a)?', ['Fuera de Estados Unidos', 'Dentro de Estados Unidos', 'Otro', 'No estoy seguro(a)']],
    ['¿Actualmente están legalmente casados?', ['No', 'Sí', 'No estoy seguro(a) de nuestro estado civil legal']],
    ['¿Se han reunido en persona durante los últimos dos años?', ['Sí', 'No', 'No estoy seguro(a)']],
    ['¿Estaría dispuesto(a) a invertir $150 en una consulta de 45 minutos directamente con un abogado de inmigración para hablar sobre su caso y sus opciones migratorias?', [
      'A. Sí, estoy listo(a) para invertir $150 para hablar directamente con un abogado de inmigración sobre mi caso.',
      'B. Estoy dispuesto(a) a tener una consulta pagada, pero todavía no estoy listo(a) para agendarla.',
      'C. Busco ayuda migratoria gratuita o pro bono.'
    ]]
  ]);
});
test('option C disqualifies in each language; every other path still reaches booking', () => {
  assert.equal(disqualificationMessage, 'Según sus respuestas, no podemos ofrecerle una consulta a través de este formulario. Su solicitud no se ha enviado.');
  assert.equal(enDisqualificationMessage, "Based on your answers, we're not able to offer a consultation through this form. Your request has not been sent.");
  for (const [qs, next, stopped, free] of [
    [questions, nextStep, isDisqualified, 'C. Busco ayuda migratoria gratuita o pro bono.'],
    [enQuestions, enNextStep, enIsDisqualified, 'C. I am looking for free or pro bono immigration assistance.']
  ]) {
    let qualified = 0;
    let disqualified = 0;
    function walk(step) {
      if (step === 5) { qualified++; return; }
      for (const choice of qs[step].options) {
        if (stopped({ [qs[step].name]: choice })) {
          assert.equal(choice, free);
          assert.equal(qs[step].name, 'consultation');
          assert.equal(next(step, choice), step);
          disqualified++;
          continue;
        }
        assert.equal(next(step, choice), step + 1);
        walk(step + 1);
      }
      assert.equal(next(step, 'INVALID'), step);
    }
    walk(0);
    assert.equal(qualified, 216);
    assert.equal(disqualified, 108);
    assert.equal(stopped({ consultation: qs.at(-1).options[0] }), false);
    assert.equal(stopped({ consultation: qs.at(-1).options[1] }), false);
  }
  for (const [prefix, other, id, video] of [
    ['', 'es/', '9c9f0d5f-c64c-4b61-94d4-fb4ebb771220', 'huvcGAfeK4JoHBrx'],
    ['es/', '', 'a0860595-7233-408e-989e-fde9fbd1d926', 'SjeCq22yzIFJF0xC']
  ]) {
    const root = `${prefix}fiance-visas/vsl/`;
    const html = readFileSync(root + 'index.html', 'utf8');
    const runtime = readFileSync(root + 'preview.js', 'utf8');
    const template = html.match(/<template id="calendar-template">([\s\S]*?)<\/template>/)[1];
    assert.deepEqual([...template.matchAll(/lm_intake\("([^"]+)"/g)].map(m=>m[1]), [id]);
    assert.ok(html.includes(`https://fast.vidalytics.com/embeds/e24TCOvn/${video}/`));
    assert.ok(html.includes(`class="site-header__lang" href="/${other}fiance-visas/vsl/"`));
    assert.match(html, /noindex, follow/);
    assert.doesNotMatch(html.replace(template,''), /lm_intake|navi\.lawmatics/);
    const title = prefix === 'es/' ? 'Gracias por compartir su situación' : 'Thank you for sharing your situation';
    assert.match(runtime, new RegExp(`if \\(isDisqualified\\(answers\\)\\) \\{\\s*finish\\('${title}', disqualificationMessage\\);\\s*return;\\s*\\}`));
    const finish = runtime.slice(runtime.indexOf('function finish'), runtime.indexOf('function render'));
    assert.match(finish, /calendar\.hidden = true/);
    assert.match(finish, /quiz\.hidden = true/);
    assert.doesNotMatch(finish, /loadCalendar|dataLayer|booking-calendar-opened|dispatchEvent|fetch\(|lm_intake/);
    assert.doesNotMatch(runtime, /fetch\(|lm_intake|localStorage|sessionStorage|sendBeacon|XMLHttpRequest|dataLayer|booking-calendar-opened|fbq\(|gtag\(/);
    assert.match(runtime, /event.detail > 1/);
    assert.match(runtime, /if \(terminal\) \{\s*loadCalendar\(\)/);
    assert.match(runtime, /if \(document.querySelector\('#lm-embedded-script'\)\) return/);
    assert.doesNotMatch(html, /booking remains inactive|reservas siguen inactivas|role="note"/);
    assert.doesNotMatch(html, /88757072|76942df5|2dea1e18/);
  }
});
