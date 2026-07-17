const MOCK_URL = './data/mock-content.json';
const HEADLESS_CONFIG_URL = './data/headless-config.json';

const icons = {
  association: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M8 39V19l16-9 16 9v20H8Zm7-4h6v-8h6v8h6V22l-9-5-9 5v13Z" fill="currentColor"/></svg>',
  clubs: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 24a7 7 0 1 0 0-14 7 7 0 0 0 0 14Zm-13 2a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm26 0a6 6 0 1 0 0-12 6 6 0 0 0 0 12ZM4 40c0-7 5-11 12-11 2 0 4 .4 5.5 1.2C18.7 32.5 17 35.8 17 40H4Zm40 0H31c0-4.2-1.7-7.5-4.5-9.8A13 13 0 0 1 32 29c7 0 12 4 12 11Zm-23 0c0-8 6-13 13-13s13 5 13 13H21Z" fill="currentColor" transform="translate(-10)"/></svg>',
  members: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 24a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm-15 17c0-9 6-14 15-14s15 5 15 14H9Zm31-24h4v12h-4V17Zm-4 4h12v4H36v-4Z" fill="currentColor"/></svg>',
  users: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M18 23a7 7 0 1 0 0-14 7 7 0 0 0 0 14Zm12 1a6 6 0 1 0 0-12 6 6 0 0 0 0 12ZM5 41c0-9 5-15 13-15s13 6 13 15H5Zm25 0c0-5-1.5-9-4.5-12 1.4-.7 3-1 4.5-1 8 0 13 5 13 13H30Z" fill="currentColor"/></svg>',
  calendar: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M12 6h4v6h16V6h4v6h6v30H6V12h6V6Zm26 16H10v16h28V22Zm-28-6v2h28v-2H10Z" fill="currentColor"/></svg>',
  payment: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M6 10h36v28H6V10Zm4 8h28v-4H10v4Zm0 16h28V22H10v12Zm4-8h10v4H14v-4Z" fill="currentColor"/></svg>'
};

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function safeInlineHtml(value = '') {
  const template = document.createElement('template');
  template.innerHTML = value;
  template.content.querySelectorAll('script,style,iframe,object,embed,form,svg').forEach((node) => node.remove());
  template.content.querySelectorAll('*').forEach((node) => {
    [...node.attributes].forEach((attribute) => {
      if (attribute.name.startsWith('on') || ['style', 'srcdoc'].includes(attribute.name)) {
        node.removeAttribute(attribute.name);
      }
    });
  });
  return template.innerHTML;
}

async function loadMockPage() {
  const response = await fetch(MOCK_URL);
  if (!response.ok) throw new Error(`Unable to load ${MOCK_URL}`);
  return response.json();
}

async function loadHeadlessConfig() {
  const response = await fetch(HEADLESS_CONFIG_URL);
  if (!response.ok) throw new Error(`Unable to load ${HEADLESS_CONFIG_URL}`);
  return response.json();
}

async function loadPageData() {
  const mode = new URLSearchParams(window.location.search).get('source') ?? 'mock';
  const [mock, headlessConfig] = await Promise.all([loadMockPage(), loadHeadlessConfig()]);

  // The static prototype intentionally renders normalized mock data.
  // Replace this branch with Promise.all calls to the endpoints in headless-config.json,
  // then map Liferay contentFields into the same normalized shape.
  if (mode === 'headless') {
    console.warn('Headless mode is a contract stub. Falling back to mock JSON.', headlessConfig);
  }

  window.NexcentStatic = {headlessConfig, mode: 'mock'};
  return mock;
}

function renderNavigation(data) {
  const target = document.querySelector('[data-navigation]');
  target.innerHTML = data.navigation.map((item) => `<li><a href="${escapeHtml(item.url)}">${escapeHtml(item.label)}</a></li>`).join('');
}

function renderHero(hero) {
  return `
    <div class="container hero-grid">
      <div class="hero-copy">
        <span class="eyebrow">${escapeHtml(hero.eyebrow)}</span>
        <h1>${escapeHtml(hero.title)} <span>${escapeHtml(hero.highlightedText)}</span></h1>
        <p>${escapeHtml(hero.description)}</p>
        <a class="button" href="${escapeHtml(hero.cta.url)}">${escapeHtml(hero.cta.label)}</a>
      </div>
      <div class="hero-art">
        <img src="${escapeHtml(hero.image.url)}" alt="${escapeHtml(hero.image.alt)}" width="640" height="480" />
      </div>
    </div>`;
}

function clientLogo(client) {
  return `<div class="client-logo" title="${escapeHtml(client.name)}">
    <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 4 42 14v20L24 44 6 34V14L24 4Zm0 7-11 6v14l11 6 11-6V17l-11-6Zm0 6 7 4v8l-7 4-7-4v-8l7-4Z" fill="currentColor"/></svg>
    <span>${escapeHtml(client.shortName)}</span>
  </div>`;
}

function renderClients(section) {
  return `<div class="container">
    <div class="section-heading"><h2>${escapeHtml(section.title)}</h2><p>${escapeHtml(section.description)}</p></div>
    <div class="logo-row">${section.items.map(clientLogo).join('')}</div>
  </div>`;
}

function renderServices(section) {
  return `<div class="container">
    <div class="section-heading"><h2>${escapeHtml(section.title)}</h2><p>${escapeHtml(section.description)}</p></div>
    <div class="service-grid">${section.items.map((item) => `
      <article class="service-card">
        <div class="service-icon">${icons[item.icon] ?? icons.members}</div>
        <h3>${escapeHtml(item.title)}</h3>
        <div>${safeInlineHtml(item.descriptionHtml)}</div>
      </article>`).join('')}</div>
  </div>`;
}

function renderFeatures(items) {
  return items.map((item) => `
    <section class="feature-section" data-position="${escapeHtml(item.imagePosition)}">
      <div class="container feature-grid">
        <div class="feature-art"><img src="${escapeHtml(item.image.url)}" alt="${escapeHtml(item.image.alt)}" width="560" height="420" /></div>
        <div class="feature-copy">
          <span class="eyebrow">${escapeHtml(item.eyebrow)}</span>
          <h2>${escapeHtml(item.title)}</h2>
          <div>${safeInlineHtml(item.descriptionHtml)}</div>
          <a class="button" href="${escapeHtml(item.cta.url)}">${escapeHtml(item.cta.label)}</a>
        </div>
      </div>
    </section>`).join('');
}

function renderStatistics(section) {
  return `<div class="container stats-grid">
    <div class="stats-copy"><span class="eyebrow">${escapeHtml(section.eyebrow)}</span><h2>${escapeHtml(section.title)} <span>${escapeHtml(section.highlightedText)}</span></h2><p>${escapeHtml(section.description)}</p></div>
    <div class="stat-list">${section.items.map((item) => `
      <div class="stat-item">
        <div class="stat-icon">${icons[item.icon] ?? icons.users}</div>
        <div><strong class="stat-value">${escapeHtml(item.value)}</strong><span class="stat-label">${escapeHtml(item.label)}</span></div>
      </div>`).join('')}</div>
  </div>`;
}

function renderTestimonial(section) {
  return `<div class="container testimonial-grid">
    <div class="testimonial-portrait"><span>${escapeHtml(section.person.initials)}</span></div>
    <div class="testimonial-copy">
      <blockquote>“${escapeHtml(section.quote)}”</blockquote>
      <p class="testimonial-name">${escapeHtml(section.person.name)}</p>
      <p class="testimonial-role">${escapeHtml(section.person.role)}</p>
      <div class="logo-strip">${section.clientShortNames.map((name) => `<span>${escapeHtml(name)}</span>`).join('')}<a href="${escapeHtml(section.link.url)}">${escapeHtml(section.link.label)} →</a></div>
    </div>
  </div>`;
}

function renderCommunity(section) {
  return `<div class="container">
    <div class="section-heading"><h2>${escapeHtml(section.title)}</h2><p>${escapeHtml(section.description)}</p></div>
    <div class="community-grid">${section.items.map((item) => `
      <article class="community-card" style="--art-a:${escapeHtml(item.colors[0])};--art-b:${escapeHtml(item.colors[1])}">
        <div class="community-art"><span>${escapeHtml(item.artLabel)}</span></div>
        <div class="community-card-content"><h3>${escapeHtml(item.title)}</h3><a class="read-more" href="${escapeHtml(item.url)}">Read more →</a></div>
      </article>`).join('')}</div>
  </div>`;
}

function renderCta(section) {
  return `<div class="container"><h2>${escapeHtml(section.title)}</h2><a class="button" href="${escapeHtml(section.cta.url)}">${escapeHtml(section.cta.label)} →</a></div>`;
}

function renderFooter(section) {
  const list = (items) => items.map((item) => `<li><a href="${escapeHtml(item.url)}">${escapeHtml(item.label)}</a></li>`).join('');
  return `<div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <a class="brand" href="#home"><svg class="brand-mark" viewBox="0 0 36 28" aria-hidden="true"><path d="M3 14 12 3l7 8 6-7 8 10-8 11-7-8-6 7L3 14Z" fill="currentColor"/></svg><span>Nexcent</span></a>
        <p>${escapeHtml(section.copyright)}<br />${escapeHtml(section.rights)}</p>
        <div class="socials">${section.socials.map((item) => `<a href="${escapeHtml(item.url)}" aria-label="${escapeHtml(item.label)}">${escapeHtml(item.shortLabel)}</a>`).join('')}</div>
      </div>
      <nav class="footer-column" aria-label="Company links"><h2>Company</h2><ul>${list(section.companyLinks)}</ul></nav>
      <nav class="footer-column" aria-label="Support links"><h2>Support</h2><ul>${list(section.supportLinks)}</ul></nav>
      <div class="footer-column"><h2>${escapeHtml(section.newsletter.title)}</h2>
        <form class="newsletter-form" data-newsletter-form><label class="sr-only" for="newsletter-email">${escapeHtml(section.newsletter.placeholder)}</label><input id="newsletter-email" type="email" required placeholder="${escapeHtml(section.newsletter.placeholder)}" /><button type="submit" aria-label="Subscribe">➤</button></form>
        <p class="form-message" data-form-message aria-live="polite"></p>
      </div>
    </div>
    <div class="footer-bottom">Static prototype • Mock data adapter ready for Liferay Headless Delivery API</div>
  </div>`;
}

function showLoading() {
  const template = document.querySelector('#loading-template');
  document.querySelectorAll('[aria-busy="true"]').forEach((section) => section.append(template.content.cloneNode(true)));
}

function setSection(name, html) {
  const section = document.querySelector(`[data-section="${name}"]`);
  if (!section) return;
  section.innerHTML = html;
  section.setAttribute('aria-busy', 'false');
}

function setupInteractions() {
  const header = document.querySelector('[data-header]');
  const nav = document.querySelector('[data-nav]');
  const toggle = document.querySelector('[data-nav-toggle]');

  const closeNav = () => {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeNav();
  });
  window.addEventListener('scroll', () => header.classList.toggle('is-scrolled', window.scrollY > 10), {passive: true});

  const form = document.querySelector('[data-newsletter-form]');
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    const input = form.querySelector('input');
    const message = document.querySelector('[data-form-message]');
    message.textContent = `Thanks! ${input.value} was stored in the mock newsletter flow.`;
    form.reset();
  });
}

async function bootstrap() {
  showLoading();
  try {
    const page = await loadPageData();
    renderNavigation(page.site);
    setSection('hero', renderHero(page.hero));
    setSection('clients', renderClients(page.clients));
    setSection('services', renderServices(page.services));
    setSection('features', renderFeatures(page.features));
    setSection('statistics', renderStatistics(page.statistics));
    setSection('testimonial', renderTestimonial(page.testimonial));
    setSection('community', renderCommunity(page.community));
    setSection('cta', renderCta(page.cta));
    setSection('footer', renderFooter(page.footer));
    setupInteractions();
  } catch (error) {
    console.error(error);
    document.querySelector('main').innerHTML = `<section class="section"><div class="container"><h1>Unable to load the landing page</h1><p>${escapeHtml(error.message)}</p></div></section>`;
  }
}

bootstrap();
