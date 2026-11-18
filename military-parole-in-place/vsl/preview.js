const button = document.querySelector('#start-button');
const section = document.querySelector('#connect');
const heading = document.querySelector('#form-title');
// The supplied form is a contact form. Load it once, only after the recruiter asks to connect.
function loadForm() {
  if (document.querySelector('#lm-embedded-script')) return;
  const source = document.querySelector('#form-template').content.querySelector('script');
  const script = document.createElement('script');
  script.id = source.id;
  script.textContent = source.textContent;
  document.querySelector('#form-embed').append(script);
}
button.addEventListener('click', event => {
  if (event.detail > 1) return;
  section.hidden = false;
  button.setAttribute('aria-expanded', 'true');
  loadForm();
  heading.focus({ preventScroll: true });
  section.scrollIntoView({ behavior: 'instant', block: 'start' });
});
button.hidden = false;
button.setAttribute('aria-expanded', 'false');
