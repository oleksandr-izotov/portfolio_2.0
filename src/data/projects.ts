import cpBinomImg from '../assets/project-cp-binom.webp';
import fortochkaImg from '../assets/project-fortochka.webp';
import kliniqImg from '../assets/project-kliniq.webp';

export interface Project {
  title: string;
  category: string;
  year: string;
  description: string;
  image: string;
  stack: string[];
  status?: 'active' | 'development';
  /** Public demo. Absent while a project is in development. */
  liveUrl?: string;
  href: string;
  caseStudy?: boolean;
  caseStudyId?: 'medtech' | 'fortochka' | 'lms';
}

export const projects: Project[] = [
  {
    title: 'cp-binom — EdTech Platform',
    category: 'Java // Spring Boot 3',
    year: '2026',
    description: 'A full-stack educational platform built from scratch for a tutoring center serving 200+ students. Custom Java backend with JWT-based RBAC, self-hosted MinIO object storage, and hybrid SSR for SEO. Replaces fragmented manual coordination with a unified system for scheduling, course materials, testing, and parent-teacher communication.',
    image: cpBinomImg,
    stack: ["Java 21", "Spring Boot 3.5", "React 18", "PostgreSQL 16", "MinIO"],
    status: 'active',
    liveUrl: 'https://cp-binom.ru',
    href: '/lms-case-study',
    caseStudy: true,
    caseStudyId: 'lms',
  },
  {
    title: 'Kliniq — OR Scheduling',
    category: 'Kotlin // Spring Boot 3',
    year: '2026',
    description: 'A surgical operating-room scheduling platform, built solo from scratch. A Kotlin/Spring Boot 3 backend with jOOQ over PostgreSQL makes double-bookings impossible at the database via an EXCLUDE constraint, with real-time updates over Server-Sent Events, drag-and-drop reschedule, and self-hosted auth using WebAuthn passkeys. SvelteKit frontend, deployed on Hetzner.',
    image: kliniqImg,
    stack: ["Kotlin 2.1", "Spring Boot 3.5", "SvelteKit 2", "PostgreSQL 16", "Passkeys"],
    status: 'active',
    liveUrl: 'https://kliniq.izotov.dev',
    href: '/medtech-case-study',
    caseStudy: true,
    caseStudyId: 'medtech',
  },
  {
    title: 'Форточка — Private VPN',
    category: 'Python // Distributed',
    year: '2026',
    description: 'A private VPN service built as a distributed system rather than a box with WireGuard on it.',
    image: fortochkaImg,
    stack: ["Python 3.12", "FastAPI", "aiogram 3", "AmneziaWG", "Next.js 16"],
    status: 'active',
    liveUrl: 'https://fortochka.me',
    href: '/fortochka-case-study',
    caseStudy: true,
    caseStudyId: 'fortochka',
  },
];
