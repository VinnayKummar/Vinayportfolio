import { useEffect, useRef } from "react";

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const makeStars = (count, width, height) =>
  Array.from({ length: count }, () => {
    const depth = 0.25 + Math.random() * 0.95;
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      depth,
      size: 0.75 + Math.random() * 2.15 * depth,
      vx: (-2 + Math.random() * 4) * depth,
      vy: (3 + Math.random() * 7) * depth,
      alpha: 0.24 + Math.random() * 0.11,
      twinkle: Math.random() < 0.22,
      twinkleOffset: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.55 + Math.random() * 1.15,
      parallax: 0.25 + Math.random() * 0.95,
    };
  });

const wrap = (value, min, max) => {
  if (value < min) {
    return max;
  }
  if (value > max) {
    return min;
  }
  return value;
};

export default function HeroBackgroundFX({ variant = "starfield" }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || variant !== "starfield") {
      return undefined;
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) {
      return undefined;
    }
    mount.appendChild(canvas);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const isMobile = window.innerWidth <= 900 || !finePointer;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let stars = [];
    let noisePattern = null;
    let frame = 0;
    let lastTime = 0;
    const pointer = { x: 0, y: 0, tx: 0, ty: 0, px: 0, py: 0 };
    const glow = { x: 0, y: 0, tx: 0, ty: 0 };

    const resize = () => {
      width = mount.clientWidth;
      height = mount.clientHeight;
      dpr = clamp(window.devicePixelRatio || 1, 1, 1.7);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = true;

      const density = Math.floor((width * height) / (isMobile ? 12000 : 7800));
      const starCount = isMobile ? clamp(density, 70, 120) : clamp(density, 130, 220);
      stars = makeStars(starCount, width, height);

      const noiseCanvas = document.createElement("canvas");
      const noiseSize = 96;
      noiseCanvas.width = noiseSize;
      noiseCanvas.height = noiseSize;
      const noiseCtx = noiseCanvas.getContext("2d");
      if (noiseCtx) {
        const imageData = noiseCtx.createImageData(noiseSize, noiseSize);
        const data = imageData.data;
        for (let index = 0; index < data.length; index += 4) {
          const value = 126 + Math.floor(Math.random() * 54);
          const alpha = Math.random() < 0.2 ? 28 : 0;
          data[index] = value;
          data[index + 1] = value;
          data[index + 2] = value + 8;
          data[index + 3] = alpha;
        }
        noiseCtx.putImageData(imageData, 0, 0);
        noisePattern = ctx.createPattern(noiseCanvas, "repeat");
      }

      pointer.px = width * 0.5;
      pointer.py = height * 0.5;
      glow.x = width * 0.5;
      glow.y = height * 0.5;
      glow.tx = glow.x;
      glow.ty = glow.y;
    };

    const onPointerMove = (event) => {
      if (!finePointer) {
        return;
      }
      const rect = mount.getBoundingClientRect();
      const nx = (event.clientX - rect.left) / rect.width - 0.5;
      const ny = (event.clientY - rect.top) / rect.height - 0.5;
      pointer.tx = clamp(nx * 2, -1, 1);
      pointer.ty = clamp(ny * 2, -1, 1);
      pointer.px = event.clientX - rect.left;
      pointer.py = event.clientY - rect.top;
      glow.tx = width * 0.5 + pointer.tx * (isMobile ? 22 : 42);
      glow.ty = height * 0.52 + pointer.ty * (isMobile ? 14 : 24);
    };

    const onPointerLeave = () => {
      pointer.tx = 0;
      pointer.ty = 0;
      pointer.px = width * 0.5;
      pointer.py = height * 0.5;
      glow.tx = width * 0.5;
      glow.ty = height * 0.52;
    };

    const drawBaseGradient = (time = 0) => {
      const flowA = Math.sin(time * 0.06);
      const flowB = Math.cos(time * 0.05);

      const base = ctx.createLinearGradient(0, 0, width, height);
      base.addColorStop(0, "rgba(3, 8, 20, 0.96)");
      base.addColorStop(0.46, "rgba(6, 18, 45, 0.92)");
      base.addColorStop(1, "rgba(2, 7, 22, 0.97)");
      ctx.fillStyle = base;
      ctx.fillRect(0, 0, width, height);

      const pool1 = ctx.createRadialGradient(
        width * (0.36 + flowA * 0.035),
        height * (0.42 + flowB * 0.03),
        width * 0.04,
        width * (0.36 + flowA * 0.035),
        height * (0.42 + flowB * 0.03),
        width * 0.52
      );
      pool1.addColorStop(0, "rgba(62, 98, 210, 0.24)");
      pool1.addColorStop(0.54, "rgba(38, 65, 154, 0.14)");
      pool1.addColorStop(1, "rgba(7, 16, 36, 0)");
      ctx.fillStyle = pool1;
      ctx.fillRect(0, 0, width, height);

      const pool2 = ctx.createRadialGradient(
        width * (0.74 + flowB * 0.045),
        height * (0.56 + flowA * 0.04),
        width * 0.03,
        width * (0.74 + flowB * 0.045),
        height * (0.56 + flowA * 0.04),
        width * 0.48
      );
      pool2.addColorStop(0, "rgba(84, 106, 226, 0.14)");
      pool2.addColorStop(0.45, "rgba(58, 78, 162, 0.08)");
      pool2.addColorStop(1, "rgba(9, 16, 34, 0)");
      ctx.fillStyle = pool2;
      ctx.fillRect(0, 0, width, height);
    };

    const drawStars = (time, delta) => {
      for (let index = 0; index < stars.length; index += 1) {
        const star = stars[index];
        star.x = wrap(star.x + star.vx * delta, -5, width + 5);
        star.y = wrap(star.y + star.vy * delta, -5, height + 5);

        const px = star.x - pointer.x * star.parallax * 14;
        const py = star.y - pointer.y * star.parallax * 10;
        let opacity = star.alpha;
        if (star.twinkle) {
          const pulse = 0.82 + Math.sin(time * star.twinkleSpeed + star.twinkleOffset) * 0.18;
          opacity = clamp(star.alpha * pulse, 0.15, 0.35);
        }
        ctx.globalAlpha = opacity;
        ctx.fillStyle = "rgba(216, 235, 255, 1)";
        ctx.beginPath();
        ctx.arc(px, py, star.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const drawCardGlow = () => {
      const spotlight = ctx.createRadialGradient(glow.x, glow.y, width * 0.02, glow.x, glow.y, width * 0.56);
      spotlight.addColorStop(0, "rgba(146, 193, 255, 0.32)");
      spotlight.addColorStop(0.45, "rgba(89, 132, 226, 0.18)");
      spotlight.addColorStop(1, "rgba(16, 29, 58, 0)");
      ctx.fillStyle = spotlight;
      ctx.fillRect(0, 0, width, height);
    };

    const drawNoise = () => {
      if (!noisePattern) {
        return;
      }
      ctx.globalAlpha = 0.06;
      ctx.fillStyle = noisePattern;
      ctx.fillRect(0, 0, width, height);
      ctx.globalAlpha = 1;
    };

    const drawVignette = () => {
      const vignette = ctx.createRadialGradient(
        width * 0.5,
        height * 0.48,
        width * 0.16,
        width * 0.5,
        height * 0.48,
        width * 0.76
      );
      vignette.addColorStop(0, "rgba(6, 14, 34, 0)");
      vignette.addColorStop(1, "rgba(2, 7, 18, 0.56)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);
    };

    const render = (time) => {
      if (!lastTime) {
        lastTime = time;
      }
      const delta = Math.min((time - lastTime) / 1000, 0.034);
      lastTime = time;

      pointer.x += (pointer.tx - pointer.x) * 0.08;
      pointer.y += (pointer.ty - pointer.y) * 0.08;
      glow.x += (glow.tx - glow.x) * 0.06;
      glow.y += (glow.ty - glow.y) * 0.06;

      ctx.clearRect(0, 0, width, height);
      const t = time * 0.001;
      drawBaseGradient(t);
      drawNoise();
      drawStars(t, delta);
      drawCardGlow();
      drawVignette();

      frame = requestAnimationFrame(render);
    };

    resize();

    window.addEventListener("resize", resize);
    if (!reducedMotion) {
      frame = requestAnimationFrame(render);
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("blur", onPointerLeave);
    } else {
      drawBaseGradient(0);
      drawNoise();
      drawStars(0, 0);
      drawCardGlow();
      drawVignette();
    }

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("blur", onPointerLeave);
      if (mount.contains(canvas)) {
        mount.removeChild(canvas);
      }
    };
  }, [variant]);

  return <div ref={mountRef} className="hero-fx-canvas" aria-hidden />;
}
