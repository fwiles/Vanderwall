import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { questions, questionsApproved, nextStep } from '../es/fiance-visas/vsl/schema.js';
import { questions as enQuestions, nextStep as enNextStep } from '../fiance-visas/vsl/schema.js';
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
test('all 324 paths in each language proceed with no answer submission path', () => {
  for (const [qs, next] of [[questions, nextStep], [enQuestions, enNextStep]]) {
    let paths = 0;
    function walk(step) {
      if (step === 5) { paths++; return; }
      for (const choice of qs[step].options) { assert.equal(next(step, choice), step + 1); walk(next(step, choice)); }
      assert.equal(next(step, 'INVALID'), step);
    }
    walk(0); assert.equal(paths, 324);
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
    assert.doesNotMatch(runtime, /fetch\(|lm_intake|isDisqualified|disqualification|localStorage|sessionStorage|sendBeacon|XMLHttpRequest|dataLayer/);
    assert.match(runtime, /event.detail > 1/);
    assert.match(runtime, /if \(terminal\) \{\s*loadCalendar\(\)/);
    assert.match(runtime, /if \(document.querySelector\('#lm-embedded-script'\)\) return/);
    assert.doesNotMatch(html, /booking remains inactive|reservas siguen inactivas|role="note"/);
    assert.doesNotMatch(html, /88757072|76942df5|2dea1e18/);
  }
});
