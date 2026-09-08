import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./styles/globals.css";

const container = document.getElementById("root")!;

const tree = (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

// Prerendered pages already contain markup — hydrate it instead of throwing it
// away, so the crawler-visible HTML is also what the visitor sees first.
if (container.firstElementChild) {
  hydrateRoot(container, tree);
} else {
  createRoot(container).render(tree);
}
