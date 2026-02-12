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
  link?: string;
}

export const projects: Project[] = [
  {
    title: 'Developer Portfolio',
    category: 'Web Architecture',
    year: '2026',
    description: 'A high-performance, dark-themed personal platform built with modern web technologies. Features a custom Dockerized environment, CI/CD pipelines via Vercel, and a premium architectural aesthetic inspired by blueprints.',
    image: blueprintImg,
    stack: ["React 18", "TypeScript", "Tailwind v4", "Docker", "Vite"],
    status: 'active',
    link: 'https://izotov.dev'
  },
  {
    title: 'Study Smart AI',
    category: 'AI Architecture',
    year: '2026',
    description: 'Service-oriented architecture for AI-driven education. Orchestrates LLM inference for real-time content generation within a secure, containerized environment. Features a reactive HTMX frontend and asynchronous task processing for strict latency control.',
    image: coreLogicImg,
    stack: ["Python", "Django", "HTMX", "Redis", "Docker", "PostgreSQL", "LLMs", "Stripe"],
    status: 'active',
    link: 'https://github.com/oleksandr-izotov/StudySmarterAi'
  },
  {
    title: 'Processing',
    category: 'Something new...',
    year: '2026',
    description: 'Distributed key-value store optimized for high-write workloads. Features automatic sharding, multi-region replication, and a custom query language for real-time telemetry processing.',
    image: nexusDbImg,
    stack: ["Go", "Kubernetes", "PostgreSQL", "Kafka", "AWS"],
    status: 'development'
  },
];
