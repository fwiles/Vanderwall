import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
test('AOS VSL language templates use their own client-supplied calendars', () => {
  for (const [path, id, video] of [
    ['vsl/index.html', '76942df5-f58d-421c-b1f2-2095353f4a6d', 'wZI6hQDL8cobVxgW'],
    ['es/vsl/index.html', '88757072-8a57-4513-a31d-5027d3654279', 'a60BQc8vPeYvF_w3']
  ]) {
    const html = readFileSync(path, 'utf8');
    const template = html.match(/<template id="calendar-template">([\s\S]*?)<\/template>/)[1];
    assert.deepEqual([...template.matchAll(/lm_intake\("([^"]+)"/g)].map(m => m[1]), [id]);
    assert.ok(html.includes(`vidalytics_embed_${video}`));
    assert.doesNotMatch(html.replace(template, ''), /lm_intake\(/);
  }
});
