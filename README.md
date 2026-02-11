# Portfolio 2.0 - Oleksandr Izotov

A high-performance, dark-themed developer portfolio built with modern web technologies. Designed to showcase engineering skills, projects, and technical expertise with a premium, architect-inspired aesthetic.

## 🚀 Tech Stack

- **Core**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS v4, Motion (Framer Motion)
- **Icons**: Lucide React
- **Infrastructure**: Docker (Multi-stage builds), Nginx
- **Deployment**: Vercel / Render ready

## ✨ Features

- **Premium Dark Mode**: Default dark theme with "engineering blueprint" aesthetics.
- **Performance First**: Highly optimized assets (WebP), lazy loading, and minimal bundle size.
- **Interactive UI**: Smooth animations, micro-interactions, and responsive design.
- **Project Management**: "Locked" state for in-development projects and external links for active ones.
- **Dockerized**: Full development and production Docker environments included.
- **SEO Optimized**: Meta tags, Open Graph, and semantic HTML structure.

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ (for local dev)
- Docker & Docker Compose (optional, for containerized dev)

### Option 1: Local Development (Fastest)

1.  **Install dependencies**:
    ```bash
    npm install
    ```
2.  **Start the dev server**:
    ```bash
    npm run dev
    ```
3.  Open [http://localhost:5173](http://localhost:5173)

### Option 2: Docker Development (Isolated)

1.  **Start the container**:

    ```bash
    npm run docker:dev
    ```

    _This maps your local source code into the container, so Hot Module Replacement (HMR) works instantly._

2.  Open [http://localhost:3000](http://localhost:3000)

## 🐳 Production Build

To build the optimized production image (Nginx + Static Assets):

```bash
npm run docker:prod
```

The application will be available at [http://localhost:80](http://localhost:80).

## 📦 Deployment

### Vercel (Recommended)

This project is optimized for Vercel.

1.  Import repository to Vercel.
2.  Framework Preset: **Vite**.
3.  Deploy.

### Render

A `render.yaml` file is included for "Infrastructure as Code" deployment on Render.com.

1.  Create a new **Blueprint** on Render.
2.  Connect this repository.
3.  Render will automatically build the Docker image and deploy.

## 📄 License

[MIT](LICENSE) © 2026 Oleksandr Izotov
