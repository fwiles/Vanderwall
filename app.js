(() => {
  const config = window.LP_CONFIG || {};
  const lang = document.documentElement.lang;
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  if (config.ga4 || config.ads) {
    gtag('js', new Date());
    if (config.ga4) gtag('config', config.ga4);
    if (config.ads) gtag('config', config.ads);
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(config.ga4 || config.ads)}`;
    document.head.append(script);
  }
  function track(event, label) {
    // No names, contact details or case information are sent to analytics.
    window.dataLayer.push({ event, language: lang });
    if (config.ga4) gtag('event', event, { send_to: config.ga4, language: lang });
    if (config.ads && label) gtag('event', 'conversion', { send_to: `${config.ads}/${label}` });
  }
  document.querySelectorAll('[data-call]').forEach(link => link.addEventListener('click', () => track('click_to_call', config.callLabel)));
  const form = document.querySelector('.form');
  if (!form || form.hidden) return;
  const status = document.querySelector('#form-status');
  const button = form.querySelector('button[type="submit"]');
  const buttonText = button.textContent;
  let pending = false;
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (button.disabled || pending || !form.reportValidity()) return;
    const phone = form.elements.phone;
    phone.setCustomValidity(phone.value.replace(/\D/g, '').length < 7 ? (lang === 'es' ? 'Ingrese un teléfono válido.' : 'Enter a valid phone number.') : '');
    if (!form.reportValidity()) return;
    pending = true; button.disabled = true;
    button.textContent = lang === 'es' ? 'Enviando…' : 'Sending…';
    form.setAttribute('aria-busy', 'true'); status.textContent = '';
    try {
      const response = await fetch(form.action, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(Object.fromEntries(new FormData(form))), signal: AbortSignal.timeout(15000) });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.message || '');
      status.textContent = result.message; status.dataset.state = 'success';
      form.hidden = true;
      track('generate_lead', config.formLabel);
    } catch (error) {
      status.dataset.state = 'error';
      status.textContent = lang === 'es' ? 'No se pudo confirmar su solicitud. Inténtelo de nuevo o llame al (503) 206-8414.' : 'Your request could not be confirmed. Please try again or call (503) 206-8414.';
    } finally {
      pending = false; button.disabled = false; button.textContent = buttonText;
      form.removeAttribute('aria-busy'); status.focus();
    }
  });
  form.elements.phone.addEventListener('input', () => form.elements.phone.setCustomValidity(''));
})();
