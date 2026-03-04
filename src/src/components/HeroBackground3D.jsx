import { useEffect, useRef } from "react";
import * as THREE from "three";

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export default function HeroBackground3D() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) {
      return undefined;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 100);
    camera.position.set(0.2, 0.4, 8.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    mount.appendChild(renderer.domElement);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lowPowerDevice =
      (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
      (navigator.deviceMemory && navigator.deviceMemory <= 4);
    const heavyEffectsEnabled = !(prefersReducedMotion || lowPowerDevice);

    const ambient = new THREE.AmbientLight(0x6a8cff, 0.35);
    scene.add(ambient);

    const keyLight = new THREE.PointLight(0xffb26a, 18, 22, 2.3);
    keyLight.position.set(2.8, 2.4, 3.8);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0x66a3ff, 12, 24, 2);
    fillLight.position.set(-3.4, -1.6, 3.4);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xc7d8ff, 0.65);
    rimLight.position.set(-1.1, 2.1, 4.6);
    scene.add(rimLight);

    const group = new THREE.Group();
    scene.add(group);

    const specs = [
      { size: [2.1, 2.1, 2.1], pos: [-1.7, 1.2, -1.2], color: 0x1c2e46, emissive: 0x10243f },
      { size: [2.5, 1.8, 2.2], pos: [1.4, 0.3, -1.7], color: 0x37271f, emissive: 0x4c2f1b },
      { size: [2.4, 2.4, 2.4], pos: [0.4, -2.1, -2.7], color: 0x0f1424, emissive: 0x0d182d },
      { size: [1.6, 1.6, 1.6], pos: [2.6, -1.4, -0.6], color: 0x12182b, emissive: 0x121f33 },
    ];

    const cubes = specs.slice(0, heavyEffectsEnabled ? specs.length : 2).map((spec) => {
      const geometry = new THREE.BoxGeometry(...spec.size);
      const material = new THREE.MeshStandardMaterial({
        color: spec.color,
        roughness: 0.33,
        metalness: 0.26,
        emissive: spec.emissive,
        emissiveIntensity: 0.42,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(...spec.pos);
      mesh.rotation.set(
        Math.random() * 0.34,
        Math.random() * Math.PI * 0.8,
        Math.random() * 0.24
      );
      group.add(mesh);
      return mesh;
    });

    const orb = new THREE.Mesh(
      new THREE.SphereGeometry(0.46, 26, 26),
      new THREE.MeshBasicMaterial({ color: 0xffc886 })
    );
    orb.position.set(2.2, 1.7, 0.45);
    scene.add(orb);

    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    let raf = 0;

    const onPointerMove = (event) => {
      const rect = mount.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      pointer.tx = clamp(x * 2, -1, 1);
      pointer.ty = clamp(y * 2, -1, 1);
    };

    const onPointerLeave = () => {
      pointer.tx = 0;
      pointer.ty = 0;
    };

    const resize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      const dpr = clamp(window.devicePixelRatio || 1, 1, 1.8);
      renderer.setPixelRatio(dpr);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const renderFrame = (time) => {
      const t = time * 0.001;
      pointer.x += (pointer.tx - pointer.x) * 0.06;
      pointer.y += (pointer.ty - pointer.y) * 0.06;

      group.rotation.y = pointer.x * 0.24 + t * 0.09;
      group.rotation.x = pointer.y * 0.13 + Math.sin(t * 0.26) * 0.04;
      group.position.y = Math.sin(t * 0.42) * 0.12;

      cubes.forEach((cube, index) => {
        cube.rotation.x += 0.0016 + index * 0.00035;
        cube.rotation.y += 0.0022 + index * 0.0005;
      });

      orb.position.y = 1.7 + Math.sin(t * 0.8) * 0.14;
      orb.position.x = 2.2 + Math.cos(t * 0.55) * 0.1;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(renderFrame);
    };

    resize();
    window.addEventListener("resize", resize);

    if (heavyEffectsEnabled) {
      mount.addEventListener("pointermove", onPointerMove, { passive: true });
      mount.addEventListener("pointerleave", onPointerLeave, { passive: true });
      raf = requestAnimationFrame(renderFrame);
    } else {
      renderer.render(scene, camera);
    }

    return () => {
      window.removeEventListener("resize", resize);
      mount.removeEventListener("pointermove", onPointerMove);
      mount.removeEventListener("pointerleave", onPointerLeave);
      cancelAnimationFrame(raf);

      cubes.forEach((cube) => {
        cube.geometry.dispose();
        cube.material.dispose();
      });
      orb.geometry.dispose();
      orb.material.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="hero-three-canvas" aria-hidden />;
}
