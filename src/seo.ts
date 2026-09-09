// Single source of truth for per-route metadata.
//
// Used twice: the prerender script reads it at build time to bake <title>,
// <meta> and JSON-LD into each static HTML file, and useRouteSeo() applies the
// same values on client-side navigation. Keeping one table avoids the classic
// drift where a crawler sees one title and a visitor another.

export const SITE_URL = 'https://izotov.dev';
export const OG_IMAGE = `${SITE_URL}/OGCard.webp`;

export interface RouteSeo {
  path: string;
  title: string;
  description: string;
  /** Absolute canonical URL. */
  canonical: string;
  /** Extra JSON-LD blocks injected for this route only. */
  jsonLd?: Record<string, unknown>[];
  /** Kept out of the sitemap when false (404 page). */
  indexable?: boolean;
}

const person = {
  '@type': 'Person',
  name: 'Oleksandr Izotov',
  url: SITE_URL,
};

function breadcrumb(name: string, path: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name, item: `${SITE_URL}${path}` },
    ],
  };
}

function caseStudy(name: string, path: string, description: string, keywords: string[]) {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name,
      description,
      url: `${SITE_URL}${path}`,
      author: person,
      keywords: keywords.join(', '),
      inLanguage: 'en',
    },
    breadcrumb(name, path),
  ];
}

export const routes: RouteSeo[] = [
  {
    path: '/',
    title: 'Oleksandr Izotov — Software Engineer in Stuttgart',
    description:
      'Oleksandr Izotov, Software Engineering student at the University of Stuttgart. Full-stack work in Java, Kotlin, TypeScript and Python — EdTech platforms, an AI SaaS and clinical scheduling software, each documented as a case study.',
    canonical: `${SITE_URL}/`,
  },
  {
    path: '/lms-case-study',
    title: 'cp-binom — EdTech Platform | Case Study',
    description:
      'Case study: a full-stack learning platform for a tutoring centre — Java 25 and Spring Boot, PostgreSQL, self-hosted MinIO, JWT role-based access and hybrid server-side rendering for SEO.',
    canonical: `${SITE_URL}/lms-case-study`,
    jsonLd: caseStudy(
      'cp-binom — EdTech Platform',
      '/lms-case-study',
      'Full-stack educational platform: Java 25, Spring Boot, PostgreSQL, MinIO, React.',
      ['Java', 'Spring Boot', 'PostgreSQL', 'MinIO', 'React', 'EdTech'],
    ),
  },
  {
    path: '/fortochka-case-study',
    title: 'Fortochka — Private VPN Infrastructure | Case Study',
    description:
      'Case study: a private VPN service built as a distributed system — an agent on every node behind a management-only tunnel, a separate control plane that stays out of the traffic path, and usage accounting that survives an interface restart.',
    canonical: `${SITE_URL}/fortochka-case-study`,
    jsonLd: caseStudy(
      'Fortochka — Private VPN Infrastructure',
      '/fortochka-case-study',
      'Private VPN service: Python, FastAPI, aiogram, AmneziaWG, distributed agent/control-plane architecture.',
      ['Python', 'FastAPI', 'aiogram', 'WireGuard', 'AmneziaWG', 'Distributed Systems', 'Infrastructure'],
    ),
  },
  {
    path: '/medtech-case-study',
    title: 'Kliniq — Operating-Room Scheduling | Case Study',
    description:
      'Case study: surgical operating-room scheduling in Kotlin and Spring Boot 3 — jOOQ over PostgreSQL with a database-level EXCLUDE constraint against double bookings, Server-Sent Events and WebAuthn passkeys.',
    canonical: `${SITE_URL}/medtech-case-study`,
    jsonLd: caseStudy(
      'Kliniq — Operating-Room Scheduling',
      '/medtech-case-study',
      'Surgical scheduling platform: Kotlin, Spring Boot 3, jOOQ, PostgreSQL, SvelteKit, passkeys.',
      ['Kotlin', 'Spring Boot', 'jOOQ', 'PostgreSQL', 'SvelteKit', 'WebAuthn', 'MedTech'],
    ),
  },
  {
    path: '/impressum',
    title: 'Impressum | Oleksandr Izotov',
    description: 'Anbieterkennzeichnung nach § 5 DDG für izotov.dev — Kontaktdaten und Verantwortlicher für den Inhalt.',
    canonical: `${SITE_URL}/impressum`,
  },
  {
    path: '/datenschutz',
    title: 'Datenschutzerklärung | Oleksandr Izotov',
    description:
      'Datenschutzerklärung für izotov.dev: welche Daten das Kontaktformular verarbeitet, welche Speicherung im Browser stattfindet und welche Rechte nach DSGVO bestehen.',
    canonical: `${SITE_URL}/datenschutz`,
  },
  {
    path: '/404',
    title: 'Page not found | Oleksandr Izotov',
    description: 'This page does not exist on izotov.dev.',
    canonical: `${SITE_URL}/404`,
    indexable: false,
  },
];

export function seoForPath(pathname: string): RouteSeo {
  const clean = pathname.replace(/\/+$/, '') || '/';
  return routes.find(r => r.path === clean) ?? routes[routes.length - 1];
}
