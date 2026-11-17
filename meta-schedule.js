(() => {
  const attributionKey = 'vw-meta-attribution';
  const journeyKey = 'vw-meta-journey';
  const destinations = { '/thank-you/': 'en', '/es/thank-you/': 'es', '/vsl/thank-you/': 'vsl' };
  const path = location.pathname.replace(/\/?$/, '/');
  const cookie = name => document.cookie.split('; ').find(v => v.startsWith(`${name}=`))?.slice(name.length + 1);
  const read = key => { try { return JSON.parse(sessionStorage.getItem(key)); } catch { return null; } };
  const write = (key, value) => { try { sessionStorage.setItem(key, JSON.stringify(value)); } catch { /* Tracking must not affect booking. */ } };
  const attribution = read(attributionKey) || {};
  const click = new URLSearchParams(location.search).get('fbclid');
  if (click && click.length <= 400 && click !== attribution.click) {
    attribution.click = click;
    attribution.fbc = `fb.1.${Date.now()}.${click}`;
  }
  attribution.fbc ||= cookie('_fbc');
  attribution.fbp = cookie('_fbp') || attribution.fbp;
  write(attributionKey, attribution);
  const post = async body => {
    const response = await fetch('/api/meta-schedule', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), keepalive: true });
    const result = await response.json();
    if (!response.ok || !result.ok) throw new Error('Tracking unavailable');
    return result;
  };
  // One event per document load; refreshes/new navigations are new page views.
  // Repeated inclusion of this script must not emit the same page view twice.
  try {
    if (!window.__vwMetaPageViewId) {
      window.__vwMetaPageViewId = crypto.randomUUID();
      post({ action: 'pageview', eventId: window.__vwMetaPageViewId,
        fbc: attribution.fbc, fbp: cookie('_fbp') || attribution.fbp })
        .catch(() => console.warn('Page view tracking could not be confirmed.'));
    }
  } catch { /* Measurement must never interrupt the booking flow. */ }
  let starting;
  async function start(flow) {
    if (starting) return starting;
    const existing = read(journeyKey);
    if (existing?.flow === flow && !existing.sent && Date.now() - existing.created < 86400000) return;
    starting = post({ action: 'start', flow, fbc: attribution.fbc, fbp: cookie('_fbp') || attribution.fbp })
      .then(result => write(journeyKey, { flow, ticket: result.ticket, created: Date.now(), sent: false }))
      .catch(() => console.warn('Booking tracking could not initialize.'))
      .finally(() => { starting = null; });
    return starting;
  }
  if (path === '/book/') start('en');
  if (path === '/es/book/') start('es');
  document.addEventListener('booking-calendar-opened', () => start('vsl'));
  const flow = destinations[path];
  if (flow) {
    const journey = read(journeyKey);
    if (!journey || journey.flow !== flow || journey.sent || Date.now() - journey.created >= 86400000) return;
    post({ action: 'complete', ticket: journey.ticket, path })
      .then(() => write(journeyKey, { ...journey, sent: true }))
      .catch(() => console.warn('Booking tracking delivery could not be confirmed.'));
  }
})();
