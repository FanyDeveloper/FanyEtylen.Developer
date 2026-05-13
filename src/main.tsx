import "../css/style.css";
import "../css/animations.css";
import "../css/projects.css";
import "../css/about.css";
import "../css/services.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Hero from "./Hero";
import Projects from "./Projects";
import About from "./About";
import Services from "./Services";
import ScrollLine from "./ScrollLine";

const rootEl = document.getElementById("hero-root");
if (!rootEl) {
  throw new Error("Elemento #hero-root não encontrado.");
}

createRoot(rootEl).render(
  <StrictMode>
    <Hero />
    <Projects />
    <About />
    <Services />
  </StrictMode>
);
