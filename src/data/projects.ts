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
    title: 'Processing',
    category: 'Something new...',
    year: '2026',
    description: 'Minimalist kernel architecture for distributed systems. Focuses on low-latency inter-process communication and secure memory management for safety-critical industrial applications.',
    image: coreLogicImg,
    stack: ["Rust", "Wasm", "gRPC", "Redis", "Linux"],
    status: 'development'
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
