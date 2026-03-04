import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const CLICKABLE_SELECTOR =
  "a, button, [role='button'], [data-cursor-hover='true'], .work-card, .nav-link, .nav-cta, .hero-scroll-mouse";
const MAGNETIC_SELECTOR = "[data-magnetic='true']";

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const SPOTLIGHT_SIZE = 440;
const ORB_SIZE = 34;

export default function CinematicCursor() {
  const prefersReducedMotion = useReducedMotion();

  const [enabled, setEnabled] = useState(false);
  const [ripples, setRipples] = useState([]);

  const spotlightRef = useRef(null);
  const orbRef = useRef(null);
  const pointerRef = useRef({ x: -120, y: -120 });
  const previousPointerRef = useRef({ x: -120, y: -120 });
  const renderRef = useRef({ x: -120, y: -120 });
  const visualRef = useRef({
    orbOpacity: 0.38,
    orbScale: 1,
    spotlightOpacity: 0.06,
    spotlightScale: 1,
  });
  const targetVisualRef = useRef({
    orbOpacity: 0.38,
    orbScale: 1,
    spotlightOpacity: 0.06,
    spotlightScale: 1,
  });
  const isInteractiveRef = useRef(false);
  const isIdleRef = useRef(true);
  const lastMoveAtRef = useRef(0);
  const rafRef = useRef(0);
  const rippleIdRef = useRef(0);
  const rippleTimersRef = useRef([]);
  const magneticElementRef = useRef(null);
  const magneticBoundsRef = useRef(null);

  const setVisualTargets = (interactive, idle) => {
    targetVisualRef.current.orbOpacity = idle ? 0.38 : interactive ? 0.94 : 0.8;
    targetVisualRef.current.orbScale = interactive ? 1.1 : 1;
    targetVisualRef.current.spotlightOpacity = idle ? 0.06 : interactive ? 0.2 : 0.14;
    targetVisualRef.current.spotlightScale = interactive ? 1.03 : 1;
  };

  const resetMagnetic = (element) => {
    if (!element) {
      return;
    }
    element.style.setProperty("--magnetic-x", "0px");
    element.style.setProperty("--magnetic-y", "0px");
  };

  const updateMagneticBounds = (element) => {
    if (!element) {
      magneticBoundsRef.current = null;
      return;
    }
    const rect = element.getBoundingClientRect();
    magneticBoundsRef.current = {
      centerX: rect.left + rect.width / 2,
      centerY: rect.top + rect.height / 2,
      width: rect.width,
      height: rect.height,
    };
  };

  useEffect(() => {
    const computeCapability = () => {
      const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const allowEffects = finePointer && window.innerWidth > 900 && !reduced && !prefersReducedMotion;
      setEnabled(allowEffects);
    };

    computeCapability();
    window.addEventListener("resize", computeCapability);
    return () => {
      window.removeEventListener("resize", computeCapability);
    };
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (!enabled) {
      document.body.classList.remove("cursor-orb-enabled");
      resetMagnetic(magneticElementRef.current);
      magneticElementRef.current = null;
      magneticBoundsRef.current = null;
      return undefined;
    }

    document.body.classList.add("cursor-orb-enabled");
    setVisualTargets(false, true);

    const refreshMagnetic = () => {
      if (!magneticElementRef.current) {
        return;
      }
      updateMagneticBounds(magneticElementRef.current);
    };

    const loop = () => {
      const now = performance.now();
      const pointer = pointerRef.current;
      const previousPointer = previousPointerRef.current;
      const render = renderRef.current;

      const idleNow = now - lastMoveAtRef.current > 170;
      if (idleNow !== isIdleRef.current) {
        isIdleRef.current = idleNow;
        setVisualTargets(isInteractiveRef.current, idleNow);
      }

      const vx = pointer.x - previousPointer.x;
      const vy = pointer.y - previousPointer.y;
      previousPointer.x = pointer.x;
      previousPointer.y = pointer.y;

      const boostedTargetX = pointer.x + vx * 0.08;
      const boostedTargetY = pointer.y + vy * 0.08;

      const deltaX = boostedTargetX - render.x;
      const deltaY = boostedTargetY - render.y;
      const distance = Math.hypot(deltaX, deltaY);
      const follow = distance > 42 ? 0.7 : 0.58;

      render.x += deltaX * follow;
      render.y += deltaY * follow;

      const visual = visualRef.current;
      const targetVisual = targetVisualRef.current;
      visual.orbOpacity += (targetVisual.orbOpacity - visual.orbOpacity) * 0.34;
      visual.orbScale += (targetVisual.orbScale - visual.orbScale) * 0.38;
      visual.spotlightOpacity += (targetVisual.spotlightOpacity - visual.spotlightOpacity) * 0.32;
      visual.spotlightScale += (targetVisual.spotlightScale - visual.spotlightScale) * 0.34;

      const spotlight = spotlightRef.current;
      const orb = orbRef.current;

      if (spotlight) {
        spotlight.style.transform = `translate3d(${render.x - SPOTLIGHT_SIZE / 2}px, ${render.y - SPOTLIGHT_SIZE / 2}px, 0) scale(${visual.spotlightScale})`;
        spotlight.style.opacity = String(visual.spotlightOpacity);
      }

      if (orb) {
        orb.style.transform = `translate3d(${render.x - ORB_SIZE / 2}px, ${render.y - ORB_SIZE / 2}px, 0) scale(${visual.orbScale})`;
        orb.style.opacity = String(visual.orbOpacity);
      }

      const magneticElement = magneticElementRef.current;
      const magneticBounds = magneticBoundsRef.current;
      if (magneticElement && magneticBounds) {
        const offsetX =
          clamp((pointer.x - magneticBounds.centerX) / (magneticBounds.width * 0.5 || 1), -1, 1) *
          4.8;
        const offsetY =
          clamp((pointer.y - magneticBounds.centerY) / (magneticBounds.height * 0.5 || 1), -1, 1) *
          4.8;
        magneticElement.style.setProperty("--magnetic-x", `${offsetX}px`);
        magneticElement.style.setProperty("--magnetic-y", `${offsetY}px`);
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    const onPointerMove = (event) => {
      pointerRef.current.x = event.clientX;
      pointerRef.current.y = event.clientY;
      lastMoveAtRef.current = performance.now();

      if (isIdleRef.current) {
        isIdleRef.current = false;
        setVisualTargets(isInteractiveRef.current, false);
      }

      const target = event.target instanceof Element ? event.target : null;
      const isInteractive = Boolean(target?.closest(CLICKABLE_SELECTOR));
      if (isInteractive !== isInteractiveRef.current) {
        isInteractiveRef.current = isInteractive;
        setVisualTargets(isInteractive, isIdleRef.current);
      }

      const magneticTarget = target?.closest(MAGNETIC_SELECTOR);
      if (magneticElementRef.current && magneticElementRef.current !== magneticTarget) {
        resetMagnetic(magneticElementRef.current);
      }
      magneticElementRef.current = magneticTarget;
      updateMagneticBounds(magneticTarget);
    };

    const onPointerDown = (event) => {
      const id = rippleIdRef.current + 1;
      rippleIdRef.current = id;
      const size = 96 + Math.random() * 44;

      setRipples((prev) => [
        ...prev,
        { id, x: event.clientX, y: event.clientY, size },
      ]);

      const timer = window.setTimeout(() => {
        setRipples((prev) => prev.filter((ripple) => ripple.id !== id));
      }, 700);
      rippleTimersRef.current.push(timer);
    };

    const onWindowBlur = () => {
      isIdleRef.current = true;
      isInteractiveRef.current = false;
      setVisualTargets(false, true);
      resetMagnetic(magneticElementRef.current);
      magneticElementRef.current = null;
      magneticBoundsRef.current = null;
    };

    const onPointerLeave = () => {
      isInteractiveRef.current = false;
      setVisualTargets(false, isIdleRef.current);
      resetMagnetic(magneticElementRef.current);
      magneticElementRef.current = null;
      magneticBoundsRef.current = null;
    };

    lastMoveAtRef.current = performance.now();
    rafRef.current = requestAnimationFrame(loop);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave, { passive: true });
    window.addEventListener("blur", onWindowBlur);
    window.addEventListener("resize", refreshMagnetic, { passive: true });
    window.addEventListener("scroll", refreshMagnetic, true);

    return () => {
      document.body.classList.remove("cursor-orb-enabled");
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("blur", onWindowBlur);
      window.removeEventListener("resize", refreshMagnetic);
      window.removeEventListener("scroll", refreshMagnetic, true);
      rippleTimersRef.current.forEach((timer) => window.clearTimeout(timer));
      rippleTimersRef.current = [];
      resetMagnetic(magneticElementRef.current);
      magneticElementRef.current = null;
      magneticBoundsRef.current = null;
    };
  }, [enabled]);

  if (!enabled) {
    return null;
  }

  return (
    <>
      <div ref={spotlightRef} className="cursor-spotlight" />
      <div ref={orbRef} className="cursor-orb">
        <span className="cursor-orb-center" />
      </div>

      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            className="cursor-ripple"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: ripple.size,
              height: ripple.size,
            }}
            initial={{ scale: 0.08, opacity: 0.4 }}
            animate={{ scale: 1, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.64, ease: [0.22, 1, 0.36, 1] }}
          />
        ))}
      </AnimatePresence>
    </>
  );
}
