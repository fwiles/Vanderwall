import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { servicePages } from '../services/content.mjs';

const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const check = text => `<li><svg aria-hidden="true"><use href="#i-check"></use></svg><span>${escape(text)}</span></li>`;
const cards = (items, className) => items.map(([title, text]) => `<div class="${className}"><h3>${escape(title)}</h3><p>${escape(text)}</p></div>`).join('\n');
const replace = (html, pattern, content) => {
  if (!pattern.test(html)) throw new Error(`Service page template no longer matches ${pattern}`);
  return html.replace(pattern, () => content);
};

export async function buildServicePages(output, origin) {
  for (const page of servicePages) {
    for (const language of ['en', 'es']) {
      const es = language === 'es';
      const prefix = es ? 'es/' : '';
      const path = `${prefix}${page.slug}/`;
      const other = `/${es ? '' : 'es/'}${page.slug}/`;
      const c = page[language];
      let html = await readFile(new URL(`../${prefix}index.html`, import.meta.url), 'utf8');
      html = replace(html, /<title>[\s\S]*?<\/title>/, `<title>${escape(c.title)}</title>`);
      html = replace(html, /<meta content="[^"]*" name="description"\/>/, `<meta content="${escape(c.description)}" name="description"/>`);
      html = replace(html, /<a class="site-header__lang" href="[^"]*"/, `<a class="site-header__lang" href="${other}"`);
      html = replace(html, /<span class="eyebrow eyebrow--on-dark">[\s\S]*?<\/span>/, `<span class="eyebrow eyebrow--on-dark">${escape(c.eyebrow)}</span>`);
      html = replace(html, /<h1 class="hero__title">[\s\S]*?<\/h1>/, `<h1 class="hero__title">${escape(c.heading)}</h1>`);
      html = replace(html, /<p class="hero__lead">[\s\S]*?<\/p>/, `<p class="hero__lead">${escape(c.lead)}</p>`);
      html = replace(html, /<ul class="checks">[\s\S]*?<\/ul>/, `<ul class="checks">${c.checks.map(check).join('\n')}</ul>`);
      html = replace(html, /<h2 class="form-card__title">[\s\S]*?<\/h2>/, `<h2 class="form-card__title">${escape(c.formTitle)}</h2>`);
      const form = `<form action="/${prefix}book/" class="form" method="get" autocomplete="off">
${c.questions.map(([label, options], i) => `<div class="field"><label for="service-question-${i}">${escape(label)}</label>
<select id="service-question-${i}" required><option value="" disabled selected>${es ? 'Seleccione una opción' : 'Select an option'}</option>
${options.map(text => `<option>${escape(text)}</option>`).join('\n')}</select></div>`).join('\n')}
<button class="btn btn--primary btn--block" type="submit">${es ? 'Continuar a la cita gratuita' : 'Continue to free appointment'}</button>
</form>`;
      html = replace(html, /<form[\s\S]*?<\/form>/, form);
      html = replace(html, /<\/form>\s*<p class="form-card__note">[\s\S]*?<\/p>/, `</form><p class="form-card__note">${es ? 'En el siguiente paso elegirá su cita. Estas respuestas no se guardan ni se envían; el equipo confirmará los detalles durante su cita. La cita gratuita es con admisión, no una consulta legal con un abogado.' : 'Choose your appointment in the next step. These answers are not saved or sent ahead; our team will confirm the details at your appointment. The free appointment is with intake, not an attorney consultation.'}</p>`);
      html = replace(html, /<section aria-labelledby="services-title"[\s\S]*?<\/section>/, `<section aria-labelledby="services-title" class="services"><div class="container">
<div class="services__head"><span class="eyebrow">${es ? 'Cómo podemos ayudarle' : 'How we can help'}</span><h2 class="section-title" id="services-title">${escape(c.servicesTitle)}</h2><hr class="rule"/><p>${escape(c.servicesLead)}</p></div>
<div class="services__grid">${cards(c.services, 'service')}</div></div></section>`);
      html = replace(html, /<section aria-labelledby="stance-title"[\s\S]*?<\/section>/, `<section aria-labelledby="stance-title" class="stance"><div class="container">
<div class="stance__head"><h2 class="section-title section-title--on-dark" id="stance-title">${escape(c.stanceTitle)}</h2><hr class="rule"/><p class="stance__lead">${escape(c.stanceLead)}</p></div>
<div class="stance__grid">${cards(c.cards, 'stance__card')}</div>
<div class="stance__actions"><a class="btn btn--primary" href="#consult">${escape(c.stanceCta)}</a><a class="btn btn--ghost-dark" data-call href="tel:+15032068414">(503) 206-8414</a></div></div></section>`);
      const faqs = [...c.faqs, [es ? '¿La cita de admisión es gratuita?' : 'Is the intake appointment free?', es ? 'Sí. Es una cita con nuestro equipo de admisión para hablar de su situación y los próximos pasos. Es distinta de una consulta legal con un abogado. Pregunte por los honorarios de consulta y representación antes de contratar servicios.' : 'Yes. Meet with our intake team to discuss your situation and next steps. This is separate from legal advice in an attorney consultation. Ask about consultation and representation fees before hiring the firm.']];
      html = replace(html, /<section aria-labelledby="faq-title"[\s\S]*?<\/section>/, `<section aria-labelledby="faq-title" class="faq"><div class="container faq__grid">
<div class="faq__intro"><span class="eyebrow">${es ? 'Antes de empezar' : 'Before you begin'}</span><h2 class="section-title" id="faq-title">${es ? 'Sus preguntas, respuestas claras' : 'Your questions, clear answers'}</h2><hr class="rule"/><p>${es ? 'Orientación general. Sus opciones dependen de los detalles de su caso.' : 'General guidance. Your options depend on the details of your case.'}</p><a href="${c.related[1]}">${escape(c.related[0])}</a></div>
<div class="faq__list">${faqs.map(([q, a, source]) => `<details class="faq__item"><summary><span>${escape(q)}</span><span class="faq__plus"><svg aria-hidden="true"><use href="#i-plus"></use></svg></span></summary><p>${escape(a)}${source ? ` <a href="${source}">${es ? 'Fuente oficial (en inglés)' : 'Official source'}</a>` : ''}</p></details>`).join('\n')}</div></div></section>`);
      html = replace(html, /<h2 class="section-title section-title--on-dark" id="cta-title">[\s\S]*?<\/h2>/, `<h2 class="section-title section-title--on-dark" id="cta-title">${escape(c.finalTitle)}</h2>`);
      html = replace(html, /<p class="final-cta__lead">[\s\S]*?<\/p>/, `<p class="final-cta__lead">${escape(c.finalLead)}</p>`);
      html = html.replace('<!-- DEPLOY_METADATA -->', origin ? `<link rel="canonical" href="${origin}/${path}">\n<link rel="alternate" hreflang="en" href="${origin}/${page.slug}/">\n<link rel="alternate" hreflang="es" href="${origin}/es/${page.slug}/">\n<link rel="alternate" hreflang="x-default" href="${origin}/${page.slug}/">` : '');
      await mkdir(new URL(path, output), { recursive: true });
      await writeFile(new URL(`${path}index.html`, output), html);
    }
  }
}
