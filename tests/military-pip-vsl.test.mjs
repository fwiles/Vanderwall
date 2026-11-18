import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

const root = 'military-parole-in-place/vsl/';
const html = readFileSync(root + 'index.html', 'utf8');
const runtime = readFileSync(root + 'preview.js', 'utf8');
const build = readFileSync('scripts/build.mjs', 'utf8');

function files(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === 'dist' || name === '.git') continue;
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) files(full, acc);
    else if (/\.(html|xml|txt)$/.test(name)) acc.push(full);
  }
  return acc;
}

test('military parole page is an unlinked English preview with the supplied copy', () => {
  assert.match(html, /lang="en"/);
  assert.match(html, /noindex, follow/);
  assert.match(html, /GTM-KJ9SMN3/);
  assert.match(html, /cdn\.callrail\.com\/companies\/256727770\/26a3c72a70db842de287\/12\/swap\.js/);
  assert.doesNotMatch(html, /meta-schedule\.js|wZI6hQDL8cobVxgW|huvcGAfeK4JoHBrx|a60BQc8vPeYvF_w3|SjeCq22yzIFJF0xC/);
  assert.doesNotMatch(html, /site-header__lang|href="\/es\/|thank-you/);
  assert.doesNotMatch(html, /VIDEO PLACEHOLDER|pip-video/);
  assert.match(html, /class="vsl-player"/);
  assert.match(html, /id="vidalytics_embed_xdVYMgmKDjSB0SYH"/);
  assert.match(html, /padding-top: 56\.25%/);
  assert.match(html, /https:\/\/fast\.vidalytics\.com\/embeds\/e24TCOvn\/xdVYMgmKDjSB0SYH\//);
  assert.match(html, /Help Your Recruits' Families Navigate <span>Military Parole in Place<\/span>/);
  assert.match(html, /so you can point recruits to one firm\./);
  for (const line of [
    'One immigration contact you can hand to recruits and their families.',
    'We explain the Military Parole in Place process and which documents families usually gather.',
    'Bilingual English/Spanish support for families.',
    'Families get a free intake appointment to see whether we can help.',
    'Connect Your Recruits With Our Team',
    'Prefer to talk? Call',
    'What is Military Parole in Place?',
    'certain family members of active-duty service members, Selected Reserve members and some veterans may request parole while remaining in the U.S.',
    'Who is eligible?',
    "can't promise approval.",
    'Is there a cost?',
    'Family intake appointments are free; any attorney consultation fee is discussed up front.',
    'How do I refer someone?',
    "Submit the form or share this page's link.",
    'Attorney advertising.',
    '(503) 206-8414'
  ]) assert.ok(html.includes(line), line);
  assert.doesNotMatch(html, /Offices in Beaverton and Salem, Oregon, with remote appointments\./);
  assert.doesNotMatch(html, /approval rate|filing fee|within \d+ (?:days|weeks|months)/i);
  const template = html.match(/<template id="form-template">([\s\S]*?)<\/template>/)[1];
  assert.match(template, /lm_intake\("a7c05e63-5862-4761-8878-2078a14dc601"/);
  assert.doesNotMatch(html.replace(template, ''), /lm_intake|navi\.lawmatics/);
  assert.match(build, /military-parole-in-place\/vsl\//);
  for (const file of files('.')) {
    if (file === root + 'index.html') continue;
    assert.doesNotMatch(readFileSync(file, 'utf8'), /military-parole-in-place/, file);
  }
});

test('the recruiter button loads the contact form once and adds no tracking', () => {
  assert.match(runtime, /if \(document.querySelector\('#lm-embedded-script'\)\) return/);
  assert.match(runtime, /form-template/);
  assert.doesNotMatch(runtime, /dataLayer|booking-calendar-opened|dispatchEvent|fetch\(|sendBeacon|XMLHttpRequest|localStorage|sessionStorage|fbq\(|gtag\(|meta-schedule|thank-you/);
  assert.match(runtime, /event\.detail > 1/);
  assert.doesNotMatch(readFileSync(root + 'page.css', 'utf8'), /pip-video|aspect-ratio/);
});
