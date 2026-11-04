import { questions, nextStep } from './schema.js';
const hero = document.querySelector('.vsl-hero');
const reviews = document.querySelector('.vsl-reviews');
const section = document.querySelector('#questions');
const quiz = document.querySelector('#vsl-quiz');
const panel = document.querySelector('#question-panel');
const startButton = document.querySelector('#start-button');
let started = false;
// Watch for the player even if the questionnaire starts before it finishes loading.
const embeds = (window._vidalytics ??= {}).embeds ??= {};
const embedId = document.querySelector('.vsl-player [id^="vidalytics_embed_"]').id;
const embed = embeds[embedId] ??= {};
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

// Answers stay in memory. Only the supplied calendar is loaded, once, after Q5.
const calendar = document.querySelector('#calendar-panel');
function loadCalendar() {
  if (document.querySelector('#lm-embedded-script')) return;
  const source = document.querySelector('#calendar-template').content.querySelector('script');
  const script = document.createElement('script');
  script.id = source.id;
  script.textContent = source.textContent;
  document.querySelector('#calendar-embed').append(script);
}
const answers = {};
let step = 0;
function render() {
  panel.replaceChildren();
  const terminal = step === questions.length;
  document.querySelector('#step-label').textContent = terminal
    ? 'Step 6 of 6 · Schedule your appointment' : `Question ${step + 1} of ${questions.length}`;
  const progress = document.querySelector('#step-progress');
  progress.hidden = false;
  progress.max = questions.length + 1;
  progress.value = step + 1;
  progress.setAttribute('aria-label', 'Questionnaire progress');
  document.querySelector('#back-button').textContent = step ? '← Back' : '← Back to video';
  let heading;
  calendar.hidden = !terminal;
  panel.hidden = terminal;
  document.querySelector('.vsl-card').classList.toggle('vsl-card--calendar', terminal);
  if (terminal) {
    loadCalendar();
    heading = document.querySelector('#calendar-title');
  } else {
    const question = questions[step];
    const fieldset = document.createElement('fieldset');
    heading = document.createElement('legend');
    heading.textContent = question.title;
    fieldset.append(heading);
    const renderedStep = step;
    let advancing = false;
    for (const label of question.options) {
      const row = document.createElement('label');
      row.className = 'vsl-option';
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = question.name;
      input.value = label;
      input.checked = answers[question.name] === label;
      input.addEventListener('click', event => {
        if (event.detail > 1 || advancing || step !== renderedStep) {
          event.preventDefault();
          heading.focus({ preventScroll: true });
          return;
        }
        advancing = true;
        answers[question.name] = label;
        step = nextStep(step, label);
        render();
      });
      const text = document.createElement('span');
      text.textContent = label;
      row.append(input, text);
      fieldset.append(row);
    }
    panel.append(fieldset);
    if (step === questions.length - 1) {
      const note = document.createElement('p');
      note.textContent = 'The team intake appointment is free. An attorney consultation is a separate option. Selecting an answer does not authorize a payment.';
      panel.append(note);
    }
  }
  heading.tabIndex = -1;
  heading.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: 'instant' });
}
function showFlow(open) {
  started = open;
  if (open) videoPlayer?.pause();
  hero.hidden = open;
  reviews.hidden = open;
  section.hidden = !open;
  quiz.hidden = !open;
  document.body.classList.toggle('vsl-flow', open);
  if (open) render();
  else startButton.focus();
}
startButton.addEventListener('click', () => {
  if (started) return;
  history.pushState({ fiancePreview: true }, '', '#questions');
  showFlow(true);
});
function returnToVideo() {
  if (!started) return;
  if (history.state?.fiancePreview) history.back();
  else { history.replaceState(null, '', location.pathname + location.search); showFlow(false); }
}
document.querySelector('#back-button').addEventListener('click', event => {
  if (event.detail > 1) return;
  if (step > 0) { step--; render(); } else returnToVideo();
});
document.addEventListener('keydown', event => { if (event.key === 'Escape') returnToVideo(); });
window.addEventListener('popstate', () => showFlow(location.hash === '#questions'));
startButton.hidden = false;
if (location.hash === '#questions') showFlow(true);
