/// <reference types="vite/client" />

// Vite resolves these to hashed URLs at build time; TypeScript needs to be told.
declare module '*.webm' {
  const src: string;
  export default src;
}

declare module '*.mp4' {
  const src: string;
  export default src;
}
