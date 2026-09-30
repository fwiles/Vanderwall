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
  document.addEventListener('instant-lead-confirmed', () => track('generate_lead', config.formLabel), { once: true });
  const hero = document.querySelector('.hero');
  const mobileCta = document.querySelector('.mobile-cta');
  if (hero && mobileCta) {
    const mobile = window.matchMedia('(max-width: 1023px)');
    const updateCta = () => {
      mobileCta.hidden = !mobile.matches || hero.getBoundingClientRect().bottom > 0;
    };
    new IntersectionObserver(updateCta, { threshold: 0 }).observe(hero);
    mobile.addEventListener('change', updateCta);
    window.addEventListener('pageshow', updateCta);
    updateCta();
  }
})();
