import React, { useEffect, useRef, useState } from 'react';

/**
 * Star3DHero: Signature 3D LevelUp Faceted Star (Hero only).
 * - 5-point star, 10 front triangles with raised center vertex, mirrored back (10 back triangles).
 * - flatShading, MeshStandardMaterial in site's purples (top point lighter).
 * - Key light from the top-left, slow idle rotation + pointer tilt (damped).
 * - Self-hosted Three.js ES module imported dynamically from /assets/js/vendor/three.module.js.
 * - Loaded lazily after window 'load' event and idle callback, only when hero is visible.
 * - Immediate inline SVG star fallback / poster; smooth swap when 3D scene is ready.
 * - Guards against reduced-motion, saveData, low memory (<= 2), WebGL missing, small viewports.
 * - Pauses rendering when off-screen or tab is hidden. Cap devicePixelRatio at 2. aria-hidden.
 */
export default function Star3DHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [is3DReady, setIs3DReady] = useState(false);
  const [canLoad3D, setCanLoad3D] = useState(false);

  // Check client capabilities and guards
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Reduced motion check
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // 2. Data saver check
    const nav = navigator as any;
    if (nav.connection?.saveData === true) return;

    // 3. Low memory device check (2GB or less)
    if (nav.deviceMemory && nav.deviceMemory <= 2) return;

    // 4. Viewport check (must not be very small)
    if (window.innerWidth < 768) return;

    // 5. WebGL availability check
    try {
      const c = document.createElement('canvas');
      const gl = c.getContext('webgl2') || c.getContext('webgl') || c.getContext('experimental-webgl');
      if (!gl) return;
    } catch {
      return;
    }

    // Schedule load after page load & idle
    let isCancelled = false;

    const schedule = () => {
      const onIdle = () => {
        if (!isCancelled) {
          setCanLoad3D(true);
        }
      };

      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(onIdle, { timeout: 2500 });
      } else {
        setTimeout(onIdle, 1000);
      }
    };

    if (document.readyState === 'complete') {
      schedule();
    } else {
      window.addEventListener('load', schedule, { once: true });
    }

    return () => {
      isCancelled = true;
    };
  }, []);

  // Initialize Three.js scene once canLoad3D is true and component is visible
  useEffect(() => {
    if (!canLoad3D || !containerRef.current || !canvasRef.current) return;

    let isDisposed = false;
    let animId: number | null = null;
    let isRendering = false;
    let renderer: any = null;
    let scene: any = null;
    let camera: any = null;
    let starMesh: any = null;

    let currentRotX = 0;
    let currentRotY = 0;
    let targetRotX = 0;
    let targetRotY = 0;

    // IntersectionObserver to only load & render when visible
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          if (!isRendering && renderer) {
            isRendering = true;
            tick();
          }
        } else {
          isRendering = false;
          if (animId) cancelAnimationFrame(animId);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);

    // Tab visibility handling
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        isRendering = false;
        if (animId) cancelAnimationFrame(animId);
      } else if (containerRef.current) {
        isRendering = true;
        tick();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // Pointer move listener for tilt
    const handlePointerMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth) * 2 - 1;
      const y = (e.clientY / innerHeight) * 2 - 1;
      targetRotY = x * 0.45;
      targetRotX = -y * 0.35;
    };
    window.addEventListener('mousemove', handlePointerMove, { passive: true });

    // Dynamic import Three.js from self-hosted vendor file
    const initThree = async () => {
      try {
        // Self-hosted ES module
        // @ts-ignore
        const THREE = await import(/* @vite-ignore */ '/assets/js/vendor/three.module.js');

        if (isDisposed || !canvasRef.current || !containerRef.current) return;

        const width = 110;
        const height = 110;

        // Scene & Camera
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
        camera.position.set(0, 0, 3.8);

        // Renderer
        renderer = new THREE.WebGLRenderer({
          canvas: canvasRef.current,
          alpha: true,
          antialias: true,
          powerPreference: 'low-power',
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

        // Geometry: 5-point star
        // Perimeter 10 vertices
        // In icon.svg coordinates centered at (50, 50), scale factor 1/44
        const perimeter2D = [
          [-0.24, 0.33],   // 0: Inner Top-Left
          [0.0, 1.0],      // 1: Top Tip (highest point)
          [0.24, 0.33],    // 2: Inner Top-Right
          [0.951, 0.309],  // 3: Right Tip
          [0.389, -0.126], // 4: Inner Bottom-Right
          [0.588, -0.809], // 5: Bottom-Right Tip
          [0.0, -0.409],   // 6: Inner Bottom
          [-0.588, -0.809],// 7: Bottom-Left Tip
          [-0.389, -0.126],// 8: Inner Bottom-Left
          [-0.951, 0.309], // 9: Left Tip
        ];

        const frontZ = 0.32;
        const backZ = -0.32;

        const positions: number[] = [];
        const colors: number[] = [];

        // Color definitions for facets (purples, top point lighter)
        const cLightHighlight = new THREE.Color('#DDD6FE'); // #DDD6FE top-left highlight
        const cLightPurple = new THREE.Color('#C4B5FD');
        const cSoftPurple = new THREE.Color('#A78BFA');
        const cBrandViolet = new THREE.Color('#7C3AED');
        const cDeepViolet = new THREE.Color('#6D28D9');
        const cDarkPurple = new THREE.Color('#581C87');
        const cDeepShadow = new THREE.Color('#4C1D95');

        // Helper to get facet color based on perimeter index
        const getFacetColor = (idx: number, isFront: boolean) => {
          if (idx === 0) return cLightHighlight; // Top-Left arm
          if (idx === 1) return cLightPurple;    // Top-Right arm
          if (idx === 2 || idx === 3) return isFront ? cSoftPurple : cBrandViolet;
          if (idx === 4 || idx === 5) return isFront ? cBrandViolet : cDarkPurple;
          if (idx === 6 || idx === 7) return isFront ? cDeepViolet : cDeepShadow;
          if (idx === 8) return isFront ? cBrandViolet : cDeepViolet;
          return isFront ? cSoftPurple : cBrandViolet; // idx === 9 (Left Tip)
        };

        // 10 Front Triangles: (CenterFront, perimeter[i], perimeter[(i+1)%10])
        for (let i = 0; i < 10; i++) {
          const nextI = (i + 1) % 10;
          const p1 = perimeter2D[i];
          const p2 = perimeter2D[nextI];

          // Center Front
          positions.push(0, 0, frontZ);
          // Vertex 1
          positions.push(p1[0], p1[1], 0);
          // Vertex 2
          positions.push(p2[0], p2[1], 0);

          const col = getFacetColor(i, true);
          colors.push(col.r, col.g, col.b);
          colors.push(col.r, col.g, col.b);
          colors.push(col.r, col.g, col.b);
        }

        // 10 Back Triangles: (CenterBack, perimeter[(i+1)%10], perimeter[i]) (reversed winding)
        for (let i = 0; i < 10; i++) {
          const nextI = (i + 1) % 10;
          const p1 = perimeter2D[i];
          const p2 = perimeter2D[nextI];

          // Center Back
          positions.push(0, 0, backZ);
          // Vertex 2
          positions.push(p2[0], p2[1], 0);
          // Vertex 1
          positions.push(p1[0], p1[1], 0);

          const col = getFacetColor(i, false);
          colors.push(col.r, col.g, col.b);
          colors.push(col.r, col.g, col.b);
          colors.push(col.r, col.g, col.b);
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        geometry.computeVertexNormals();

        // Material: MeshStandardMaterial with flatShading
        const material = new THREE.MeshStandardMaterial({
          vertexColors: true,
          flatShading: true,
          roughness: 0.32,
          metalness: 0.15,
        });

        starMesh = new THREE.Mesh(geometry, material);
        scene.add(starMesh);

        // Lights: Key light from top-left
        const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
        keyLight.position.set(-2.5, 3.5, 4.0);
        scene.add(keyLight);

        // Ambient light in soft deep purple
        const ambientLight = new THREE.AmbientLight(0x3b0764, 1.2);
        scene.add(ambientLight);

        // Fill light from bottom right
        const fillLight = new THREE.DirectionalLight(0x7c3aed, 1.4);
        fillLight.position.set(3.0, -2.0, 2.0);
        scene.add(fillLight);

        // Render first frame and signal ready
        renderer.render(scene, camera);
        setIs3DReady(true);
        isRendering = true;
        tick();
      } catch (err) {
        console.warn('3D Star skipped or failed to load:', err);
      }
    };

    const tick = () => {
      if (isDisposed || !isRendering || !renderer || !scene || !camera || !starMesh) return;

      // Slow rotation + damped mouse tilt
      currentRotY += (targetRotY - currentRotY) * 0.05 + 0.007;
      currentRotX += (targetRotX - currentRotX) * 0.05;

      starMesh.rotation.y = currentRotY;
      starMesh.rotation.x = currentRotX;

      renderer.render(scene, camera);
      animId = requestAnimationFrame(tick);
    };

    initThree();

    return () => {
      isDisposed = true;
      isRendering = false;
      if (animId) cancelAnimationFrame(animId);
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('mousemove', handlePointerMove);

      if (renderer) {
        renderer.dispose();
      }
      if (starMesh) {
        starMesh.geometry?.dispose();
        starMesh.material?.dispose();
      }
    };
  }, [canLoad3D]);

  return (
    <div
      ref={containerRef}
      className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center select-none"
      title="LevelUp Ecosystem"
    >
      {/* Fallback & Poster: Immediate SVG Star (Never causes LCP delay) */}
      <svg
        className={`w-full h-full transition-opacity duration-700 pointer-events-none drop-shadow-[0_8px_24px_rgba(124,58,237,0.35)] ${
          is3DReady ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}
        viewBox="0 0 100 100"
        fill="none"
        aria-hidden="true"
      >
        <!-- Arm 0: Top -->
        <polygon points="50,50 39.42,35.44 50,6" fill="#DDD6FE" />
        <polygon points="50,50 50,6 60.58,35.44" fill="#8B5CF6" />
        <!-- Arm 1: Right -->
        <polygon points="50,50 60.58,35.44 91.85,36.4" fill="#7C3AED" />
        <polygon points="50,50 91.85,36.4 67.12,55.56" fill="#581C87" />
        <!-- Arm 2: Bottom-Right -->
        <polygon points="50,50 67.12,55.56 75.86,85.6" fill="#4C1D95" />
        <polygon points="50,50 75.86,85.6 50,68" fill="#3B0764" />
        <!-- Arm 3: Bottom-Left -->
        <polygon points="50,50 50,68 24.14,85.6" fill="#581C87" />
        <polygon points="50,50 24.14,85.6 32.88,55.56" fill="#7C3AED" />
        <!-- Arm 4: Left -->
        <polygon points="50,50 32.88,55.56 8.15,36.4" fill="#8B5CF6" />
        <polygon points="50,50 8.15,36.4 39.42,35.44" fill="#C4B5FD" />
      </svg>

      {/* 3D Canvas (aria-hidden, swaps in smoothly) */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={`absolute inset-0 w-full h-full transition-opacity duration-700 cursor-grab active:cursor-grabbing ${
          is3DReady ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
        }`}
      />
    </div>
  );
}
