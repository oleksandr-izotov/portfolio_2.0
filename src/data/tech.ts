export interface TechCategory {
  label: string;
  items: string[];
  duration: number;
  reverse?: boolean;
}

export const techStack: TechCategory[] = [
  {
    label: "Frontend Core",
    items: ["React", "Tailwind", "Vue", "TypeScript", "JavaScript", "HTML", "CSS"],
    duration: 15
  },
  {
    label: "Logic & Engine",
    items: ["Java", "Python", "Spring Boot", "Pandas", "NumPy", "SQL", "PostgreSQL"],
    duration: 22,
    reverse: true
  },
  {
    label: "Architecture",
    items: ["Git", "Docker", "Docker Compose", "GitHub Actions", "Linux", "Nginx", "Bash"],
    duration: 18
  }
];
