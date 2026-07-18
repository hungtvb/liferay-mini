const DEFAULT_PAGE_SIZE = 200;

function normalizeBaseUrl(value) {
  return String(value || '').replace(/\/$/, '');
}

function fieldMap(content) {
  const result = new Map();

  const visit = (fields = []) => {
    for (const field of fields) {
      if (field?.name && field.contentFieldValue) {
        result.set(field.name, field.contentFieldValue);
      }

      if (field?.nestedContentFields?.length) {
        visit(field.nestedContentFields);
      }
    }
  };

  visit(content?.contentFields);
  return result;
}

function readText(fields, name, fallback = '') {
  const value = fields.get(name)?.data;
  return value === null || value === undefined ? fallback : String(value).trim();
}

function readNumber(fields, name, fallback = 0) {
  const value = Number(fields.get(name)?.data);
  return Number.isFinite(value) ? value : fallback;
}

function readBoolean(fields, name, fallback = true) {
  const value = fields.get(name)?.data;

  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value.toLowerCase() !== 'false';
  return fallback;
}

function resolveUrl(baseUrl, value) {
  if (!value) return '';

  try {
    return new URL(value, `${normalizeBaseUrl(baseUrl)}/`).toString();
  } catch {
    return value;
  }
}

function readMedia(fields, name, baseUrl) {
  const field = fields.get(name) ?? {};
  const media = field.image ?? field.document ?? {};

  return {
    alt: media.description ?? media.title ?? '',
    url: resolveUrl(baseUrl, media.contentUrl ?? ''),
  };
}

function sortActive(contents) {
  return [...contents]
    .filter((content) => readBoolean(fieldMap(content), 'active', true))
    .sort(
      (left, right) =>
        readNumber(fieldMap(left), 'sortOrder') -
        readNumber(fieldMap(right), 'sortOrder')
    );
}

function requireFirst(contents, label) {
  const item = contents[0];

  if (!item) {
    throw new Error(`No published content is available for ${label}.`);
  }

  return item;
}

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function paragraph(value) {
  return value ? `<p>${escapeHtml(value)}</p>` : '';
}

function initials(value) {
  return String(value)
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

function itemCode(item) {
  return item.externalReferenceCode ?? String(item.id ?? '');
}

export function normalizeHeadlessPage({baseUrl, fallback, locale = 'en-US', records}) {
  const heroItem = requireFirst(sortActive(records.hero), 'NXC Landing Hero');
  const heroFields = fieldMap(heroItem);
  const heroImage = readMedia(heroFields, 'illustration', baseUrl);
  const clientsIntroFields = fieldMap(records.clientsIntro[0]);
  const clients = sortActive(records.clients).map((item) => {
    const fields = fieldMap(item);
    const name = readText(fields, 'name', item.title ?? 'Client');

    return {
      externalReferenceCode: itemCode(item),
      logo: {
        ...readMedia(fields, 'logo', baseUrl),
        alt: readText(fields, 'logoAlt'),
      },
      name,
      shortName: name.split(/\s+/)[0],
      websiteUrl: readText(fields, 'websiteUrl'),
    };
  });
  const servicesIntroFields = fieldMap(requireFirst(records.servicesIntro, 'NXC Services Intro'));
  const services = sortActive(records.services).map((item) => {
    const fields = fieldMap(item);

    return {
      descriptionHtml: paragraph(
        readText(fields, 'description', readText(fields, 'descriptionHtml'))
      ),
      externalReferenceCode: itemCode(item),
      iconImage: {
        ...readMedia(fields, 'icon', baseUrl),
        alt: readText(fields, 'iconAlt'),
      },
      link: {
        label: readText(fields, 'linkLabel'),
        url: readText(fields, 'linkUrl', readText(fields, 'targetUrl')),
      },
      title: readText(fields, 'title', item.title ?? ''),
    };
  });
  const features = sortActive(records.features).map((item) => {
    const fields = fieldMap(item);
    const rawBackground = readText(fields, 'backgroundVariant');

    return {
      backgroundVariant:
        rawBackground === 'silver' || rawBackground === 'muted'
          ? 'muted'
          : 'default',
      cta: {
        label: readText(fields, 'ctaLabel'),
        url: readText(fields, 'ctaUrl'),
      },
      descriptionHtml: readText(
        fields,
        'descriptionHTML',
        readText(fields, 'descriptionHtml')
      ),
      externalReferenceCode: itemCode(item),
      image: {
        ...readMedia(fields, 'image', baseUrl),
        alt: readText(fields, 'imageAlt'),
      },
      imagePosition: readText(fields, 'imagePosition') === 'right' ? 'right' : 'left',
      title: readText(fields, 'title', item.title ?? ''),
    };
  });
  const statisticsIntroFields = fieldMap(
    requireFirst(records.statisticsIntro, 'NXC Statistics Intro')
  );
  const statistics = sortActive(records.statistics).map((item) => {
    const fields = fieldMap(item);
    const value = readNumber(fields, 'value');
    const suffix = readText(fields, 'valueSuffix');

    return {
      externalReferenceCode: itemCode(item),
      iconImage: {
        ...readMedia(fields, 'icon', baseUrl),
        alt: readText(fields, 'iconAlt'),
      },
      label: readText(fields, 'label', item.title ?? ''),
      value: `${new Intl.NumberFormat(locale).format(value)}${suffix}`,
    };
  });
  const testimonialItem = requireFirst(
    sortActive(records.testimonials),
    'NXC Testimonial'
  );
  const testimonialFields = fieldMap(testimonialItem);
  const customerName = readText(
    testimonialFields,
    'customerName',
    testimonialItem.title ?? ''
  );
  const communityIntroFields = fieldMap(
    requireFirst(records.communityIntro, 'NXC Community Intro')
  );
  const community = sortActive(records.communityCards).map((item, index) => {
    const fields = fieldMap(item);

    return {
      artLabel: String(index + 1).padStart(2, '0'),
      colors: ['#7CB982', '#2F6F4E'],
      externalReferenceCode: itemCode(item),
      publishedDate: readText(fields, 'publishedDate'),
      summary: readText(fields, 'summary'),
      thumbnail: {
        ...readMedia(fields, 'thumbnail', baseUrl),
        alt: readText(fields, 'thumbnailAlt'),
      },
      title: readText(fields, 'title', item.title ?? ''),
      url: readText(fields, 'targetUrl'),
    };
  });
  const ctaItem = requireFirst(
    records.cta.filter((item) => readBoolean(fieldMap(item), 'active', true)),
    'NXC CTA'
  );
  const ctaFields = fieldMap(ctaItem);

  return {
    ...fallback,
    hero: {
      cta: {
        label: readText(heroFields, 'ctaLabel'),
        target: readText(heroFields, 'ctaTarget') === '_blank' ? '_blank' : '_self',
        url: readText(heroFields, 'ctaUrl'),
      },
      description: readText(heroFields, 'description'),
      externalReferenceCode: itemCode(heroItem),
      eyebrow: fallback.hero?.eyebrow ?? 'Community platform',
      highlightedText: readText(heroFields, 'highlightedText'),
      image: {
        ...heroImage,
        alt: readText(heroFields, 'illustrationAlt', heroImage.alt),
      },
      title: readText(heroFields, 'title', heroItem.title ?? ''),
    },
    clients: {
      description: readText(
        clientsIntroFields,
        'description',
        fallback.clients?.description ?? ''
      ),
      items: clients,
      title: readText(
        clientsIntroFields,
        'heading',
        fallback.clients?.title ?? 'Our Clients'
      ),
    },
    services: {
      description: readText(servicesIntroFields, 'description'),
      externalReferenceCode: itemCode(records.servicesIntro[0]),
      items: services,
      title: readText(
        servicesIntroFields,
        'heading',
        readText(servicesIntroFields, 'title')
      ),
    },
    features,
    statistics: {
      description: readText(statisticsIntroFields, 'description'),
      eyebrow: fallback.statistics?.eyebrow ?? 'Measured impact',
      externalReferenceCode: itemCode(records.statisticsIntro[0]),
      highlightedText: readText(statisticsIntroFields, 'highlightedText'),
      items: statistics,
      title: readText(statisticsIntroFields, 'heading'),
    },
    testimonial: {
      clientShortNames: clients.slice(0, 6).map((item) => item.shortName),
      externalReferenceCode: itemCode(testimonialItem),
      image: {
        ...readMedia(testimonialFields, 'customerImage', baseUrl),
        alt: readText(testimonialFields, 'customerImageAlt'),
      },
      link: {
        label: readText(testimonialFields, 'ctaLabel'),
        url: readText(testimonialFields, 'ctaUrl'),
      },
      person: {
        initials: initials(customerName),
        name: customerName,
        role: [
          readText(testimonialFields, 'customerRole'),
          readText(testimonialFields, 'customerCompany'),
        ]
          .filter(Boolean)
          .join(', '),
      },
      quote: readText(testimonialFields, 'quote'),
    },
    community: {
      description: readText(communityIntroFields, 'description'),
      externalReferenceCode: itemCode(records.communityIntro[0]),
      items: community,
      title: readText(communityIntroFields, 'heading'),
    },
    cta: {
      backgroundVariant: readText(ctaFields, 'backgroundVariant'),
      cta: {
        label: readText(ctaFields, 'ctaLabel'),
        target: readText(ctaFields, 'ctaTarget') === '_blank' ? '_blank' : '_self',
        url: readText(ctaFields, 'ctaUrl'),
      },
      externalReferenceCode: itemCode(ctaItem),
      title: readText(ctaFields, 'heading', ctaItem.title ?? ''),
    },
  };
}

async function fetchJson(fetchImpl, url) {
  const response = await fetchImpl(url, {
    credentials: 'include',
    headers: {Accept: 'application/json'},
  });

  if (!response.ok) {
    throw new Error(`Liferay Headless request failed (${response.status}) for ${url}`);
  }

  return response.json();
}

export async function loadHeadlessPage({
  baseUrl,
  config,
  fallback,
  fetchImpl = fetch,
  locale = 'en-US',
  siteId,
}) {
  const normalizedBaseUrl = normalizeBaseUrl(baseUrl);

  if (!normalizedBaseUrl || !siteId) {
    throw new Error(
      'Headless mode requires both liferayBaseURL and siteId query parameters.'
    );
  }

  const apiBase = `${normalizedBaseUrl}${config.basePath}`;
  const structurePage = await fetchJson(
    fetchImpl,
    `${apiBase}/sites/${encodeURIComponent(siteId)}/content-structures?pageSize=${DEFAULT_PAGE_SIZE}`
  );
  const structureByIdentifier = new Map();

  for (const structure of structurePage.items ?? []) {
    for (const identifier of [structure.name, structure.externalReferenceCode]) {
      if (identifier) {
        structureByIdentifier.set(String(identifier).trim().toLowerCase(), structure);
      }
    }
  }

  const getContents = async (identifier, {optional = false} = {}) => {
    const structure = structureByIdentifier.get(
      String(identifier || '').trim().toLowerCase()
    );

    if (!structure?.id) {
      if (optional) return [];
      throw new Error(`Content Structure not found: ${identifier}`);
    }

    const page = await fetchJson(
      fetchImpl,
      `${apiBase}/content-structures/${structure.id}/structured-contents?flatten=true&pageSize=${DEFAULT_PAGE_SIZE}`
    );

    return page.items ?? [];
  };

  const sections = config.sections;
  const [
    hero,
    clientsIntro,
    clients,
    servicesIntro,
    services,
    features,
    statisticsIntro,
    statistics,
    testimonials,
    communityIntro,
    communityCards,
    cta,
  ] = await Promise.all([
    getContents(sections.hero.structureIdentifier),
    getContents(sections.clients.introStructureIdentifier, {optional: true}),
    getContents(sections.clients.structureIdentifier),
    getContents(sections.services.introStructureIdentifier),
    getContents(sections.services.itemStructureIdentifier),
    getContents(sections.features.structureIdentifier),
    getContents(sections.statistics.introStructureIdentifier),
    getContents(sections.statistics.itemStructureIdentifier),
    getContents(sections.testimonial.structureIdentifier),
    getContents(sections.community.introStructureIdentifier),
    getContents(sections.community.itemStructureIdentifier),
    getContents(sections.cta.structureIdentifier),
  ]);

  return normalizeHeadlessPage({
    baseUrl: normalizedBaseUrl,
    fallback,
    locale,
    records: {
      clients,
      clientsIntro,
      communityCards,
      communityIntro,
      cta,
      features,
      hero,
      services,
      servicesIntro,
      statistics,
      statisticsIntro,
      testimonials,
    },
  });
}
