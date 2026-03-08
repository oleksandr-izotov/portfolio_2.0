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
  href: string;
  caseStudy?: boolean;
}

export const projects: Project[] = [
  {
    title: 'Corporate LMS Platform',
    category: 'React // Supabase',
    year: '2026',
    description: 'A scalable Learning Management System engineered for centralized educational processes. Features Role-Based Access Control (RBAC) and secure database architecture to automate administrative workflows and student onboarding.',
    image: blueprintImg,
    stack: ["React", "Supabase", "PostgreSQL", "TailwindCSS"],
    status: 'active',
    href: '/lms-case-study',
  },
  {
    title: 'AI-Powered EdTech SaaS',
    category: 'Python // LLM API',
    year: '2026',
    description: 'A production-ready SaaS platform integrating LLMs to automate content generation. Built with a high-performance asynchronous architecture (Celery/Redis) and a fully integrated Stripe billing system for subscription monetization.',
    image: coreLogicImg,
    stack: ["Python", "Django", "LLM APIs", "Redis", "Stripe"],
    status: 'active',
    href: '/ai-saas-case-study',
  },
  {
    title: 'Enterprise MedTech System',
    category: 'Java // Spring Boot 3',
    year: '2026',
    description: 'A complex B2B scheduling platform for surgical clinics. Engineered with a custom Real-Time State Machine to manage operating room timelines, preventing scheduling conflicts. Features a secure mTLS-protected API Gateway architecture and a dynamic Drag-and-Drop timeline UI.',
    image: nexusDbImg,
    stack: ["Java 25", "Spring Boot", "PostgreSQL", "Vue 3", "Redis"],
    status: 'active',
    href: '/medtech-case-study',
    caseStudy: true,
  },
];
