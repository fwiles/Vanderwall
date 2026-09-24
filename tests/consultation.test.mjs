import test from 'node:test';
import assert from 'node:assert/strict';
import handler from '../api/consultation.js';
const valid = { name: 'Test Visitor', phone: '(503) 555-0100', email: 'test@example.com', case_type: 'Consultation', message: 'Test only', lang: 'en' };
async function request(body = valid, options = {}) {
  const req = { method: 'POST', headers: { accept: 'application/json', 'content-type': 'application/json', host: 'example.com', origin: 'https://example.com', ...options.headers }, body, ...options };
  const res = { headers: {}, setHeader(k,v) { this.headers[k]=v; }, end(body) { this.body=body; } };
  await handler(req,res); return res;
}
test('intake validates, protects and delivers without false success', async t => {
  const originalFetch = globalThis.fetch;
  const saved = process.env.INTAKE_WEBHOOK_URL;
  let calls = 0; let forwarded;
  globalThis.fetch = async (url, init) => { calls++; forwarded = JSON.parse(init.body); return { ok: true }; };
  process.env.INTAKE_WEBHOOK_URL='https://intake.example.com/hook';
  try {
    await t.test('delivers validated fields and language', async () => {
      const res = await request({ ...valid, lang: 'es', arbitrary: 'not forwarded' });
      assert.equal(res.statusCode,200); assert.equal(forwarded.lang,'es'); assert.equal(forwarded.arbitrary,undefined); assert.match(res.body,/Gracias/);
    });
    await t.test('rejects malformed, oversized, spam and invalid fields before delivery', async () => {
      const before=calls;
      for (const data of [null, [], '{bad', { ...valid, email: 'bad' }, { ...valid, phone: 'abcdefghi' }, { ...valid, name: ['bad'] }, { ...valid, website: 'spam' }, { ...valid, message: 'x'.repeat(3001) }]) assert.equal((await request(data)).statusCode,400);
      assert.equal((await request('x'.repeat(17000))).statusCode,413);
      assert.equal(calls,before);
    });
    await t.test('rejects cross-origin and unsupported requests', async () => {
      assert.equal((await request(valid,{method:'GET'})).statusCode,405);
      assert.equal((await request(valid,{headers:{origin:'https://bad.example',host:'example.com'}})).statusCode,403);
      assert.equal((await request(valid,{headers:{'content-type':'text/plain'}})).statusCode,415);
    });
    await t.test('supports native HTML form submissions', async () => {
      const res=await request(new URLSearchParams(valid).toString(), {headers:{'content-type':'application/x-www-form-urlencoded'}});
      assert.equal(res.statusCode,200); assert.match(res.headers['Content-Type'],/text\/html/);
    });
    await t.test('does not claim success without webhook or on upstream failure',async () => {
      delete process.env.INTAKE_WEBHOOK_URL;
      assert.equal((await request()).statusCode,503);
      process.env.INTAKE_WEBHOOK_URL='https://intake.example.com/hook';
      globalThis.fetch=async()=>({ok:false}); assert.equal((await request()).statusCode,502);
      globalThis.fetch=async()=>{throw new Error('timeout');}; assert.equal((await request()).statusCode,502);
    });
  } finally { globalThis.fetch=originalFetch; if (saved === undefined) delete process.env.INTAKE_WEBHOOK_URL; else process.env.INTAKE_WEBHOOK_URL=saved; }
});
