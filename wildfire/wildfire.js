import { instantForms, isDisqualified } from '/instant/schema.js';
const language = document.documentElement.lang === 'es' ? 'es' : 'en';
const form = document.querySelector('#wf-form');
const steps = [...form.querySelectorAll('.instant-step')];
const back = document.querySelector('#wf-back');
const embed = document.querySelector('#wf-embed');
let current = 0;
let loaded = false;
form.noValidate = true;
function show(index, focus = true) {
  current = index;
  form.hidden = false;
  embed.hidden = true;
  steps.forEach((step, i) => { step.hidden = i !== index; });
  back.hidden = index === 0;
  document.querySelector('#wf-progress').textContent = language === 'es' ? `Pregunta ${index + 1} de 5` : `Question ${index + 1} of 5`;
  if (focus) requestAnimationFrame(() => {
    const heading = steps[index].querySelector('legend');
    heading.focus();
    heading.scrollIntoView({ block: 'center' });
  });
}
function loadEmbed() {
  form.hidden = true;
  embed.hidden = false;
  document.querySelector('#wf-embed-title').focus();
  if (loaded) return;
  loaded = true;
  // Supplied Lawmatics snippet, loaded only after the local qualification questions.
  // Answers stay in this page; no personal information or answer values enter URLs/analytics.
  if (!window.lm_intake) {
    const intake = window.lm_intake = function () {
      intake.process ? intake.process.apply(intake, arguments) : intake.queue.push(arguments);
    };
    intake.queue = [];
    intake.t = Date.now();
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://navi.lawmatics.com/intake.min.js?t=' + Math.ceil(Date.now() / 864e5) * 864e5;
    document.head.append(script);
  }
  window.lm_intake('2dea1e18-5ad9-4988-aa79-493af577f8c0', 'lm-embedded-script', {});
}
form.addEventListener('submit', event => {
  event.preventDefault();
  const question = instantForms[language].questions[current];
  const selected = steps[current].querySelector('input:checked');
  if (!selected) { steps[current].querySelector('input').reportValidity(); return; }
  if (isDisqualified(language, { [question.name]: selected.value })) {
    form.hidden = true;
    const screening = document.querySelector('#wf-screening');
    screening.hidden = false;
    screening.focus();
    return;
  }
  if (current === steps.length - 1) loadEmbed();
  else show(current + 1);
});
back.addEventListener('click', () => show(Math.max(0, current - 1)));
document.querySelector('#wf-edit').addEventListener('click', () => show(steps.length - 1));
show(0, false);
