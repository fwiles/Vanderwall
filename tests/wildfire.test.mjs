import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { buildWildfirePages } from '../scripts/wildfire-pages.mjs';
test('Wildfire isolates bilingual routes, intake and metadata', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'wildfire-test-'));
  try {
    await buildWildfirePages(pathToFileURL(dir + '/'), 'https://example.com');
    for (const prefix of ['', 'es/']) {
      const page = await readFile(join(dir, prefix, 'instant-wf/index.html'), 'utf8');
      assert.match(page, /id="wf-form" hidden/);
      assert.equal((page.match(/class="instant-step"/g) || []).length, 5);
      assert.doesNotMatch(page, /\/api\/instant|\/instant\/instant.js|instant-form|INSTANT_FORM_FIELDS|DEPLOY_METADATA|NEW NUMBER|Wildfire phone pending/);
      assert.ok(page.includes(prefix ? '/wildfire/wildfire.js' : '/wildfire/wildfire-en.js'));
      assert.doesNotMatch(page, /503\) 206-8414|15032068414/);
      assert.match(page, /class="wf-hero-call"/);
      assert.ok(page.includes(prefix ? '¿Prefiere hablar ahora?' : 'Prefer to talk now?'));
      assert.match(page, /href="tel:\+13605640763"/);
      assert.ok(page.includes(`href="https://example.com/${prefix}instant-wf/"`));
      assert.ok(page.includes(`href="/${prefix ? '' : 'es/'}instant-wf/"`));
      assert.match(page, /GTM-KJ9SMN3/);
      assert.match(page, /cdn.callrail.com\/companies\/256727770/);
      assert.ok(page.includes(prefix ? '2dea1e18-5ad9-4988-aa79-493af577f8c0' : '00183874-c318-4b52-a528-f86368b354c3'));
    }
    const js = await readFile(join(dir, 'wildfire/wildfire.js'), 'utf8');
    const enJs = await readFile(join(dir, 'wildfire/wildfire-en.js'), 'utf8');
    assert.equal(enJs, js.replaceAll('2dea1e18-5ad9-4988-aa79-493af577f8c0', '00183874-c318-4b52-a528-f86368b354c3'));
    assert.doesNotMatch(js, /fetch\(|instant-lead-confirmed|generate_lead/);
  } finally { await rm(dir, { recursive: true, force: true }); }
});
