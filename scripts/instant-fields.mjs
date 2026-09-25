import { instantForms } from '../lib/instant-schema.js';
const escape = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
export function instantFields(language = 'en') {
  const { questions } = instantForms[language];
  const feeNote = language === 'es' ? 'La consulta con un abogado cuesta $150. Elegir ayuda gratuita o pro bono no reserva una consulta gratuita.' : 'The attorney consultation fee is $150. Choosing the free or pro bono option does not reserve a free consultation.';
  return questions.map((q, index) => `<fieldset class="instant-step" data-step="${index}" aria-describedby="hint-${index}">
<legend tabindex="-1">${escape(q.title)}</legend>
<p class="instant-step__hint" id="hint-${index}">${escape(q.hint)}</p>
<div class="instant-options">
${q.options.map(([id, label]) => `<label class="instant-option"><input type="radio" name="${q.name}" value="${id}" required><span>${escape(label)}</span></label>`).join('\n')}
</div>
${index === 4 ? `<p class="instant-fee-note">${feeNote}</p>` : ''}
</fieldset>`).join('\n');
}
