import { mkdir, cp, readFile, writeFile, rm } from 'node:fs/promises';
import { instantFields } from './instant-fields.mjs';
import { disqualificationMessages } from '../lib/instant-schema.js';

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
  await mkdir(new URL(path, output), { recursive: true });
  await writeFile(new URL(`${path}index.html`, output), html);
}
for (const path of ['book/', 'es/book/']) {
  let html = await readFile(new URL(`../${path}index.html`, import.meta.url), 'utf8');
  html = html.replace('<!-- DEPLOY_METADATA -->', origin ? `<link rel="canonical" href="${origin}/${path}">\n<link rel="alternate" hreflang="en" href="${origin}/book/">\n<link rel="alternate" hreflang="es" href="${origin}/es/book/">` : '');
  await mkdir(new URL(path, output), { recursive: true });
  await writeFile(new URL(`${path}index.html`, output), html);
}
await writeFile(new URL('robots.txt', output), 'User-agent: *\nAllow: /\n');
await cp(new URL('../instant/', import.meta.url), new URL('instant/', output), { recursive: true });
await cp(new URL('../lib/instant-schema.js', import.meta.url), new URL('instant/schema.js', output));
for (const language of ['en', 'es']) {
  const path = language === 'es' ? 'es/instant/' : 'instant/';
  let instantHtml = await readFile(new URL(`../${path}index.html`, import.meta.url), 'utf8');
  instantHtml = instantHtml.replace('<!-- INSTANT_FORM_FIELDS -->', instantFields(language));
  instantHtml = instantHtml.replace('<!-- INSTANT_DISQUALIFICATION -->', `<p id="instant-disqualification" class="instant-screening" role="alert" tabindex="-1">${disqualificationMessages[language]}</p>`);
  instantHtml = instantHtml.replace('<!-- DEPLOY_METADATA -->', origin ? `<link rel="canonical" href="${origin}/${path}">\n<link rel="alternate" hreflang="en" href="${origin}/instant/">\n<link rel="alternate" hreflang="es" href="${origin}/es/instant/">` : '');
  await mkdir(new URL(path, output), { recursive: true });
  await writeFile(new URL(`${path}index.html`, output), instantHtml);

}
console.log(`Built English and Spanish landing, booking and instant-form pages. GTM: installed. Direct Google tags: ${production ? 'production configuration' : 'disabled for local/preview'}.`);
