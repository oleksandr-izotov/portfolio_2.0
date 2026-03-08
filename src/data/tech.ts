export interface TechCategory {
  label: string;
  items: string[];
  duration: number;
  reverse?: boolean;
}

export const techStack: TechCategory[] = [
  {
    label: "Web & Cloud Apps",
    items: ["Corporate Portals", "B2B Dashboards", "SaaS Development", "React / Tailwind"],
    duration: 15
  },
  {
    label: "AI & Automation",
    items: ["LLM Integration", "Smart Chatbots", "Process Automation", "Python / AI Models"],
    duration: 22,
    reverse: true
  },
  {
    label: "System Architecture",
    items: ["Cloud Deployment", "API Development", "Secure Databases", "Docker / Microservices"],
    duration: 18
  }
];
