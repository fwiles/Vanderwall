import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
const build = overrides => execFileSync(process.execPath,['scripts/build.mjs'],{env:{...process.env,SITE_URL:'',INTAKE_WEBHOOK_URL:'',GA4_ID:'',GOOGLE_ADS_ID:'',VERCEL_PROJECT_PRODUCTION_URL:'',VERCEL_ENV:'preview',...overrides}});
test('deployment emits clean bilingual static output and safe configuration', () => {
  try {
    build({});
    assert.match(readFileSync('dist/index.html','utf8'),/<form hidden/);
    assert.match(readFileSync('dist/es/index.html','utf8'),/lang="es"/);
    assert.ok(!existsSync('dist/reference')); assert.ok(!existsSync('dist/copy'));
    build({SITE_URL:'https://landing.example.com',INTAKE_WEBHOOK_URL:'https://secret.example.com/hook',GA4_ID:'G-TEST123',VERCEL_ENV:'production'});
    const html=readFileSync('dist/es/index.html','utf8');
    assert.match(html,/href="https:\/\/landing.example.com\/es\/"/);
    assert.ok(!html.includes('<form hidden'));
    const config=readFileSync('dist/config.js','utf8');
    assert.ok(config.includes('G-TEST123')); assert.ok(!config.includes('secret.example'));
    for(const path of ['dist/index.html','dist/es/index.html']) {
      const page=readFileSync(path,'utf8');
      const ids=[...page.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
      assert.equal(new Set(ids).size,ids.length);
      for(const [,id] of page.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(id),`missing anchor ${id}`);
      for(const [,asset] of page.matchAll(/(?:src|href)="(\/(?:assets\/[^" ]+|styles.css|app.js|config.js))"/g)) assert.ok(existsSync('dist'+asset),`missing ${asset}`);
    }
  } finally { build({}); }
});
