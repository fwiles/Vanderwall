import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
const script = readFileSync(new URL('../meta-schedule.js', import.meta.url), 'utf8');
test('browser preserves attribution across booking redirect and ignores refresh/direct visits', async () => {
  const storage = new Map(); const calls = []; const pageviews = [];
  let id = 0;
  const run = async (pathname, search = '', calendar = false) => {
    const listeners = {};
    runInNewContext(script, {
      location: { pathname, search }, URLSearchParams, Date, console, window: {}, crypto: { randomUUID: () => `view-${++id}` },
      document: { cookie: '_fbp=fb.1.123.browser', addEventListener: (event, fn) => { listeners[event] = fn; } },
      sessionStorage: { getItem: k => storage.get(k), setItem: (k, v) => storage.set(k, v) },
      fetch: async (_url, options) => { const body = JSON.parse(options.body); (body.action === 'pageview' ? pageviews : calls).push(body); return { ok: true, json: async () => ({ ok: true, ticket: 'signed-ticket' }) }; }
    });
    if (calendar) listeners['booking-calendar-opened']();
    await new Promise(resolve => setImmediate(resolve));
  };
  await run('/thank-you/'); assert.equal(calls.length, 0);
  await run('/', '?fbclid=click123'); assert.equal(calls.length, 0);
  await run('/book/'); assert.equal(calls[0].action, 'start');
  assert.match(calls[0].fbc, /^fb\.1\.\d+\.click123$/);
  assert.equal(calls[0].fbp, 'fb.1.123.browser');
  await run('/es/thank-you/'); assert.equal(calls.length, 1);
  await run('/thank-you/'); assert.equal(calls[1].action, 'complete');
  await run('/thank-you/'); assert.equal(calls.length, 2);
  await run('/es/vsl/'); assert.equal(calls.length, 2);
  await run('/es/vsl/', '', true); assert.equal(calls[2].flow, 'vsl');
  await run('/vsl/thank-you/'); assert.equal(calls[3].action, 'complete');
  assert.equal(pageviews.length, 9);
  assert.equal(new Set(pageviews.map(v => v.eventId)).size, 9);
  assert.match(pageviews[1].fbc, /^fb\.1\.\d+\.click123$/);
});
