import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { trackEvent } from "../../analytics";

const links = [
  { label: "home", href: "#home" },
  { label: "about", href: "#about" },
  { label: "skills", href: "#expertise" },
  { label: "projects", href: "#work" },
  { label: "experience", href: "#experience" },
  { label: "contact", href: "#contact" },
];

const ease = [0.22, 1, 0.36, 1];
const ringSpring = {
  type: "spring",
  stiffness: 620,
  damping: 32,
  mass: 0.3,
};

export default function Navbar() {
  const navCenterRef = useRef(null);
  const linkRefs = useRef({});
  const [hoveredLink, setHoveredLink] = useState(null);
  const [activeLink, setActiveLink] = useState("#home");
  const [ring, setRing] = useState(null);
  const [hoverRingEnabled, setHoverRingEnabled] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }
    return (
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      window.innerWidth > 900
    );
  });

  const setLinkRef = useCallback((href, node) => {
    if (node) {
      linkRefs.current[href] = node;
      return;
    }
    delete linkRefs.current[href];
  }, []);

  const updateHoverRingCapability = useCallback(() => {
    const hoverAllowed =
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      window.innerWidth > 900;
    setHoverRingEnabled(hoverAllowed);
  }, []);

  useEffect(() => {
    window.addEventListener("resize", updateHoverRingCapability);
    return () => {
      window.removeEventListener("resize", updateHoverRingCapability);
    };
  }, [updateHoverRingCapability]);

  const setRingFromLink = useCallback(
    (href) => {
      if (!hoverRingEnabled) {
        return;
      }

      const container = navCenterRef.current;
      const link = linkRefs.current[href];
      if (!container || !link) {
        return;
      }

      const containerRect = container.getBoundingClientRect();
      const linkRect = link.getBoundingClientRect();
      const size = Math.max(linkRect.width, linkRect.height) + 20;
      const x = linkRect.left - containerRect.left + linkRect.width / 2 - size / 2;
      const y = linkRect.top - containerRect.top + linkRect.height / 2 - size / 2;
      setRing({ x, y, size });
    },
    [hoverRingEnabled]
  );

  const handleHoverStart = useCallback(
    (href) => {
      setHoveredLink(href);
      setRingFromLink(href);
    },
    [setRingFromLink]
  );

  useEffect(() => {
    if (!hoveredLink || !hoverRingEnabled) {
      return;
    }

    const refresh = () => setRingFromLink(hoveredLink);
    window.addEventListener("resize", refresh);
    window.addEventListener("scroll", refresh, true);
    return () => {
      window.removeEventListener("resize", refresh);
      window.removeEventListener("scroll", refresh, true);
    };
  }, [hoveredLink, hoverRingEnabled, setRingFromLink]);

  useEffect(() => {
    const observers = [];
    links.forEach((link) => {
      const section = document.querySelector(link.href);
      if (!section) {
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveLink(link.href);
            }
          });
        },
        {
          threshold: 0.2,
          rootMargin: "-44% 0px -44% 0px",
        }
      );

      observer.observe(section);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  const navLinks = useMemo(
    () =>
      links.map((link) => {
        const isActive = activeLink === link.href;
        return (
          <a
            key={link.href}
            href={link.href}
            className={`nav-link magnetic-target ${isActive ? "is-active" : ""}`}
            ref={(node) => setLinkRef(link.href, node)}
            onMouseEnter={() => handleHoverStart(link.href)}
            onClick={(event) => {
              event.preventDefault();
              const section = document.querySelector(link.href);
              if (!section) {
                return;
              }
              section.scrollIntoView({ behavior: "smooth", block: "start" });
              setActiveLink(link.href);
              trackEvent("nav_click", { section: link.label });
            }}
            data-magnetic="true"
          >
            <span>{link.label}</span>
          </a>
        );
      }),
    [activeLink, handleHoverStart, setLinkRef]
  );

  return (
    <motion.header
      className="nav-shell"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, ease }}
    >
      <div className="nav-wrap">
        <a href="#home" className="brand-mark">
          VinayK<span className="brand-accent">._</span>
        </a>

        <nav
          className="nav-center"
          ref={navCenterRef}
          onMouseLeave={() => setHoveredLink(null)}
        >
          <AnimatePresence>
            {hoverRingEnabled && hoveredLink && ring && (
              <motion.div
                className="nav-hover-ring"
                layoutId="nav-ring"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  x: ring.x,
                  y: ring.y,
                  width: ring.size,
                  height: ring.size,
                }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{
                  x: ringSpring,
                  y: ringSpring,
                  width: ringSpring,
                  height: ringSpring,
                  scale: { duration: 0.14, ease },
                  opacity: { duration: 0.12, ease: "linear" },
                }}
              />
            )}
          </AnimatePresence>
          {navLinks}
        </nav>

        <motion.a
          href="#contact"
          className="nav-cta btn-secondary magnetic-target"
          data-magnetic="true"
          whileHover={{ y: -1.5 }}
          transition={{ duration: 0.3, ease }}
        >
          Contact
        </motion.a>
      </div>
    </motion.header>
  );
}
