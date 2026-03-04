import { useEffect, useRef, useState } from "react";

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const lerp = (start, end, alpha) => start + (end - start) * alpha;

const CARTOONS = [
  {
    id: "planet",
    kind: "planet",
    x: 9,
    y: 14,
    size: 48,
    depth: 8,
    maxMove: 16,
    maxRotate: 7,
    opacity: 0.5,
    floatX: -4,
    floatY: 3,
    floatDuration: 7.8,
    floatDelay: 0.1,
  },
  {
    id: "spark",
    kind: "spark",
    x: 89,
    y: 13,
    size: 28,
    depth: 13,
    maxMove: 20,
    maxRotate: 9,
    opacity: 0.55,
    floatX: 3,
    floatY: -3,
    floatDuration: 6.4,
    floatDelay: 0.6,
  },
  {
    id: "robot",
    kind: "robot",
    x: 91,
    y: 38,
    size: 52,
    depth: 15,
    maxMove: 22,
    maxRotate: 9,
    opacity: 0.5,
    floatX: -5,
    floatY: 3,
    floatDuration: 7.2,
    floatDelay: 0.35,
    hideMobile: true,
  },
  {
    id: "bubble",
    kind: "bubble",
    x: 12,
    y: 44,
    size: 36,
    depth: 9,
    maxMove: 16,
    maxRotate: 7,
    opacity: 0.46,
    floatX: 2,
    floatY: -3,
    floatDuration: 6.8,
    floatDelay: 0.2,
  },
  {
    id: "chip",
    kind: "chip",
    x: 18,
    y: 78,
    size: 38,
    depth: 10,
    maxMove: 18,
    maxRotate: 8,
    opacity: 0.48,
    floatX: -3,
    floatY: 2,
    floatDuration: 7.4,
    floatDelay: 0.45,
  },
  {
    id: "astronaut",
    kind: "astronaut",
    x: 82,
    y: 80,
    size: 52,
    depth: 16,
    maxMove: 24,
    maxRotate: 10,
    opacity: 0.52,
    floatX: 4,
    floatY: -4,
    floatDuration: 8.1,
    floatDelay: 0.55,
  },
  {
    id: "cloud",
    kind: "cloud",
    x: 76,
    y: 24,
    size: 40,
    depth: 7,
    maxMove: 14,
    maxRotate: 6,
    opacity: 0.43,
    floatX: 2,
    floatY: 2,
    floatDuration: 7.6,
    floatDelay: 0.7,
  },
  {
    id: "star",
    kind: "star",
    x: 22,
    y: 26,
    size: 30,
    depth: 12,
    maxMove: 18,
    maxRotate: 8,
    opacity: 0.5,
    floatX: -2,
    floatY: 3,
    floatDuration: 6.9,
    floatDelay: 0.25,
  },
];

function CartoonIcon({ kind }) {
  switch (kind) {
    case "planet":
      return (
        <svg viewBox="0 0 64 64" className="hero-cartoon-svg">
          <circle cx="32" cy="32" r="14" className="cartoon-fill" />
          <ellipse cx="32" cy="32" rx="24" ry="8.5" className="cartoon-stroke cartoon-ring" />
          <circle cx="26" cy="28" r="3" className="cartoon-dot" />
        </svg>
      );
    case "spark":
      return (
        <svg viewBox="0 0 64 64" className="hero-cartoon-svg">
          <path className="cartoon-fill" d="M32 8l4 20 20 4-20 4-4 20-4-20-20-4 20-4z" />
          <circle cx="32" cy="32" r="4" className="cartoon-dot" />
        </svg>
      );
    case "robot":
      return (
        <svg viewBox="0 0 64 64" className="hero-cartoon-svg">
          <rect x="14" y="16" width="36" height="32" rx="10" className="cartoon-fill cartoon-stroke" />
          <line x1="32" y1="8" x2="32" y2="16" className="cartoon-stroke" />
          <circle cx="24" cy="30" r="3.5" className="cartoon-dot" />
          <circle cx="40" cy="30" r="3.5" className="cartoon-dot" />
          <rect x="24" y="38" width="16" height="4" rx="2" className="cartoon-dot" />
        </svg>
      );
    case "bubble":
      return (
        <svg viewBox="0 0 64 64" className="hero-cartoon-svg">
          <circle cx="26" cy="30" r="11" className="cartoon-fill cartoon-stroke" />
          <circle cx="40" cy="25" r="7" className="cartoon-fill cartoon-stroke" />
          <circle cx="43" cy="40" r="4.5" className="cartoon-dot" />
        </svg>
      );
    case "chip":
      return (
        <svg viewBox="0 0 64 64" className="hero-cartoon-svg">
          <rect x="20" y="20" width="24" height="24" rx="6" className="cartoon-fill cartoon-stroke" />
          <rect x="27" y="27" width="10" height="10" rx="2" className="cartoon-dot" />
          <g className="cartoon-stroke">
            <line x1="16" y1="24" x2="20" y2="24" />
            <line x1="16" y1="32" x2="20" y2="32" />
            <line x1="16" y1="40" x2="20" y2="40" />
            <line x1="44" y1="24" x2="48" y2="24" />
            <line x1="44" y1="32" x2="48" y2="32" />
            <line x1="44" y1="40" x2="48" y2="40" />
          </g>
        </svg>
      );
    case "astronaut":
      return (
        <svg viewBox="0 0 64 64" className="hero-cartoon-svg">
          <circle cx="32" cy="24" r="11" className="cartoon-fill cartoon-stroke" />
          <rect x="24" y="34" width="16" height="14" rx="6" className="cartoon-fill cartoon-stroke" />
          <path d="M27 24h10" className="cartoon-stroke" />
          <circle cx="28" cy="24" r="2.3" className="cartoon-dot" />
          <circle cx="36" cy="24" r="2.3" className="cartoon-dot" />
        </svg>
      );
    case "cloud":
      return (
        <svg viewBox="0 0 64 64" className="hero-cartoon-svg">
          <path
            className="cartoon-fill cartoon-stroke"
            d="M18 39c-5.5 0-9-3.2-9-7.6 0-4.3 3.3-7.7 8-7.7 1.5-5.9 6.6-9.7 13-9.7 7.5 0 13.4 5.1 14.2 12.1 5.2.4 9.4 4 9.4 8.9 0 5-4.3 9-9.8 9H18z"
          />
        </svg>
      );
    case "star":
      return (
        <svg viewBox="0 0 64 64" className="hero-cartoon-svg">
          <path
            className="cartoon-fill cartoon-stroke"
            d="M32 10l6.8 13.8 15.2 2.2-11 10.8 2.6 15.2L32 44.7 18.4 52l2.6-15.2-11-10.8 15.2-2.2z"
          />
        </svg>
      );
    default:
      return null;
  }
}

export default function HeroParallaxCartoons() {
  const layerRef = useRef(null);
  const itemRefs = useRef([]);
  const [mode, setMode] = useState("interactive");

  useEffect(() => {
    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarseQuery = window.matchMedia("(hover: none), (pointer: coarse)");

    const setInteractionMode = () => {
      if (reducedQuery.matches) {
        setMode("reduced");
        return;
      }
      if (coarseQuery.matches) {
        setMode("idle");
        return;
      }
      setMode("interactive");
    };

    setInteractionMode();

    const addListener = (query, handler) => {
      if (query.addEventListener) {
        query.addEventListener("change", handler);
        return () => query.removeEventListener("change", handler);
      }
      query.addListener(handler);
      return () => query.removeListener(handler);
    };

    const removeReduced = addListener(reducedQuery, setInteractionMode);
    const removeCoarse = addListener(coarseQuery, setInteractionMode);

    return () => {
      removeReduced();
      removeCoarse();
    };
  }, []);

  useEffect(() => {
    const layer = layerRef.current;
    const interactionRegion = layer?.closest(".hero-container") || layer?.parentElement;
    if (!layer || !interactionRegion) {
      return undefined;
    }

    itemRefs.current.forEach((node) => {
      if (!node) {
        return;
      }
      node.style.setProperty("--tx", "0px");
      node.style.setProperty("--ty", "0px");
      node.style.setProperty("--rot", "0deg");
    });

    if (mode !== "interactive") {
      return undefined;
    }

    let raf = 0;
    let rect = interactionRegion.getBoundingClientRect();
    const pointer = {
      x: rect.width * 0.5,
      y: rect.height * 0.5,
      tx: rect.width * 0.5,
      ty: rect.height * 0.5,
    };

    const current = CARTOONS.map(() => ({ x: 0, y: 0, r: 0 }));

    const refreshBounds = () => {
      rect = interactionRegion.getBoundingClientRect();
      pointer.x = clamp(pointer.x, 0, rect.width);
      pointer.y = clamp(pointer.y, 0, rect.height);
      pointer.tx = clamp(pointer.tx, 0, rect.width);
      pointer.ty = clamp(pointer.ty, 0, rect.height);
    };

    const onMove = (event) => {
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      pointer.tx = clamp(x, 0, rect.width);
      pointer.ty = clamp(y, 0, rect.height);
    };

    const onLeave = () => {
      pointer.tx = rect.width * 0.5;
      pointer.ty = rect.height * 0.5;
    };

    const animate = () => {
      pointer.x = lerp(pointer.x, pointer.tx, 0.14);
      pointer.y = lerp(pointer.y, pointer.ty, 0.14);

      const nx = ((pointer.x / rect.width) - 0.5) * 2;
      const ny = ((pointer.y / rect.height) - 0.5) * 2;

      for (let index = 0; index < CARTOONS.length; index += 1) {
        const item = CARTOONS[index];
        const node = itemRefs.current[index];
        if (!node) {
          continue;
        }

        const targetX = clamp(nx * item.depth, -item.maxMove, item.maxMove);
        const targetY = clamp(ny * item.depth, -item.maxMove, item.maxMove);

        const baseX = (item.x / 100) * rect.width;
        const baseY = (item.y / 100) * rect.height;
        const angle = Math.atan2(pointer.y - baseY, pointer.x - baseX) * (180 / Math.PI);
        const targetR = clamp(angle * 0.12, -item.maxRotate, item.maxRotate);

        current[index].x = lerp(current[index].x, targetX, 0.15);
        current[index].y = lerp(current[index].y, targetY, 0.15);
        current[index].r = lerp(current[index].r, targetR, 0.12);

        node.style.setProperty("--tx", `${current[index].x.toFixed(2)}px`);
        node.style.setProperty("--ty", `${current[index].y.toFixed(2)}px`);
        node.style.setProperty("--rot", `${current[index].r.toFixed(2)}deg`);
      }

      raf = window.requestAnimationFrame(animate);
    };

    raf = window.requestAnimationFrame(animate);
    window.addEventListener("resize", refreshBounds);
    interactionRegion.addEventListener("pointermove", onMove, { passive: true });
    interactionRegion.addEventListener("pointerleave", onLeave, { passive: true });

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", refreshBounds);
      interactionRegion.removeEventListener("pointermove", onMove);
      interactionRegion.removeEventListener("pointerleave", onLeave);
    };
  }, [mode]);

  return (
    <div ref={layerRef} className={`hero-cartoons mode-${mode}`} aria-hidden>
      {CARTOONS.map((item, index) => (
        <span
          key={item.id}
          ref={(node) => {
            itemRefs.current[index] = node;
          }}
          className={`hero-cartoon-item${item.hideMobile ? " hide-mobile" : ""}`}
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            width: `${item.size}px`,
            height: `${item.size}px`,
            opacity: item.opacity,
            "--idle-x": `${item.floatX}px`,
            "--idle-y": `${item.floatY}px`,
            "--float-duration": `${item.floatDuration}s`,
            "--float-delay": `${item.floatDelay}s`,
          }}
        >
          <CartoonIcon kind={item.kind} />
        </span>
      ))}
    </div>
  );
}
