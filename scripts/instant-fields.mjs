import { instantForms } from '../lib/instant-schema.js';
const escape = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
export function instantFields(language = 'en') {
  const { questions } = instantForms[language];
  const feeNote = language === 'es' ? 'La consulta con un abogado cuesta $150. Este formulario no ofrece consultas gratuitas o pro bono.' : 'The attorney consultation fee is $150. Free or pro bono consultations are not available through this form.';
  return questions.map((q, index) => `<fieldset class="instant-step" data-step="${index}" aria-describedby="hint-${index}">
<legend tabindex="-1">${escape(q.title)}</legend>
<p class="instant-step__hint" id="hint-${index}">${escape(q.hint)}</p>
<div class="instant-options">
${q.options.map(([id, label]) => `<label class="instant-option"><input type="radio" name="${q.name}" value="${id}" required><span>${escape(label)}</span></label>`).join('\n')}
</div>
${index === 4 ? `<p class="instant-fee-note">${feeNote}</p>` : ''}
</fieldset>`).join('\n');
}
