import { questions, isDisqualified, disqualificationMessage } from './schema.js';

const quiz = document.querySelector('#vsl-quiz');
const panel = document.querySelector('#question-panel');
const calendar = document.querySelector('#calendar-panel');
const back = document.querySelector('#back-button');
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
  document.querySelector('.vsl-reviews').hidden = true;
  document.querySelector('#questions').hidden = false;
  quiz.hidden = false;
  document.body.classList.add('vsl-flow');
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function loadCalendar() {
  if (document.querySelector('#lm-embedded-script')) return;
  const source = document.querySelector('#calendar-template').content.querySelector('script');
  const script = document.createElement('script');
  script.id = source.id;
  script.textContent = source.textContent;
  document.querySelector('#calendar-embed').append(script);
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
  const atCalendar = step === questions.length;
  calendar.hidden = !atCalendar;
  document.querySelector('.vsl-card').classList.toggle('vsl-card--calendar', atCalendar);
  if (atCalendar) loadCalendar();
  panel.hidden = atCalendar;
  back.hidden = step === 0;
  document.querySelector('#step-label').textContent = atCalendar ? 'Step 7 of 7 · Schedule your appointment' : `Question ${step + 1} of ${questions.length}`;
  document.querySelector('#step-progress').value = step + 1;
  panel.replaceChildren();
  if (!atCalendar) {
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
    (atCalendar ? document.querySelector('#calendar-title') : panel.querySelector('legend')).focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
}

function advance() {
  if (step >= questions.length || !answers[questions[step].name]) return;
  startFlow();
  step++;
  render();
}
back.addEventListener('click', () => { if (step > 0) { step--; render(); } });
const startButton = document.querySelector('#start-button');
startButton.addEventListener('click', () => {
  startFlow();
  render();
});
startButton.hidden = false;
