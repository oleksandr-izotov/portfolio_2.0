export interface TechCategory {
  label: string;
  items: string[];
  duration: number;
  reverse?: boolean;
}

export const techStack: TechCategory[] = [
  {
    label: "Frontend Core",
    items: ["React", "Next.js", "TypeScript", "Tailwind", "Motion", "Three.js", "Vite"],
    duration: 15
  },
  {
    label: "Logic & Engine",
    items: ["Node.js", "Express", "Go", "Python", "GraphQL", "REST API", "FastAPI"],
    duration: 22,
    reverse: true
  },
  {
    label: "Architecture",
    items: ["Docker", "PostgreSQL", "Redis", "Git", "Linux", "Bash", "AWS", "Nginx"],
    duration: 18
  }
];
