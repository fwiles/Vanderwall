import { questions, states, isDisqualified, disqualificationMessage } from './schema.js';

const quiz = document.querySelector('#vsl-quiz');
const form = document.querySelector('#vsl-form');
const panel = document.querySelector('#question-panel');
const contact = document.querySelector('#contact-panel');
const back = document.querySelector('#back-button');
const next = document.querySelector('#continue-button');
const submit = document.querySelector('#submit-button');
const error = document.querySelector('#form-error');
const answers = {};
let step = 0;
let started = false;

// Watch for the player even if the questionnaire starts before it finishes loading.
const embeds = (window._vidalytics ??= {}).embeds ??= {};
const embed = embeds.vidalytics_embed_wZI6hQDL8cobVxgW ??= {};
let videoPlayer = embed.player;
function connectVideoPlayer(player) {
  if (!player) return;
  player.on('play', () => { if (started) player.pause(); });
  if (started) player.pause();
}
if (videoPlayer) {
  connectVideoPlayer(videoPlayer);
} else {
  Object.defineProperty(embed, 'player', {
    configurable: true,
    get: () => videoPlayer,
    set(player) { videoPlayer = player; connectVideoPlayer(player); }
  });
}

function startFlow() {
  if (started) return;
  started = true;
  videoPlayer?.pause();
  document.querySelector('.vsl-hero').hidden = true;
  document.querySelector('.vsl-card-heading').hidden = true;
  document.body.classList.add('vsl-flow');
  window.scrollTo({ top: 0, behavior: 'instant' });
}

for (const state of states) {
  const option = document.createElement('option');
  option.value = option.textContent = state;
  form.elements.state.append(option);
}

function showError(message) {
  error.textContent = message;
  error.hidden = false;
}

function finish(title, message) {
  startFlow();
  quiz.hidden = true;
  document.querySelector('#vsl-result').hidden = false;
  document.querySelector('#result-title').textContent = title;
  document.querySelector('#result-message').textContent = message;
  document.querySelector('#result-title').focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function render(focus = true) {
  error.hidden = true;
  const atContact = step === questions.length;
  contact.hidden = !atContact;
  contact.disabled = !atContact;
  panel.hidden = atContact;
  next.hidden = true;
  submit.hidden = !atContact;
  back.hidden = step === 0;
  document.querySelector('#step-label').textContent = atContact ? 'Step 7 of 7 · Contact information' : `Question ${step + 1} of ${questions.length}`;
  document.querySelector('#step-progress').value = step + 1;
  panel.replaceChildren();
  if (!atContact) {
    const question = questions[step];
    const fieldset = document.createElement('fieldset');
    const legend = document.createElement('legend');
    legend.textContent = question.title;
    legend.tabIndex = -1;
    fieldset.append(legend);
    for (const [value, label] of question.options) {
      const option = document.createElement('label');
      option.className = 'vsl-option';
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = question.name;
      input.value = value;
      input.checked = answers[question.name] === value;
      input.addEventListener('click', () => {
        answers[question.name] = value;
        startFlow();
        error.hidden = true;
        // Stop immediately for any client-defined disqualifying answer.
        if (isDisqualified(answers)) {
          finish('Thank you for sharing your situation', disqualificationMessage);
          return;
        }
        advance();
      });
      const text = document.createElement('span');
      text.textContent = label;
      option.append(input, text);
      fieldset.append(option);
    }
    panel.append(fieldset);
  }
  if (focus) {
    (atContact ? contact : panel).querySelector('legend').focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
}

function advance() {
  if (!answers[questions[step].name]) {
    showError('Please choose an answer to continue.');
    panel.querySelector('input')?.focus();
    return;
  }
  startFlow();
  step++;
  render();
}
next.addEventListener('click', advance);
back.addEventListener('click', () => { if (step > 0) { step--; render(); } });
form.addEventListener('submit', event => {
  event.preventDefault();
  if (step < questions.length) { advance(); return; }
  if (isDisqualified(answers)) { finish('Thank you for sharing your situation', disqualificationMessage); return; }
  const phone = form.elements.phone.value.trim();
  const digits = phone.replace(/\D/g, '');
  if (form.elements.name.value.trim().length < 2) {
    showError('Please enter your full name.');
    form.elements.name.focus();
    return;
  }
  if (digits.length < 7 || digits.length > 15 || !/^[+\d\s().-]+$/.test(phone)) {
    showError('Please enter a valid phone number, including area or country code.');
    form.elements.phone.focus();
    return;
  }
  if (!form.elements.preferred_language.value.trim()) {
    showError('Please enter your preferred language.');
    form.elements.preferred_language.focus();
    return;
  }
  // Intentionally local-only at the client's request. No fetch, browser storage,
  // analytics payload, booking redirect, or successful-lead event is emitted.
  finish('You’ve reached the end of the preview', 'This form is not accepting submissions yet. Your information has not been sent and no appointment has been booked. To speak with our team, call (503) 206-8414.');
});
quiz.hidden = false;
render(false);
