import { useEffect, useRef } from "react";

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function buildAmbientStars(width, height, count) {
  const stars = [];
  for (let i = 0; i < count; i += 1) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 0.45 + Math.random() * 1.8,
      alpha: 0.08 + Math.random() * 0.28,
      twinkle: 0.3 + Math.random() * 1.4,
      phase: Math.random() * Math.PI * 2,
      vx: (Math.random() - 0.5) * 0.045,
      vy: (Math.random() - 0.5) * 0.045,
      depth: 0.3 + Math.random() * 0.8,
    });
  }
  return stars;
}

export default function SpaceField() {
  const canvasRef = useRef(null);
  const ambientRef = useRef([]);
  const trailRef = useRef([]);
  const frameRef = useRef(0);
  const lastFrameRef = useRef(0);
  const lastSpawnRef = useRef(0);
  const viewportRef = useRef({ width: 0, height: 0, dpr: 1 });
  const baseCountsRef = useRef({ ambient: 120, trail: 220 });
  const maxTrailRef = useRef(220);
  const qualityRef = useRef(1);
  const performanceRef = useRef({ avgFps: 60, lastAdjust: 0 });
  const pointerRef = useRef({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    dx: 0,
    dy: 0,
    ready: false,
  });
  const parallaxRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return undefined;
    }

    const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
    if (!ctx) {
      return undefined;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const prefersReducedMotion = mediaQuery.matches;
    const lowEndDevice =
      (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
      (navigator.deviceMemory && navigator.deviceMemory <= 4);
    const root = document.documentElement;
    root.dataset.spacePerf = lowEndDevice ? "low" : "high";

    const applyQuality = () => {
      const { width, height } = viewportRef.current;
      if (!width || !height) {
        return;
      }
      const quality = qualityRef.current;
      const ambientCount = Math.floor(baseCountsRef.current.ambient * quality);
      maxTrailRef.current = Math.floor(baseCountsRef.current.trail * quality);
      ambientRef.current = buildAmbientStars(width, height, clamp(ambientCount, 35, 200));

      if (trailRef.current.length > maxTrailRef.current) {
        trailRef.current.splice(0, trailRef.current.length - maxTrailRef.current);
      }
    };

    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const dpr = clamp(window.devicePixelRatio || 1, 1, 1.8);
      viewportRef.current = { width, height, dpr };

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const area = width * height;
      const density = lowEndDevice ? 0.68 : 1;
      const ambientBase = prefersReducedMotion ? 50 : clamp(Math.floor((area / 9000) * density), 80, 190);
      const trailBase = prefersReducedMotion ? 110 : clamp(Math.floor((area / 5200) * density), 160, 330);
      baseCountsRef.current = { ambient: ambientBase, trail: trailBase };

      if (!pointerRef.current.ready) {
        pointerRef.current.x = width / 2;
        pointerRef.current.y = height / 2;
        pointerRef.current.targetX = width / 2;
        pointerRef.current.targetY = height / 2;
      }
      applyQuality();
    };

    const spawnTrail = (x, y, dx, dy, timestamp) => {
      if (prefersReducedMotion) {
        return;
      }

      const quality = qualityRef.current;
      const spawnInterval = clamp(18 - quality * 8, 9, 18);
      if (timestamp - lastSpawnRef.current < spawnInterval) {
        return;
      }

      const velocity = Math.hypot(dx, dy);
      if (velocity < 0.75) {
        return;
      }
      lastSpawnRef.current = timestamp;

      const heading = Math.atan2(dy || 0.01, dx || 0.01);
      const count = clamp(Math.floor((velocity / 5.8) * (0.75 + quality * 0.55)), 2, 7);
      const pool = trailRef.current;

      for (let i = 0; i < count; i += 1) {
        const spread = (Math.random() - 0.5) * 1.1;
        const speed = 0.7 + Math.random() * 1.6 + velocity * 0.028;
        const angle = heading + spread;

        pool.push({
          x: x + (Math.random() - 0.5) * 6,
          y: y + (Math.random() - 0.5) * 6,
          vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 0.6,
          vy: Math.sin(angle) * speed + (Math.random() - 0.5) * 0.6,
          size: 0.8 + Math.random() * 2.4,
          life: 0,
          ttl: 24 + Math.random() * 35,
          friction: 0.935 + Math.random() * 0.04,
          turbulence: 0.004 + Math.random() * 0.01,
          twinkle: 8 + Math.random() * 8,
          phase: Math.random() * Math.PI * 2,
          spark: false,
          blueBoost: 185 + Math.random() * 55,
        });

        if (Math.random() < 0.24) {
          pool.push({
            x,
            y,
            vx: Math.cos(angle + (Math.random() - 0.5) * 0.5) * (speed * 1.25),
            vy: Math.sin(angle + (Math.random() - 0.5) * 0.5) * (speed * 1.25),
            size: 0.9 + Math.random() * 1.8,
            life: 0,
            ttl: 13 + Math.random() * 14,
            friction: 0.92 + Math.random() * 0.025,
            turbulence: 0.008 + Math.random() * 0.016,
            twinkle: 11 + Math.random() * 10,
            phase: Math.random() * Math.PI * 2,
            spark: true,
            blueBoost: 220 + Math.random() * 30,
          });
        }
      }

      if (pool.length > maxTrailRef.current) {
        pool.splice(0, pool.length - maxTrailRef.current);
      }
    };

    const onPointerMove = (event) => {
      const pointer = pointerRef.current;
      const previousX = pointer.ready ? pointer.targetX : event.clientX;
      const previousY = pointer.ready ? pointer.targetY : event.clientY;

      pointer.targetX = event.clientX;
      pointer.targetY = event.clientY;
      pointer.dx = pointer.targetX - previousX;
      pointer.dy = pointer.targetY - previousY;
      pointer.ready = true;

      spawnTrail(pointer.targetX, pointer.targetY, pointer.dx, pointer.dy, performance.now());
    };

    const onPointerLeave = () => {
      const { width, height } = viewportRef.current;
      pointerRef.current.targetX = width / 2;
      pointerRef.current.targetY = height / 2;
      pointerRef.current.dx = 0;
      pointerRef.current.dy = 0;
    };

    const tick = (timestamp) => {
      const { width, height } = viewportRef.current;
      if (!width || !height) {
        frameRef.current = requestAnimationFrame(tick);
        return;
      }

      if (!lastFrameRef.current) {
        lastFrameRef.current = timestamp;
      }
      const frameMs = Math.max(timestamp - lastFrameRef.current, 0.1);
      const delta = Math.min(frameMs / 16.667, 2.3);
      lastFrameRef.current = timestamp;

      const fps = 1000 / frameMs;
      performanceRef.current.avgFps = performanceRef.current.avgFps * 0.92 + fps * 0.08;

      if (!prefersReducedMotion && timestamp - performanceRef.current.lastAdjust > 1500) {
        const avgFps = performanceRef.current.avgFps;
        let nextQuality = qualityRef.current;

        if (avgFps < 48 && nextQuality > 0.55) {
          nextQuality = Math.max(0.55, nextQuality - 0.1);
        } else if (avgFps > 57 && nextQuality < 1) {
          nextQuality = Math.min(1, nextQuality + 0.06);
        }

        if (nextQuality !== qualityRef.current) {
          qualityRef.current = nextQuality;
          applyQuality();
        }
        performanceRef.current.lastAdjust = timestamp;
      }

      const pointer = pointerRef.current;
      pointer.x += (pointer.targetX - pointer.x) * 0.15;
      pointer.y += (pointer.targetY - pointer.y) * 0.15;

      const nx = (pointer.x / width - 0.5) * 2;
      const ny = (pointer.y / height - 0.5) * 2;
      const parallax = parallaxRef.current;
      const parallaxEase = lowEndDevice ? 0.035 : 0.055;
      const pxTarget = prefersReducedMotion ? 0 : nx;
      const pyTarget = prefersReducedMotion ? 0 : ny;
      parallax.x += (pxTarget - parallax.x) * parallaxEase;
      parallax.y += (pyTarget - parallax.y) * parallaxEase;

      root.style.setProperty("--space-parallax-x", `${parallax.x}`);
      root.style.setProperty("--space-parallax-y", `${parallax.y}`);

      ctx.clearRect(0, 0, width, height);

      const now = timestamp * 0.001;
      const ambientStars = ambientRef.current;
      for (let i = 0; i < ambientStars.length; i += 1) {
        const star = ambientStars[i];
        star.x += star.vx * delta;
        star.y += star.vy * delta;

        if (star.x < -20) star.x = width + 20;
        if (star.x > width + 20) star.x = -20;
        if (star.y < -20) star.y = height + 20;
        if (star.y > height + 20) star.y = -20;

        const twinkle = star.alpha * (0.62 + Math.sin(now * star.twinkle + star.phase) * 0.38);
        const px = star.x - parallax.x * 18 * star.depth;
        const py = star.y - parallax.y * 18 * star.depth;

        ctx.beginPath();
        ctx.fillStyle = `rgba(186, 210, 252, ${twinkle})`;
        ctx.shadowColor = `rgba(130, 170, 255, ${twinkle * 0.86})`;
        ctx.shadowBlur = 8 * star.size;
        ctx.arc(px, py, star.size, 0, Math.PI * 2);
        ctx.fill();
      }

      const trail = trailRef.current;
      for (let i = trail.length - 1; i >= 0; i -= 1) {
        const particle = trail[i];
        particle.vx += Math.sin(now * particle.twinkle + particle.phase) * particle.turbulence;
        particle.vy += Math.cos(now * particle.twinkle + particle.phase * 1.3) * particle.turbulence;
        particle.vx *= particle.friction;
        particle.vy *= particle.friction;
        particle.x += particle.vx * delta;
        particle.y += particle.vy * delta;
        particle.life += delta;

        const lifeProgress = particle.life / particle.ttl;
        if (lifeProgress >= 1) {
          trail.splice(i, 1);
          continue;
        }

        const twinkleFactor = 0.78 + Math.sin(now * particle.twinkle + particle.phase) * 0.22;
        const alpha = (1 - lifeProgress) * twinkleFactor;
        const size = particle.size * (0.45 + alpha * 0.72);
        const glowBoost = particle.spark ? 1.42 : 1;

        ctx.beginPath();
        ctx.fillStyle = `rgba(175, 212, ${particle.blueBoost.toFixed(0)}, ${alpha})`;
        ctx.shadowColor = `rgba(136, 195, 255, ${Math.min(alpha * 1.3, 1)})`;
        ctx.shadowBlur = (8 + size * 7) * glowBoost;
        ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.shadowBlur = 0;
      frameRef.current = requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave, { passive: true });
    frameRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      cancelAnimationFrame(frameRef.current);
      root.style.removeProperty("--space-parallax-x");
      root.style.removeProperty("--space-parallax-y");
      delete root.dataset.spacePerf;
    };
  }, []);

  return (
    <div className="space-scene" aria-hidden>
      <div className="deep-space-base" />
      <div className="nebula-layer" />
      <div className="nebula-cloud-layer" />
      <div className="distant-starfield" />
      <canvas ref={canvasRef} className="space-interactive-canvas" />
      <div className="film-grain" />
      <div className="space-vignette" />
    </div>
  );
}
