import blueprintImg from '../assets/blueprint-engine.webp';
import coreLogicImg from '../assets/core-logic.webp';
import nexusDbImg from '../assets/nexus-db.webp';

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
  caseStudyId?: 'medtech' | 'ai-saas' | 'lms';
}

export const projects: Project[] = [
  {
    title: 'cp-binom — EdTech Platform',
    category: 'Java // Spring Boot 3',
    year: '2026',
    description: 'A full-stack educational platform built from scratch for a tutoring center serving 200+ students. Custom Java backend with JWT-based RBAC, self-hosted MinIO object storage, and hybrid SSR for SEO. Replaces fragmented manual coordination with a unified system for scheduling, course materials, testing, and parent-teacher communication.',
    image: blueprintImg,
    stack: ["Java 25", "Spring Boot", "React", "PostgreSQL", "MinIO"],
    status: 'active',
    liveUrl: 'https://cp-binom.ru',
    href: '/lms-case-study',
    caseStudy: true,
    caseStudyId: 'lms',
  },
  {
    title: 'AI-Powered EdTech SaaS',
    category: 'Django // LLM',
    year: '2026',
    description: 'A subscription AI tutor: one topic in, four structured sections out — explanation, summary, study plan, self-check quiz — generated in five languages. Server-rendered Django + HTMX with a Celery/Redis pipeline streaming sections live to the UI, a Gemini → Qwen LLM fallback chain, and four-tier Stripe billing with usage-quota enforcement.',
    image: coreLogicImg,
    stack: ["Django", "HTMX", "Celery", "Redis", "Stripe"],
    status: 'development',
    href: '/ai-saas-case-study',
    caseStudy: true,
    caseStudyId: 'ai-saas',
  },
  {
    title: 'Kliniq — OR Scheduling',
    category: 'Kotlin // Spring Boot 3',
    year: '2026',
    description: 'A surgical operating-room scheduling platform, built solo from scratch. A Kotlin/Spring Boot 3 backend with jOOQ over PostgreSQL makes double-bookings impossible at the database via an EXCLUDE constraint, with real-time updates over Server-Sent Events, drag-and-drop reschedule, and self-hosted auth using WebAuthn passkeys. SvelteKit frontend, deployed on Hetzner.',
    image: nexusDbImg,
    stack: ["Kotlin", "Spring Boot", "SvelteKit", "PostgreSQL", "Passkeys"],
    status: 'development',
    href: '/medtech-case-study',
    caseStudy: true,
    caseStudyId: 'medtech',
  },
];
