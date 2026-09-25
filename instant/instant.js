import { questions } from './schema.js';

const form = document.querySelector('#instant-form');
const steps = [...form.querySelectorAll('.instant-step')];
const next = document.querySelector('#instant-next');
const back = document.querySelector('#instant-back');
const submit = document.querySelector('#instant-submit');
const error = document.querySelector('#instant-error');
const progress = document.querySelector('#step-progress');
const summary = document.querySelector('#answer-summary');
const phone = form.elements.phone;
let current = 0;
let pending = false;
let advanceTimer;

// Native POST remains available without JavaScript; hidden steps are validated here.
form.noValidate = true;
form.querySelector('.instant-progress').hidden = false;
form.querySelector('.instant-answer-review').hidden = false;
function clearError() { error.hidden = true; error.textContent = ''; }
function validateStep(index) {
  if (index === steps.length - 1) {
    const value = phone.value.trim();
    const digits = value.replace(/\D/g, '');
    phone.setCustomValidity(digits.length >= 7 && digits.length <= 15 && /^[+\d\s().-]+$/.test(value) ? '' : 'Enter a valid phone number, including area or country code.');
    form.elements.first_name.setCustomValidity(form.elements.first_name.value.trim() ? '' : 'Enter your first name.');
    form.elements.email.setCustomValidity(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.elements.email.value.trim()) ? '' : 'Enter a complete email address, such as name@example.com.');
  }
  const invalid = [...steps[index].querySelectorAll('input')].find(input => !input.checkValidity());
  if (invalid) { invalid.reportValidity(); return false; }
  return true;
}
function renderSummary() {
  summary.replaceChildren();
  questions.forEach((q, index) => {
    const row = document.createElement('div');
    const title = document.createElement('dt');
    const answer = document.createElement('dd');
    const edit = document.createElement('button');
    title.textContent = q.short;
    answer.textContent = q.options.find(([value]) => value === form.elements[q.name].value)?.[1] || 'Not answered';
    edit.type = 'button'; edit.textContent = 'Edit'; edit.setAttribute('aria-label', `Edit ${q.short.toLowerCase()}`);
    edit.addEventListener('click', () => showStep(index));
    row.append(title, answer, edit); summary.append(row);
  });
}
function showStep(index, focus = true) {
  clearTimeout(advanceTimer);
  current = index;
  steps.forEach((step, i) => { step.hidden = i !== current; });
  back.hidden = current === 0;
  next.hidden = current === steps.length - 1;
  submit.hidden = !next.hidden;
  document.querySelector('#step-count').textContent = `Step ${current + 1} of ${steps.length}`;
  document.querySelector('#step-name').textContent = questions[current]?.short || 'Contact details';
  progress.value = current + 1;
  progress.textContent = `${current + 1} of ${steps.length}`;
  clearError();
  if (current === steps.length - 1) renderSummary();
  if (focus) steps[current].querySelector('legend').focus();
}
next.addEventListener('click', () => { if (!pending && validateStep(current)) showStep(current + 1); });
back.addEventListener('click', () => { if (!pending) showStep(current - 1); });
function advanceOnAnswer(event) {
  const input = event.target;
  if (pending || !(input instanceof HTMLInputElement) || input.type !== 'radio' ||
      !input.checked || !steps[current].contains(input) || current >= questions.length) return;
  clearTimeout(advanceTimer);
  const answeredStep = current;
  // Briefly show the selected state before moving focus to the next question.
  advanceTimer = setTimeout(() => {
    if (!pending && current === answeredStep && validateStep(current)) showStep(current + 1);
  }, 180);
}
form.addEventListener('change', advanceOnAnswer);
// A visitor going back can select the same answer again to continue.
form.addEventListener('click', advanceOnAnswer);
form.addEventListener('input', event => {
  if (event.target instanceof HTMLInputElement) event.target.setCustomValidity('');
  clearError();
});
form.addEventListener('submit', async event => {
  event.preventDefault();
  if (pending) return;
  if (current < steps.length - 1) { if (validateStep(current)) showStep(current + 1); return; }
  for (let i = 0; i < steps.length; i++) {
    // Reveal invalid steps before native validation tries to focus their controls.
    const invalid = [...steps[i].querySelectorAll('input')].some(input => !input.checkValidity());
    if (invalid) { showStep(i); validateStep(i); return; }
  }
  if (!validateStep(current)) return;
  clearError();
  const payload = Object.fromEntries(new FormData(form));
  const params = new URLSearchParams(location.search);
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']) {
    if (params.has(key)) payload[key] = params.get(key).slice(0, 200);
  }
  // Exclude query strings/fragments from the referring URL to avoid forwarding incidental data.
  payload.referring_url = location.origin + location.pathname;
  pending = true;
  form.setAttribute('aria-busy', 'true');
  const controls = [...form.querySelectorAll('input, button')];
  controls.forEach(control => { control.disabled = true; });
  submit.textContent = 'Sending your request…';
  let failureMessage = 'We couldn’t confirm your request. Your answers are still here. Try again, or call (503) 206-8414.';
  try {
    const response = await fetch(form.action, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload), signal: AbortSignal.timeout(15000)
    });
    const result = await response.json();
    if (!response.ok || !result.ok) {
      if (response.status === 400 && typeof result.message === 'string') failureMessage = `${result.message} Your answers are still here.`;
      console.error('Instant form submission failed', { status: response.status, code: result.code || 'REQUEST_REJECTED' });
      throw new Error('Submission not confirmed');
    }
    form.hidden = true;
    const success = document.querySelector('#instant-success');
    success.hidden = false; success.focus();
    document.dispatchEvent(new Event('instant-lead-confirmed'));
  } catch {
    error.textContent = failureMessage;
    error.hidden = false; error.focus();
  } finally {
    pending = false;
    controls.forEach(control => { control.disabled = false; });
    submit.textContent = 'Request Appointment';
    form.removeAttribute('aria-busy');
  }
});
showStep(0, false);
