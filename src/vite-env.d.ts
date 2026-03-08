/// <reference types="vite/client" />

declare module "*.pdf";
declare module "*.webp" {
  const src: string;
  export default src;
}
