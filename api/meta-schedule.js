import { createHmac, timingSafeEqual, randomUUID } from 'node:crypto';
import { isIP } from 'node:net';

const SOURCE = 'https://app.vanderwallimmigration.com/';
const destinations = { en: '/thank-you/', es: '/es/thank-you/', vsl: '/vsl/thank-you/' };
const lifetime = 86400;
const clean = (v, max) => typeof v === 'string' && v.length <= max ? v : undefined;
const sign = value => createHmac('sha256', process.env.META_CAPI_ACCESS_TOKEN).update(value).digest('base64url');
const redisUrl = () => process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const redisToken = () => process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

async function redis(command) {
  const response = await fetch(redisUrl(), {
    method: 'POST', headers: { Authorization: `Bearer ${redisToken()}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(command), signal: AbortSignal.timeout(4000)
  });
  const data = await response.json();
  if (!response.ok || data.error) throw new Error('dedup_store_unavailable');
  return data.result;
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json');
  const reply = (status, data) => { res.statusCode = status; res.end(JSON.stringify(data)); };
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return reply(405, { ok: false }); }
  try {
    if (new URL(req.headers.origin).host !== req.headers.host) throw new Error();
  } catch { return reply(403, { ok: false }); }
  if (req.headers['content-type']?.split(';')[0] !== 'application/json') return reply(415, { ok: false });
  let input;
  try {
    let raw = req.body;
    if (raw === undefined) {
      const parts = []; let size = 0;
      for await (const part of req) { size += part.length; if (size > 8192) return reply(413, { ok: false }); parts.push(part); }
      raw = Buffer.concat(parts).toString();
    }
    if (Buffer.isBuffer(raw)) raw = raw.toString();
    if (Buffer.byteLength(typeof raw === 'string' ? raw : JSON.stringify(raw)) > 8192) return reply(413, { ok: false });
    input = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (!input || Array.isArray(input) || typeof input !== 'object') throw new Error();
  } catch { return reply(400, { ok: false }); }
  const token = process.env.META_CAPI_ACCESS_TOKEN;
  const dataset = process.env.META_DATASET_ID;
  const version = process.env.META_GRAPH_API_VERSION || 'v25.0';
  if (!token || !/^\d+$/.test(dataset || '') || !/^v\d+\.\d+$/.test(version) ||
      !redisUrl()?.startsWith('https://') || !redisToken()) {
    return reply(503, { ok: false, reason: 'not_configured' });
  }
  // Preview/local traffic can only reach Meta when explicitly using Test Events.
  if (process.env.VERCEL_ENV !== 'production' && !process.env.META_TEST_EVENT_CODE) return reply(503, { ok: false, reason: 'not_enabled' });
  const now = Math.floor(Date.now() / 1000);
  if (input.action === 'start' && Object.hasOwn(destinations, input.flow)) {
    const journey = { id: randomUUID(), flow: input.flow, issued: now,
      fbc: clean(input.fbc, 500), fbp: clean(input.fbp, 200) };
    const encoded = Buffer.from(JSON.stringify(journey)).toString('base64url');
    return reply(200, { ok: true, ticket: `${encoded}.${sign(encoded)}` });
  }
  let journey;
  const eventName = input.action === 'pageview' ? 'PageView' : 'custom_schedule';
  if (input.action === 'pageview') {
    if (typeof input.eventId !== 'string' || !/^[a-zA-Z0-9_-]{1,100}$/.test(input.eventId)) return reply(400, { ok: false, reason: 'invalid_event' });
    journey = { id: input.eventId, fbc: clean(input.fbc, 500), fbp: clean(input.fbp, 200) };
  } else try {
    if (input.action !== 'complete' || typeof input.ticket !== 'string') throw new Error();
    const [encoded, signature, extra] = input.ticket.split('.');
    const expected = sign(encoded);
    if (extra || !signature || signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) throw new Error();
    journey = JSON.parse(Buffer.from(encoded, 'base64url').toString());
    if (now < journey.issued || now - journey.issued >= lifetime || destinations[journey.flow] !== input.path) throw new Error();
  } catch { return reply(400, { ok: false, reason: 'invalid_journey' }); }
  const key = `vanderwall:${eventName}:${journey.id}`;
  try {
    // Atomic persistent claim prevents refreshes/concurrent instances from resending.
    const claimed = await redis(['SET', key, 'attempted', 'NX', 'EX', lifetime * 2]);
    if (claimed !== 'OK') {
      const state = await redis(['GET', key]);
      return reply(state === 'sent' ? 200 : 409, { ok: state === 'sent', reason: state === 'sent' ? 'already_sent' : 'delivery_unconfirmed' });
    }
    const ip = req.headers['x-forwarded-for']?.split(',')[0].trim();
    const payload = { data: [{ event_name: eventName, event_time: now, event_id: journey.id,
      action_source: 'website', event_source_url: SOURCE,
      user_data: { fbc: journey.fbc, fbp: journey.fbp, client_ip_address: isIP(ip || '') ? ip : undefined,
        client_user_agent: clean(req.headers['user-agent'], 2048) } }] };
    if (process.env.META_TEST_EVENT_CODE) payload.test_event_code = process.env.META_TEST_EVENT_CODE;
    const response = await fetch(`https://graph.facebook.com/${version}/${dataset}/events`, {
      method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload), signal: AbortSignal.timeout(8000)
    });
    const result = await response.json();
    if (!response.ok || result.events_received !== 1) {
      console.error('Meta CAPI rejected', { eventName, eventId: journey.id, status: response.status, code: result.error?.code });
      return reply(502, { ok: false, reason: 'meta_rejected' });
    }
    await redis(['SET', key, 'sent', 'EX', lifetime * 2]);
    console.info('Meta CAPI accepted', { eventName, eventId: journey.id });
    return reply(200, { ok: true });
  } catch {
    // An ambiguous timeout may already have reached Meta. Keep the claim; do not
    // automatically resend and risk counting another booking. Review server logs.
    console.error('Meta CAPI delivery unconfirmed', { eventName, eventId: journey.id });
    return reply(502, { ok: false, reason: 'delivery_unconfirmed' });
  }
}
