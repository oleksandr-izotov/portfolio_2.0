// Single source of truth for per-route metadata.
//
// Used twice: the prerender script reads it at build time to bake <title>,
// <meta> and JSON-LD into each static HTML file, and useRouteSeo() applies the
// same values on client-side navigation. Keeping one table avoids the classic
// drift where a crawler sees one title and a visitor another.

import { LANGUAGES, localizePath, type Language } from './i18n/paths';

export const SITE_URL = 'https://izotov.dev';
export const OG_IMAGE = `${SITE_URL}/OGCard.webp`;

export interface RouteSeo {
  path: string;
  lang: Language;
  title: string;
  description: string;
  /** Absolute canonical URL. */
  canonical: string;
  /** Absolute URL of the same page in every language — becomes hreflang links. */
  alternates?: Record<Language, string>;
  /** Extra JSON-LD blocks injected for this route only. */
  jsonLd?: Record<string, unknown>[];
  /** Kept out of the sitemap when false (404 page). */
  indexable?: boolean;
}

type Text = { title: string; description: string };

interface Page {
  /** Language-neutral path; German and Russian live under /de and /ru. */
  path: string;
  text: Record<Language, Text>;
  caseStudy?: { name: string; summary: string; keywords: string[] };
}

const HOME_LABEL: Record<Language, string> = { en: 'Home', de: 'Startseite', ru: 'Главная' };

const url = (path: string, lang: Language) => {
  const localized = localizePath(path, lang);
  return `${SITE_URL}${localized === '/' ? '/' : localized}`;
};

const person = {
  '@type': 'Person',
  name: 'Oleksandr Izotov',
  url: SITE_URL,
};

function caseStudy(page: Page, lang: Language) {
  const cs = page.caseStudy!;
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: cs.name,
      description: cs.summary,
      url: url(page.path, lang),
      author: person,
      keywords: cs.keywords.join(', '),
      inLanguage: lang,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: HOME_LABEL[lang], item: url('/', lang) },
        { '@type': 'ListItem', position: 2, name: cs.name, item: url(page.path, lang) },
      ],
    },
  ];
}

const pages: Page[] = [
  {
    path: '/',
    text: {
      en: {
        title: 'Oleksandr Izotov — Software Engineer in Stuttgart',
        description:
          'Oleksandr Izotov, mathematics student at the University of Stuttgart and Werkstudent in software engineering at RECARO Aircraft Seating. Full-stack work in Java, Kotlin, TypeScript and Python — an EdTech platform, a private VPN service and clinical scheduling software, each documented as a case study.',
      },
      de: {
        title: 'Oleksandr Izotov — Software Engineer in Stuttgart',
        description:
          'Oleksandr Izotov, Mathematikstudent an der Universität Stuttgart und Werkstudent in der Softwareentwicklung bei RECARO Aircraft Seating. Full-Stack-Projekte in Java, Kotlin, TypeScript und Python — eine EdTech-Plattform, ein privater VPN-Dienst und OP-Planungssoftware, jeweils als Fallstudie dokumentiert.',
      },
      ru: {
        title: 'Oleksandr Izotov — Software Engineer в Штутгарте',
        description:
          'Oleksandr Izotov, студент математики в Университете Штутгарта и Werkstudent по разработке ПО в RECARO Aircraft Seating. Full-stack проекты на Java, Kotlin, TypeScript и Python — образовательная платформа, частный VPN-сервис и планирование операционных, каждый с разбором.',
      },
    },
  },
  {
    path: '/lms-case-study',
    text: {
      en: {
        title: 'cp-binom — EdTech Platform | Case Study',
        description:
          'Case study: a full-stack learning platform for a tutoring centre — Java 21 and Spring Boot, PostgreSQL, self-hosted S3 storage on RustFS, JWT role-based access and hybrid server-side rendering for SEO.',
      },
      de: {
        title: 'cp-binom — EdTech-Plattform | Fallstudie',
        description:
          'Fallstudie: eine Full-Stack-Lernplattform für ein Nachhilfezentrum — Java 21 und Spring Boot, PostgreSQL, selbst gehosteter S3-Speicher auf RustFS, rollenbasierte Zugriffe per JWT und hybrides Server-Side-Rendering für SEO.',
      },
      ru: {
        title: 'cp-binom — образовательная платформа | Разбор проекта',
        description:
          'Разбор проекта: full-stack платформа для учебного центра — Java 21 и Spring Boot, PostgreSQL, собственное S3-хранилище на RustFS, доступ по ролям через JWT и гибридный серверный рендеринг для SEO.',
      },
    },
    caseStudy: {
      name: 'cp-binom — EdTech Platform',
      summary: 'Full-stack educational platform: Java 21, Spring Boot, PostgreSQL, RustFS, React.',
      keywords: ['Java', 'Spring Boot', 'PostgreSQL', 'RustFS', 'React', 'EdTech'],
    },
  },
  {
    path: '/fortochka-case-study',
    text: {
      en: {
        title: 'Fortochka — Private VPN Infrastructure | Case Study',
        description:
          'Case study: a private VPN service built as a distributed system — an agent on every node behind a management-only tunnel, a separate control plane that stays out of the traffic path, and usage accounting that survives an interface restart.',
      },
      de: {
        title: 'Fortochka — private VPN-Infrastruktur | Fallstudie',
        description:
          'Fallstudie: ein privater VPN-Dienst als verteiltes System — ein Agent auf jedem Knoten hinter einem reinen Management-Tunnel, eine getrennte Control Plane außerhalb des Datenpfads und eine Verbrauchserfassung, die einen Neustart des Interfaces übersteht.',
      },
      ru: {
        title: 'Форточка — инфраструктура частного VPN | Разбор проекта',
        description:
          'Разбор проекта: частный VPN-сервис как распределённая система — агент на каждом узле за служебным туннелем, отдельный control plane вне пути трафика и учёт трафика, переживающий перезапуск интерфейса.',
      },
    },
    caseStudy: {
      name: 'Fortochka — Private VPN Infrastructure',
      summary: 'Private VPN service: Python, FastAPI, aiogram, AmneziaWG, distributed agent/control-plane architecture.',
      keywords: ['Python', 'FastAPI', 'aiogram', 'WireGuard', 'AmneziaWG', 'Distributed Systems', 'Infrastructure'],
    },
  },
  {
    path: '/medtech-case-study',
    text: {
      en: {
        title: 'Kliniq — Operating-Room Scheduling | Case Study',
        description:
          'Case study: surgical operating-room scheduling in Kotlin and Spring Boot 3 — jOOQ over PostgreSQL with a database-level EXCLUDE constraint against double bookings, Server-Sent Events and WebAuthn passkeys.',
      },
      de: {
        title: 'Kliniq — OP-Saal-Planung | Fallstudie',
        description:
          'Fallstudie: OP-Saal-Planung in Kotlin und Spring Boot 3 — jOOQ über PostgreSQL mit einem EXCLUDE-Constraint auf Datenbankebene gegen Doppelbuchungen, Server-Sent Events und WebAuthn-Passkeys.',
      },
      ru: {
        title: 'Kliniq — планирование операционных | Разбор проекта',
        description:
          'Разбор проекта: планирование операционных на Kotlin и Spring Boot 3 — jOOQ поверх PostgreSQL с EXCLUDE-ограничением в базе против двойных броней, Server-Sent Events и вход по passkey (WebAuthn).',
      },
    },
    caseStudy: {
      name: 'Kliniq — Operating-Room Scheduling',
      summary: 'Surgical scheduling platform: Kotlin, Spring Boot 3, jOOQ, PostgreSQL, SvelteKit, passkeys.',
      keywords: ['Kotlin', 'Spring Boot', 'jOOQ', 'PostgreSQL', 'SvelteKit', 'WebAuthn', 'MedTech'],
    },
  },
  {
    path: '/impressum',
    text: {
      en: {
        title: 'Imprint | Oleksandr Izotov',
        description: 'Legal notice under § 5 DDG for izotov.dev — contact details and the person responsible for the content.',
      },
      de: {
        title: 'Impressum | Oleksandr Izotov',
        description: 'Anbieterkennzeichnung nach § 5 DDG für izotov.dev — Kontaktdaten und Verantwortlicher für den Inhalt.',
      },
      ru: {
        title: 'Импрессум | Oleksandr Izotov',
        description: 'Сведения о владельце izotov.dev по § 5 DDG — контакты и ответственный за содержание.',
      },
    },
  },
  {
    path: '/datenschutz',
    text: {
      en: {
        title: 'Privacy Policy | Oleksandr Izotov',
        description:
          'Privacy policy for izotov.dev: what data the contact form processes, what is stored in the browser and which rights apply under the GDPR.',
      },
      de: {
        title: 'Datenschutzerklärung | Oleksandr Izotov',
        description:
          'Datenschutzerklärung für izotov.dev: welche Daten das Kontaktformular verarbeitet, welche Speicherung im Browser stattfindet und welche Rechte nach DSGVO bestehen.',
      },
      ru: {
        title: 'Политика конфиденциальности | Oleksandr Izotov',
        description:
          'Политика конфиденциальности izotov.dev: какие данные обрабатывает форма обратной связи, что хранится в браузере и какие права дают GDPR.',
      },
    },
  },
];

const notFound: RouteSeo = {
  path: '/404',
  lang: 'en',
  title: 'Page not found | Oleksandr Izotov',
  description: 'This page does not exist on izotov.dev.',
  canonical: `${SITE_URL}/404`,
  indexable: false,
};

export const routes: RouteSeo[] = [
  ...pages.flatMap(page =>
    LANGUAGES.map((lang): RouteSeo => ({
      path: localizePath(page.path, lang),
      lang,
      ...page.text[lang],
      canonical: url(page.path, lang),
      alternates: Object.fromEntries(LANGUAGES.map(l => [l, url(page.path, l)])) as Record<Language, string>,
      jsonLd: page.caseStudy ? caseStudy(page, lang) : undefined,
    })),
  ),
  notFound,
];

export function seoForPath(pathname: string): RouteSeo {
  const clean = pathname.replace(/\/+$/, '') || '/';
  return routes.find(r => r.path === clean) ?? notFound;
}
