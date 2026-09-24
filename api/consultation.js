const messages = {
  en: { invalid: 'Please check your name, phone number and email, then try again.', unavailable: 'Your request could not be confirmed. Please call (503) 206-8414 for help.', success: 'Thank you. Your request was received. We will call within one business day.' },
  es: { invalid: 'Revise su nombre, teléfono y correo electrónico e inténtelo de nuevo.', unavailable: 'No se pudo confirmar su solicitud. Llame al (503) 206-8414 para recibir ayuda.', success: 'Gracias. Recibimos su solicitud. Le llamaremos dentro de un día hábil.' }
};
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const json = req.headers.accept?.includes('application/json');
  let language = 'en';
  function reply(code, key) {
    const message = messages[language][key];
    res.statusCode = code;
    if (json) { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify({ ok: code === 200, message })); }
    else { res.setHeader('Content-Type', 'text/html; charset=utf-8'); res.end(`<!doctype html><html lang="${language}"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><meta name="robots" content="noindex"><title>Vanderwall Immigration</title><body><main><h1>Vanderwall Immigration</h1><p>${message}</p><p><a href="tel:+15032068414">(503) 206-8414</a></p><a href="${language === 'es' ? '/es/' : '/'}">${language === 'es' ? 'Volver' : 'Return to page'}</a></main></body></html>`); }
  }
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return reply(405, 'invalid'); }
  if (req.headers.origin) {
    try { if (new URL(req.headers.origin).host !== req.headers.host) return reply(403, 'invalid'); }
    catch { return reply(403, 'invalid'); }
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
  language = data.lang === 'es' ? 'es' : 'en';
  // Never forward submissions caught by the honeypot or report a lead conversion for them.
  if (data.website) return reply(400, 'invalid');
  const limits = { name: 120, phone: 40, email: 254, case_type: 200, message: 3000 };
  const lead = { lang: language };
  for (const [key, limit] of Object.entries(limits)) {
    if (data[key] !== undefined && typeof data[key] !== 'string') return reply(400, 'invalid');
    lead[key] = (data[key] || '').trim();
    if (lead[key].length > limit) return reply(400, 'invalid');
  }
  const digits = lead.phone.replace(/\D/g, '');
  if (lead.name.length < 2 || digits.length < 7 || digits.length > 15 || !/^[+\d\s().-]+$/.test(lead.phone) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) return reply(400, 'invalid');
  const endpoint = process.env.INTAKE_WEBHOOK_URL;
  if (!endpoint) return reply(503, 'unavailable');
  try {
    if (new URL(endpoint).protocol !== 'https:') return reply(503, 'unavailable');
    const response = await fetch(endpoint, { method: 'POST', redirect: 'error', signal: AbortSignal.timeout(10000), headers: { 'Content-Type': 'application/json', ...(process.env.INTAKE_WEBHOOK_TOKEN ? { Authorization: `Bearer ${process.env.INTAKE_WEBHOOK_TOKEN}` } : {}) }, body: JSON.stringify({ ...lead, source: 'vanderwall-landing-page', submitted_at: new Date().toISOString() }) });
    if (!response.ok) return reply(502, 'unavailable');
    return reply(200, 'success');
  } catch { return reply(502, 'unavailable'); }
}
