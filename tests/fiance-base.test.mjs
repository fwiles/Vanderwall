import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { buildServicePages } from '../scripts/service-pages.mjs';
import { questions as english } from '../fiance-visas/vsl/schema.js';
import { questions as spanish } from '../es/fiance-visas/vsl/schema.js';

const escape = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

test('base fiancé pages use the approved bilingual questions and an unconditional private intake form', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'fiance-base-'));
  try {
    await buildServicePages(pathToFileURL(`${directory}/`), '');
    for (const [prefix, questions] of [['', english], ['es/', spanish]]) {
      const html = await readFile(join(directory, prefix, 'fiance-visas/index.html'), 'utf8');
      assert.match(html, prefix ? /Responda cinco preguntas breves/ : /Answer five quick questions/);
      const form = html.match(/<form[\s\S]*?<\/form>/)[0];
      assert.match(form, new RegExp(`action="/${prefix}book/" class="form" method="get"`));
      assert.doesNotMatch(form, /\bname=|\bon\w+=|disabled(?! selected)|\/api\//);
      const fields = [...form.matchAll(/<label for="([^"]+)">([^<]+)<\/label>\s*<select id="\1" required>([\s\S]*?)<\/select>/g)];
      assert.equal(fields.length, 5);
      assert.deepEqual(questions.map(q => q.options.length), [3, 4, 3, 3, 3]);
      fields.forEach(([, , title, options], index) => {
        assert.equal(title, escape(questions[index].title));
        assert.match(options, /^<option value="" disabled selected>/);
        assert.deepEqual([...options.matchAll(/<option>([^<]+)<\/option>/g)].map(m => m[1]), questions[index].options.map(escape));
      });
      assert.match(form, /<button[^>]+type="submit">/);
      assert.match(html, prefix ? /La cita gratuita es con admisión, no una consulta legal/ : /The free appointment is with intake, not an attorney consultation/);
    }
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
