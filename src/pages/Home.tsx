import { useEffect } from "react";
import { Hero } from "@/sections/Hero/Hero";
import { Signal } from "@/sections/Signal/Signal";
import { About } from "@/sections/About/About";
import { Engineering, Transmission } from "@/sections/Engineering/Engineering";
import { Products } from "@/sections/Products/Products";
import { Projects } from "@/sections/Projects/Projects";
import { Contact } from "@/sections/Contact/Contact";

export function Home() {
  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>("[data-theme]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("is-in", entry.isIntersecting);
        });
      },
      { rootMargin: "-12% 0px -68% 0px", threshold: 0 },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <main id="main">
      <Hero />
      <Signal />
      <About />
      <Engineering />
      <Transmission />
      <Projects />
      <Products />
      <Contact />
    </main>
  );
}
