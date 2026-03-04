import { useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import Section from "./section";

const ease = [0.22, 1, 0.36, 1];

const gridVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.11,
      delayChildren: 0.06,
    },
  },
};

const cardRevealVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease },
  },
};

function ProjectCard({ project, index, onOpen }) {
  const [sparks, setSparks] = useState([]);
  const sparkIdRef = useRef(0);
  const lastEmitRef = useRef(0);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRotateX = useSpring(rotateX, { stiffness: 240, damping: 24, mass: 0.5 });
  const springRotateY = useSpring(rotateY, { stiffness: 240, damping: 24, mass: 0.5 });

  const removeSpark = (id) => {
    setSparks((prev) => prev.filter((spark) => spark.id !== id));
  };

  const emitSparkBurst = (x, y) => {
    const now = performance.now();
    if (now - lastEmitRef.current < 90) {
      return;
    }
    lastEmitRef.current = now;

    const nextSparks = [];
    for (let i = 0; i < 3; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 16 + Math.random() * 26;
      nextSparks.push({
        id: `${project.id}-${sparkIdRef.current}`,
        x,
        y,
        tx: Math.cos(angle) * distance,
        ty: Math.sin(angle) * distance,
        size: 2 + Math.random() * 3,
        duration: 0.45 + Math.random() * 0.25,
      });
      sparkIdRef.current += 1;
    }

    setSparks((prev) => [...prev.slice(-16), ...nextSparks]);
  };

  const handlePointerMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const nx = (x / rect.width - 0.5) * 2;
    const ny = (y / rect.height - 0.5) * 2;
    rotateX.set(-ny * 4.2);
    rotateY.set(nx * 5.5);

    event.currentTarget.style.setProperty("--cursor-x", `${x}px`);
    event.currentTarget.style.setProperty("--cursor-y", `${y}px`);
    emitSparkBurst(x, y);
  };

  const handlePointerLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.button
      key={project.id}
      type="button"
      layoutId={`card-${project.id}`}
      onClick={() => onOpen(project)}
      onMouseMove={handlePointerMove}
      onMouseEnter={handlePointerMove}
      onMouseLeave={handlePointerLeave}
      className="lux-card interactive-card group relative overflow-hidden p-6 text-left"
      variants={cardRevealVariants}
      whileHover={{ y: -9, scale: 1.035 }}
      transition={{ duration: 0.42, ease }}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformPerspective: 1100,
      }}
    >
      <div className="card-cursor-glow" />
      <div className={`h-28 rounded-xl bg-gradient-to-br ${project.accent}`} />

      <div className="mt-5 flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
          Mission 0{index + 1}
        </p>
        <span className="text-sm text-cyan-200">Open</span>
      </div>

      <motion.h3 layoutId={`title-${project.id}`} className="mt-3 text-xl font-semibold text-slate-50">
        {project.title}
      </motion.h3>

      <motion.p layoutId={`desc-${project.id}`} className="mt-3 text-sm leading-relaxed text-slate-300">
        {project.desc}
      </motion.p>

      <div className="mt-5 flex flex-wrap gap-2">
        {project.stack.slice(0, 3).map((item) => (
          <span key={item} className="tag-pill">
            {item}
          </span>
        ))}
      </div>

      <div className="mt-6 text-sm font-medium text-cyan-300 transition group-hover:text-cyan-100">
        View project details
      </div>

      <AnimatePresence>
        {sparks.map((spark) => (
          <motion.span
            key={spark.id}
            className="card-spark"
            style={{ left: spark.x, top: spark.y, width: spark.size, height: spark.size }}
            initial={{ opacity: 0, scale: 0.3, x: 0, y: 0 }}
            animate={{ opacity: [0, 0.95, 0], scale: [0.3, 1.3, 0.2], x: spark.tx, y: spark.ty }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: spark.duration, ease }}
            onAnimationComplete={() => removeSpark(spark.id)}
          />
        ))}
      </AnimatePresence>
    </motion.button>
  );
}

export default function Projects() {
  const projects = useMemo(
    () => [
      {
        id: "stellar-commerce",
        title: "Stellar Commerce Experience",
        desc: "A luxury digital flagship with cinematic product reveals and precision conversion pathways.",
        stack: ["React", "Framer Motion", "Node API", "PostgreSQL"],
        highlights: [
          "Engineered layered motion interactions for premium product storytelling",
          "Built modular commerce architecture with high-speed campaign deployment",
          "Optimized render and interaction performance across all viewport sizes",
        ],
        links: { github: "#", live: "#" },
        accent: "from-cyan-500/75 via-blue-500/70 to-violet-500/75",
      },
      {
        id: "cosmos-intelligence",
        title: "Cosmos Intelligence Platform",
        desc: "A command-center analytics suite with exceptional visual hierarchy and calm clarity at scale.",
        stack: ["React", "TypeScript", "FastAPI", "Redis"],
        highlights: [
          "Designed glassmorphic dashboards with controlled depth and light layering",
          "Created adaptive data modules that support executive-level decision-making",
          "Integrated secure backend services with low-latency data retrieval",
        ],
        links: { github: "#", live: "#" },
        accent: "from-blue-500/75 via-indigo-500/70 to-cyan-500/75",
      },
      {
        id: "orbit-portfolio",
        title: "Orbit Founder Portfolio",
        desc: "A high-trust brand platform that positions founders for enterprise-level opportunities.",
        stack: ["Vite", "Tailwind CSS", "Headless CMS", "Cloud Deploy"],
        highlights: [
          "Delivered immersive hero narratives with cinematic spacing and rhythm",
          "Built reusable, scalable sections for case studies and thought leadership",
          "Improved engagement through subtle reveal choreography and micro-physics",
        ],
        links: { github: "#", live: "#" },
        accent: "from-violet-500/75 via-fuchsia-500/70 to-sky-500/75",
      },
    ],
    []
  );

  const [active, setActive] = useState(null);

  return (
    <Section delay={0.08}>
      <div className="relative">
        <div className="section-glow right-[-22rem] top-[-8rem] bg-cyan-500/20" />

        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Featured Missions</p>
            <h2 className="mt-3 heading-font text-3xl font-semibold tracking-tight text-slate-50 md:text-4xl">
              Products designed with celestial depth and enterprise reliability
            </h2>
            <p className="mt-3 max-w-2xl text-slate-300">
              Each launch combines immersive visuals, smooth interaction physics, and
              production-ready systems built for sustained growth.
            </p>
          </div>

          <a href="#contact" className="btn-secondary">
            Launch your next product
          </a>
        </div>

        <motion.div
          className="mt-12 grid gap-6 md:grid-cols-3"
          variants={gridVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} onOpen={setActive} />
          ))}
        </motion.div>

        <AnimatePresence>
          {active && (
            <motion.div
              className="fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.button
                type="button"
                className="absolute inset-0 bg-slate-950/70 backdrop-blur-[8px]"
                onClick={() => setActive(null)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.28, ease }}
              />

              <motion.article
                layoutId={`card-${active.id}`}
                className="glass-panel modal-overlay relative w-full max-w-3xl p-7 md:p-9"
                initial={{ opacity: 0, scale: 0.94, y: 18, filter: "blur(6px)" }}
                animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.96, y: 14, filter: "blur(4px)" }}
                transition={{ type: "spring", stiffness: 170, damping: 20, mass: 0.75 }}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Project Detail</p>
                    <motion.h3
                      layoutId={`title-${active.id}`}
                      className="mt-3 heading-font text-2xl font-semibold text-slate-50 md:text-3xl"
                    >
                      {active.title}
                    </motion.h3>
                    <motion.p
                      layoutId={`desc-${active.id}`}
                      className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base"
                    >
                      {active.desc}
                    </motion.p>
                  </div>

                  <button type="button" onClick={() => setActive(null)} className="btn-secondary px-4 py-2">
                    Close
                  </button>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {active.stack.map((item) => (
                    <span key={item} className="tag-pill">
                      {item}
                    </span>
                  ))}
                </div>

                <div className="mt-7">
                  <p className="text-sm font-semibold text-slate-100">Highlights</p>
                  <ul className="mt-3 space-y-3 text-sm text-slate-300">
                    {active.highlights.map((highlight) => (
                      <li key={highlight} className="rounded-xl border border-white/15 bg-white/5 p-3">
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <a href={active.links.github} className="btn-secondary">
                    Source
                  </a>
                  <a href={active.links.live} className="btn-accent">
                    Live Preview
                  </a>
                </div>
              </motion.article>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Section>
  );
}
