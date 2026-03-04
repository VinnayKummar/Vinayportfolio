import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import HeroParallaxCartoons from "./HeroParallaxCartoons";

const ease = [0.22, 1, 0.36, 1];

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export default function Hero() {
  const stageRef = useRef(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) {
      return undefined;
    }

    let frame = 0;

    const updateParallax = () => {
      const rect = stage.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      const centerOffset = clamp((rect.top + rect.height * 0.5 - viewport * 0.5) / viewport, -1, 1);
      const mobileScale = window.innerWidth <= 900 ? 0.45 : 1;

      stage.style.setProperty("--hero-parallax-y", `${centerOffset * 30 * mobileScale}px`);
      stage.style.setProperty("--hero-glow-y", `${centerOffset * -42 * mobileScale}px`);
      stage.style.setProperty("--hero-glow-x", `${centerOffset * 18 * mobileScale}px`);
    };

    const requestUpdate = () => {
      if (frame) {
        return;
      }
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        updateParallax();
      });
    };

    updateParallax();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate, { passive: true });

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, []);

  return (
    <section ref={stageRef} className="hero-stage">
      <motion.div
        className="hero-bg-layer"
        initial={{ opacity: 0, scale: 1.03 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease }}
      >
        <div className="hero-text-shield" />
        <div className="hero-nebula-glow" />
      </motion.div>

      <motion.div
        className="hero-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease }}
      >
        <div className="hero-content">
          <HeroParallaxCartoons />
          <h1 className="hero-title heading-font">
            Full-Stack Engineer | AI Systems &amp; Backend Infrastructure
          </h1>
          <p className="hero-subtitle">
            Vinay Kumar Chakali builds production-ready Python backend and GenAI systems with a
            focus on reliable APIs, workflow automation, and LLM observability.
          </p>
          <div className="hero-actions">
            <a href="#work" className="btn-primary magnetic-target" data-magnetic="true">
              View Projects
            </a>
            <a href="#contact" className="btn-secondary magnetic-target" data-magnetic="true">
              Contact Me
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
