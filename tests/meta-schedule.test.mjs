import test from 'node:test';
import assert from 'node:assert/strict';
import handler from '../api/meta-schedule.js';

async function request(body, headers = {}) {
  const req = { method: 'POST', headers: { host: 'app.vanderwallimmigration.com', origin: 'https://app.vanderwallimmigration.com', 'content-type': 'application/json', 'user-agent': 'test-browser', 'x-forwarded-for': '192.0.2.1', ...headers }, body };
  const res = { setHeader() {}, end(v) { this.body = JSON.parse(v); } };
  await handler(req, res);
  return res;
}
test('schedule CAPI authenticates journeys and delivers once with fixed source', async () => {
  const env = { META_CAPI_ACCESS_TOKEN: 'test-secret', META_DATASET_ID: '123456', META_GRAPH_API_VERSION: 'v25.0', META_TEST_EVENT_CODE: 'TEST', UPSTASH_REDIS_REST_URL: 'https://redis.example', UPSTASH_REDIS_REST_TOKEN: 'redis-secret', KV_REST_API_URL: '', KV_REST_API_TOKEN: '' };
  const saved = Object.fromEntries(Object.keys(env).map(k => [k, process.env[k]]));
  Object.assign(process.env, env);
  const original = globalThis.fetch;
  const records = new Map(); const events = [];
  let failMeta = false;
  globalThis.fetch = async (url, options) => {
    const body = JSON.parse(options.body);
    if (url === env.UPSTASH_REDIS_REST_URL) {
      let result;
      if (body[0] === 'GET') result = records.get(body[1]);
      else if (body.includes('NX') && records.has(body[1])) result = null;
      else { records.set(body[1], body[2]); result = 'OK'; }
      return { ok: true, json: async () => ({ result }) };
    }
    events.push(body);
    if (failMeta) throw new Error('timeout');
    return { ok: true, json: async () => ({ events_received: 1 }) };
  };
  try {
    assert.equal((await request({ action: 'start', flow: 'en' }, { origin: 'https://evil.example' })).statusCode, 403);
    assert.equal((await request({ action: 'complete', path: '/thank-you/' })).statusCode, 400);
    assert.equal((await request('x'.repeat(9000))).statusCode, 413);
    for (const [flow, path] of [['en', '/thank-you/'], ['es', '/es/thank-you/'], ['vsl', '/vsl/thank-you/']]) {
      const start = await request({ action: 'start', flow, fbc: 'fb.1.123.click', email: 'never-forward@example.com' });
      const ticket = start.body.ticket;
      assert.equal(start.statusCode, 200);
      assert.equal((await request({ action: 'complete', ticket: ticket + 'x', path })).statusCode, 400);
      assert.equal((await request({ action: 'complete', ticket, path: '/wrong/' })).statusCode, 400);
      const before = events.length;
      const results = await Promise.all([request({ action: 'complete', ticket, path }), request({ action: 'complete', ticket, path })]);
      assert.ok(results.some(r => r.statusCode === 200));
      assert.equal(events.length, before + 1);
      assert.equal((await request({ action: 'complete', ticket, path })).body.reason, 'already_sent');
      const event = events.at(-1).data[0];
      assert.equal(event.event_name, 'custom_schedule');
      assert.equal(event.event_source_url, 'https://app.vanderwallimmigration.com/');
      assert.equal(event.action_source, 'website');
      assert.equal(event.user_data.fbc, 'fb.1.123.click');
      assert.equal(event.user_data.client_ip_address, '192.0.2.1');
      assert.equal(event.user_data.email, undefined);
      assert.equal(events.at(-1).test_event_code, 'TEST');
    }
    process.env.KV_REST_API_URL = process.env.UPSTASH_REDIS_REST_URL;
    process.env.KV_REST_API_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
    assert.equal((await request({ action: 'start', flow: 'en' })).statusCode, 200);
    const countBeforePageView = events.length;
    const pageview = { action: 'pageview', eventId: 'pageview-test-1', fbp: 'fb.1.123.browser', event_source_url: 'https://ignored.example/', email: 'not-forwarded@example.com' };
    assert.equal((await request(pageview)).statusCode, 200);
    assert.equal(events.at(-1).data[0].event_name, 'PageView');
    assert.equal(events.at(-1).data[0].event_source_url, 'https://app.vanderwallimmigration.com/');
    assert.equal(events.at(-1).data[0].user_data.email, undefined);
    assert.equal((await request(pageview)).body.reason, 'already_sent');
    assert.equal(events.length, countBeforePageView + 1);
    assert.equal((await request({ action: 'pageview', eventId: '../invalid' })).statusCode, 400);
    failMeta = true;
    const { body: { ticket } } = await request({ action: 'start', flow: 'en' });
    assert.equal((await request({ action: 'complete', ticket, path: '/thank-you/' })).statusCode, 502);
    const count = events.length;
    assert.equal((await request({ action: 'complete', ticket, path: '/thank-you/' })).statusCode, 409);
    assert.equal(events.length, count, 'ambiguous failures must not resend');
    delete process.env.META_CAPI_ACCESS_TOKEN;
    assert.equal((await request({ action: 'start', flow: 'en' })).statusCode, 503);
  } finally {
    globalThis.fetch = original;
    for (const [k, v] of Object.entries(saved)) { if (v === undefined) delete process.env[k]; else process.env[k] = v; }
  }
});
