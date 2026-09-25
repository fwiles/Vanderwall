import test from 'node:test';
import assert from 'node:assert/strict';
import handler from '../api/instant.js';
import { questions, lawmaticsEndpoint, instantForms } from '../lib/instant-schema.js';
const valid = { first_name: 'Test', phone: '(503) 555-0100', email: 'test@example.com', ...Object.fromEntries(questions.map(q => [q.name, q.options[0][0]])) };
async function request(body = valid, overrides = {}) {
  const req = { method: 'POST', body, ...overrides, headers: { accept: 'application/json', 'content-type': 'application/json', host: 'example.com', origin: 'https://example.com', ...overrides.headers } };
  const res = { headers: {}, setHeader(k,v) { this.headers[k] = v; }, end(body) { this.body = body; } };
  await handler(req, res); return res;
}
test('instant form validates and submits the PDF field mapping', async t => {
  const savedFetch = globalThis.fetch;
  let calls = [];
  globalThis.fetch = async (url, init) => { calls.push({ url, init, body: JSON.parse(init.body) }); return { ok: true, text: async () => '{"success":true}' }; };
  try {
    await t.test('forwards only mapped fields and supported attribution', async () => {
      const response = await request({ ...valid, utm_source: 'facebook', referring_url: 'https://example.com/instant/?private=discard#discard', extra: 'discard' });
      assert.equal(response.statusCode, 200);
      const sent = calls.at(-1);
      assert.equal(sent.url, lawmaticsEndpoint);
      assert.equal(sent.init.redirect, 'error');
      assert.deepEqual(sent.body, { ...valid, utm_source: 'facebook', referring_url: 'https://example.com/instant/' });
    });
    await t.test('accepts every PDF option without silently disqualifying visitors', async () => {
      for (const q of questions) for (const [id] of q.options) assert.equal((await request({ ...valid, [q.name]: id })).statusCode, 200);
    });
    await t.test('routes all Spanish PDF options to its own endpoint and localizes responses', async () => {
      const schema = instantForms.es;
      const spanish = { first_name: 'Test', phone: '(202) 555-0100', email: 'test@example.com', lang: 'es', ...Object.fromEntries(schema.questions.map(q => [q.name, q.options[0][0]])) };
      for (const q of schema.questions) for (const [id] of q.options) {
        const response = await request({ ...spanish, [q.name]: id });
        assert.equal(response.statusCode, 200);
        assert.match(JSON.parse(response.body).message, /Recibimos su solicitud/);
        assert.equal(calls.at(-1).url, schema.lawmaticsEndpoint);
        assert.equal(calls.at(-1).body[q.name], id);
        assert.equal(calls.at(-1).body.lang, undefined);
      }
      const native = await request(new URLSearchParams(spanish).toString(), { headers: { accept: 'text/html', 'content-type': 'application/x-www-form-urlencoded' } });
      assert.match(native.body, /lang="es"/);
      assert.match(native.body, /href="\/es\/instant\/">Volver al formulario/);
      const before = calls.length;
      for (const q of schema.questions) for (const value of [undefined, 'unknown']) assert.equal((await request({ ...spanish, [q.name]: value })).statusCode, 400);
      for (const body of [{ ...valid, lang: 'es' }, { ...spanish, lang: 'en' }, { ...valid, lang: 'fr' }]) assert.equal((await request(body)).statusCode, 400);
      const invalid = await request({ ...spanish, email: 'test@test' });
      assert.match(JSON.parse(invalid.body).message, /correo electrónico completo/);
      assert.equal(calls.length, before);
    });
    await t.test('rejects missing and forged answers before delivery', async () => {
      const before = calls.length;
      const bad = [null, [], '{bad', { ...valid, first_name: ' ' }, { ...valid, email: 'invalid' }, { ...valid, phone: 'abcdefghi' }, { ...valid, website: 'spam' }, { ...valid, utm_source: 'x'.repeat(201) }, { ...valid, referring_url: 'https://other.example/instant/' }];
      for (const q of questions) bad.push({ ...valid, [q.name]: undefined }, { ...valid, [q.name]: 'unknown' }, { ...valid, [q.name]: [q.options[0][0]] });
      for (const value of bad) assert.equal((await request(value)).statusCode, 400);
      assert.equal((await request('x'.repeat(17000))).statusCode, 413);
      assert.equal(calls.length, before);
    });
    await t.test('rejects unsupported and cross-origin requests; supports native POST', async () => {
      assert.equal((await request(valid, { method: 'GET' })).statusCode, 405);
      assert.equal((await request(valid, { headers: { origin: 'https://other.example' } })).statusCode, 403);
      assert.equal((await request(valid, { headers: { 'content-type': 'text/plain' } })).statusCode, 415);
      const res = await request(new URLSearchParams(valid).toString(), { headers: { accept: 'text/html', 'content-type': 'application/x-www-form-urlencoded' } });
      assert.equal(res.statusCode, 200); assert.match(res.body, /request was received/);
    });
    await t.test('never reports a lead for upstream errors, rejected bodies, or timeouts', async () => {
      globalThis.fetch = async () => ({ ok: false, status: 422 });
      const rejected = await request();
      assert.equal(rejected.statusCode, 502);
      assert.equal(JSON.parse(rejected.body).code, 'UPSTREAM_REJECTED_422');
      for (const body of ['{"errors":{"email":["invalid"]}}', '{"success":false}', '{"ok":false}', '<html>error</html>']) {
        globalThis.fetch = async () => ({ ok: true, text: async () => body });
        assert.equal((await request()).statusCode, 502);
      }
      globalThis.fetch = async () => { throw new Error('timeout'); };
      assert.equal((await request()).statusCode, 502);
      globalThis.fetch = async () => { throw new DOMException('timeout', 'TimeoutError'); };
      assert.equal(JSON.parse((await request()).body).code, 'UPSTREAM_TIMEOUT');
    });
    await t.test('accepts the documented Lawmatics created-record response', async () => {
      globalThis.fetch = async () => ({ ok: true, status: 201, text: async () => JSON.stringify({ data: { id: 'test-only', type: 'prospect', attributes: { first_name: 'Test' } } }) });
      assert.equal((await request()).statusCode, 200);
    });
    await t.test('explains contact validation errors without attempting delivery', async () => {
      globalThis.fetch = async () => { assert.fail('Invalid contact details must not reach Lawmatics'); };
      const invalidEmail = await request({ ...valid, email: 'test@test' });
      assert.equal(invalidEmail.statusCode, 400);
      assert.equal(JSON.parse(invalidEmail.body).code, 'INVALID_EMAIL');
      assert.match(JSON.parse(invalidEmail.body).message, /complete email address/);
      const invalidPhone = await request({ ...valid, phone: '123' });
      assert.equal(JSON.parse(invalidPhone.body).code, 'INVALID_PHONE');
    });
  } finally { globalThis.fetch = savedFetch; }
});
