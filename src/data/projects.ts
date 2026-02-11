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
    title: 'Blueprint Engine',
    category: 'Infrastructure',
    year: '2025',
    description: 'A high-performance rendering engine built for architectural visualization. Implements custom shaders for real-time ray-tracing and complex geometric processing within the browser environment.',
    image: blueprintImg,
    stack: ["React", "Three.js", "GLSL", "TypeScript", "Vite"],
    status: 'active',
    link: 'https://github.com/oleksandr-izotov'
  },
  {
    title: 'Core Logic OS',
    category: 'System Design',
    year: '2024',
    description: 'Minimalist kernel architecture for distributed systems. Focuses on low-latency inter-process communication and secure memory management for safety-critical industrial applications.',
    image: coreLogicImg,
    stack: ["Rust", "Wasm", "gRPC", "Redis", "Linux"],
    status: 'development'
  },
  {
    title: 'Nexus Database',
    category: 'Big Data',
    year: '2024',
    description: 'Distributed key-value store optimized for high-write workloads. Features automatic sharding, multi-region replication, and a custom query language for real-time telemetry processing.',
    image: nexusDbImg,
    stack: ["Go", "Kubernetes", "PostgreSQL", "Kafka", "AWS"],
    status: 'development'
  },
];
