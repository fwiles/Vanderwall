import { questions, questionsApproved } from './schema.js';
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

// This preview deliberately has no Lawmatics activation path. The exact snippet
// is staged only in an inert template; approved questions alone cannot unlock it.
function showFlow(open, focus = true) {
  started = open;
  if (open) videoPlayer?.pause();
  hero.hidden = open;
  reviews.hidden = open;
  section.hidden = !open;
  quiz.hidden = !open;
  document.body.classList.toggle('vsl-flow', open);
  if (open) {
    document.querySelector('#step-label').textContent = 'Intake questionnaire · Pending approval';
    panel.replaceChildren();
    const title = document.createElement('h2');
    title.id = 'pending-title';
    title.tabIndex = -1;
    title.textContent = 'Your intake questions will appear here';
    const note = document.createElement('p');
    note.textContent = !questionsApproved || questions.length === 0
      ? 'Samuel’s fiancé visa questions are pending. This review preview does not collect answers or load the booking form.'
      : 'Questions are staged for review. Booking remains inactive until the full flow is approved.';
    panel.append(title, note);
    if (focus) title.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'instant' });
  } else if (focus) startButton.focus();
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
document.querySelector('#back-button').addEventListener('click', returnToVideo);
document.addEventListener('keydown', event => { if (event.key === 'Escape') returnToVideo(); });
window.addEventListener('popstate', () => showFlow(location.hash === '#questions'));
startButton.hidden = false;
showFlow(location.hash === '#questions', location.hash === '#questions');
