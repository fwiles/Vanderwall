import { instantForms } from '../lib/instant-schema.js';

const translations = { en: {
  invalid: 'Please complete all questions and check your contact details.',
  invalidEmail: 'Please enter a complete email address, such as name@example.com.',
  invalidPhone: 'Please enter a valid phone number, including area or country code.',
  unavailable: 'We couldn’t confirm your request. Please try again or call (503) 206-8414.',
  success: 'Thank you. Your request was received. Our team will contact you about next steps. Your appointment is not booked yet.'
}, es: {
  invalid: 'Complete todas las preguntas y revise sus datos de contacto.',
  invalidEmail: 'Ingrese un correo electrónico completo, como nombre@ejemplo.com.',
  invalidPhone: 'Ingrese un número de teléfono válido, incluido el código de área o país.',
  unavailable: 'No pudimos confirmar su solicitud. Inténtelo de nuevo o llame al (503) 206-8414.',
  success: 'Gracias. Recibimos su solicitud. Nuestro equipo se comunicará con usted sobre los próximos pasos. Su cita aún no está reservada.'
} };

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  let language = 'en';
  const wantsJson = req.headers.accept?.includes('application/json');
  function reply(code, key, diagnosticCode) {
    const messages = translations[language];
    if (code >= 400 && code < 500) console.error('Instant form request rejected', { status: code, code: diagnosticCode || 'INVALID_REQUEST' });
    res.statusCode = code;
    if (wantsJson) {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ ok: code === 200, message: messages[key], ...(diagnosticCode ? { code: diagnosticCode } : {}) }));
    } else {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.end(`<!doctype html><html lang="${language}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>Vanderwall Immigration</title><link rel="stylesheet" href="/styles.css"></head><body><main class="container" style="padding-block:48px;max-width:760px"><h1>Vanderwall Immigration</h1><p>${messages[key]}</p><p><a href="tel:+15032068414">(503) 206-8414</a></p><p><a href="${language === 'es' ? '/es/instant/' : '/instant/'}">${language === 'es' ? 'Volver al formulario' : 'Return to the form'}</a></p></main></body></html>`);
    }
  }
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return reply(405, 'invalid'); }
  if (req.headers.origin) {
    try { if (new URL(req.headers.origin).host !== req.headers.host) return reply(403, 'invalid', 'ORIGIN_MISMATCH'); }
    catch { return reply(403, 'invalid', 'ORIGIN_MISMATCH'); }
  }
  const type = (req.headers['content-type'] || '').split(';')[0];
  if (!['application/json', 'application/x-www-form-urlencoded'].includes(type)) return reply(415, 'invalid');
  let data;
  try {
    let raw = req.body;
    if (raw === undefined) {
      const parts = []; let size = 0;
      for await (const part of req) { size += part.length; if (size > 16384) return reply(413, 'invalid'); parts.push(part); }
      raw = Buffer.concat(parts).toString();
    }
    if (Buffer.isBuffer(raw)) raw = raw.toString();
    if (Buffer.byteLength(typeof raw === 'string' ? raw : JSON.stringify(raw)) > 16384) return reply(413, 'invalid');
    data = typeof raw === 'string' ? (type === 'application/json' ? JSON.parse(raw) : Object.fromEntries(new URLSearchParams(raw))) : raw;
    if (!data || typeof data !== 'object' || Array.isArray(data)) return reply(400, 'invalid');
  } catch { return reply(400, 'invalid'); }
  if (data.lang !== undefined && !['en', 'es'].includes(data.lang)) return reply(400, 'invalid', 'INVALID_LANGUAGE');
  language = data.lang || 'en';
  const { questions, lawmaticsEndpoint } = instantForms[language];
  if (data.website) return reply(400, 'invalid', 'SPAM_FIELD_FILLED');
  const lead = {};
  for (const [key, limit] of Object.entries({ first_name: 120, phone: 40, email: 254 })) {
    if (typeof data[key] !== 'string') return reply(400, 'invalid', `MISSING_${key.toUpperCase()}`);
    lead[key] = data[key].trim();
    if (!lead[key] || lead[key].length > limit) return reply(400, 'invalid', `INVALID_${key.toUpperCase()}`);
  }
  const digits = lead.phone.replace(/\D/g, '');
  if (digits.length < 7 || digits.length > 15 || !/^[+\d\s().-]+$/.test(lead.phone)) return reply(400, 'invalidPhone', 'INVALID_PHONE');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) return reply(400, 'invalidEmail', 'INVALID_EMAIL');
  for (const q of questions) {
    if (typeof data[q.name] !== 'string' || !q.options.some(([id]) => id === data[q.name])) return reply(400, 'invalid', `INVALID_${q.name.toUpperCase()}`);
    lead[q.name] = data[q.name];
  }
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']) {
    if (data[key] === undefined) continue;
    if (typeof data[key] !== 'string' || data[key].length > 200) return reply(400, 'invalid', 'INVALID_ATTRIBUTION');
    if (data[key].trim()) lead[key] = data[key].trim();
  }
  if (data.referring_url !== undefined) {
    try {
      if (typeof data.referring_url !== 'string' || data.referring_url.length > 2048) return reply(400, 'invalid', 'INVALID_REFERRING_URL');
      const url = new URL(data.referring_url);
      if (!['https:', 'http:'].includes(url.protocol) || url.host !== req.headers.host || url.username || url.password) return reply(400, 'invalid', 'REFERRING_ORIGIN_MISMATCH');
      lead.referring_url = url.origin + url.pathname;
    } catch { return reply(400, 'invalid'); }
  }
  try {
    const response = await fetch(lawmaticsEndpoint, {
      method: 'POST', redirect: 'error', signal: AbortSignal.timeout(10000),
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(lead)
    });
    if (!response.ok) {
      // Log only transport metadata, never contact details, answers, or response bodies.
      console.error('Instant form delivery failed', { code: 'UPSTREAM_REJECTED', status: response.status });
      return reply(502, 'unavailable', `UPSTREAM_REJECTED_${response.status}`);
    }
    // Some APIs report validation failures in a JSON body with a 2xx status.
    const body = await response.text();
    if (body) {
      const result = JSON.parse(body);
      const errors = result?.errors;
      if (result?.success === false || result?.ok === false || result?.error ||
          (errors && (typeof errors !== 'object' || Object.keys(errors).length > 0))) {
        console.error('Instant form delivery failed', { code: 'UPSTREAM_VALIDATION' });
        return reply(502, 'unavailable', 'UPSTREAM_VALIDATION');
      }
    }
    return reply(200, 'success');
  } catch (error) {
    const code = error.name === 'TimeoutError' ? 'UPSTREAM_TIMEOUT' : error instanceof SyntaxError ? 'UPSTREAM_RESPONSE_FORMAT' : 'UPSTREAM_CONNECTION';
    console.error('Instant form delivery failed', { code });
    return reply(502, 'unavailable', code);
  }
}
