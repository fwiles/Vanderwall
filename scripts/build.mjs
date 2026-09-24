import { mkdir, cp, readFile, writeFile, rm } from 'node:fs/promises';

const output = new URL('../dist/', import.meta.url);
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(new URL('../assets/', import.meta.url), new URL('assets/', output), { recursive: true });
for (const name of ['styles.css', 'app.js', '404.html']) {
  await cp(new URL(`../${name}`, import.meta.url), new URL(name, output));
}
let origin = process.env.SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '');
if (origin) {
  const url = new URL(origin);
  if (url.protocol !== 'https:' || url.pathname !== '/' || url.search || url.hash || url.username || url.password) throw new Error('SITE_URL must be an HTTPS origin without a path or credentials');
  origin = url.origin;
}
if (process.env.INTAKE_WEBHOOK_URL && new URL(process.env.INTAKE_WEBHOOK_URL).protocol !== 'https:') throw new Error('Intake webhook must use HTTPS');
const production = process.env.VERCEL_ENV === 'production';
const config = { intakeEnabled: Boolean(process.env.INTAKE_WEBHOOK_URL), ga4: production ? process.env.GA4_ID || '' : '', ads: production ? process.env.GOOGLE_ADS_ID || '' : '', formLabel: process.env.GOOGLE_ADS_FORM_LABEL || '', callLabel: process.env.GOOGLE_ADS_CALL_LABEL || '' };
if (config.ga4 && !/^G-[A-Z0-9]+$/.test(config.ga4)) throw new Error('Invalid GA4_ID');
if (config.ads && !/^AW-\d+$/.test(config.ads)) throw new Error('Invalid GOOGLE_ADS_ID');
await writeFile(new URL('config.js', output), `window.LP_CONFIG = ${JSON.stringify(config).replaceAll('<', '\\u003c')};\n`);
for (const language of ['en', 'es']) {
  const path = language === 'en' ? '' : 'es/';
  let html = await readFile(new URL(`../${path}index.html`, import.meta.url), 'utf8');
  const metadata = origin ? `<link rel="canonical" href="${origin}/${path}">\n<link rel="alternate" hreflang="en" href="${origin}/">\n<link rel="alternate" hreflang="es" href="${origin}/es/">\n<link rel="alternate" hreflang="x-default" href="${origin}/">` : '';
  html = html.replace('<!-- DEPLOY_METADATA -->', metadata);
  if (!config.intakeEnabled) {
    const message = language === 'es' ? 'Las solicitudes en línea aún no están disponibles. Llame al (503) 206-8414 para solicitar una consulta.' : 'Online requests are not available yet. Please call (503) 206-8414 to request a consultation.';
    html = html.replace(/<form\b/, `<p class="form-status" id="intake-unavailable">${message}</p><form aria-describedby="intake-unavailable"`);
    html = html.replace('type="submit"', 'type="submit" disabled aria-describedby="intake-unavailable"');
    html = html.replace(' The form above reaches us any hour.', '').replace(' El formulario de arriba nos llega a cualquier hora.', '');
  }
  await mkdir(new URL(path, output), { recursive: true });
  await writeFile(new URL(`${path}index.html`, output), html);
}
await writeFile(new URL('robots.txt', output), 'User-agent: *\nAllow: /\n');
console.log(`Built English and Spanish pages. Intake: ${config.intakeEnabled ? 'configured' : 'form visible, submission disabled (set INTAKE_WEBHOOK_URL)'}. GTM: installed. Direct Google tags: ${production ? 'production configuration' : 'disabled for local/preview'}.`);
