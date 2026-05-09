'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ── Renderer ──────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    // ── Scene & Camera ────────────────────────────────────────
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // ── Floating Particles ────────────────────────────────────
    const PARTICLE_COUNT = 320;
    const positions  = new Float32Array(PARTICLE_COUNT * 3);
    const velocities: { vx: number; vy: number; vz: number }[] = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      velocities.push({
        vx: (Math.random() - 0.5) * 0.003,
        vy: (Math.random() - 0.5) * 0.003,
        vz: (Math.random() - 0.5) * 0.001,
      });
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0x818cf8,       // indigo-400
      size: 0.06,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // ── Connection Lines ──────────────────────────────────────
    const lineGeo = new THREE.BufferGeometry();
    const MAX_LINES = 600;
    const linePos = new Float32Array(MAX_LINES * 6);
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePos, 3));

    const lineMat = new THREE.LineSegments(
      lineGeo,
      new THREE.LineBasicMaterial({ color: 0x5b5ef4, transparent: true, opacity: 0.18 })
    );
    scene.add(lineMat);

    // ── Glowing Rings ─────────────────────────────────────────
    const rings: THREE.Mesh[] = [];
    const RING_DATA = [
      { r: 2.2, y: 0,    color: 0x5b5ef4, speed: 0.003  },
      { r: 3.6, y: -0.5, color: 0x7c3aed, speed: -0.002 },
      { r: 1.4, y: 0.8,  color: 0x10b981, speed: 0.004  },
    ];

    RING_DATA.forEach(({ r, y, color, speed }) => {
      const geo = new THREE.TorusGeometry(r, 0.012, 8, 100);
      const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.22 });
      const ring = new THREE.Mesh(geo, mat);
      ring.position.y = y;
      ring.rotation.x = Math.PI / 2.8;
      ring.userData.speed = speed;
      scene.add(ring);
      rings.push(ring);
    });

    // ── Floating Cubes ────────────────────────────────────────
    const cubes: THREE.Mesh[] = [];
    const CUBE_DATA = [
      { x: -3.5, y:  1.5, z: -2, s: 0.18, color: 0x818cf8, rx: 0.003, ry: 0.005 },
      { x:  3.8, y: -1.8, z: -3, s: 0.14, color: 0xa78bfa, rx: 0.005, ry: 0.003 },
      { x: -4.2, y: -2.2, z: -1, s: 0.12, color: 0x10b981, rx: 0.004, ry: 0.006 },
      { x:  4.0, y:  2.0, z: -2, s: 0.10, color: 0x38bdf8, rx: 0.006, ry: 0.004 },
    ];

    CUBE_DATA.forEach(({ x, y, z, s, color, rx, ry }) => {
      const geo = new THREE.BoxGeometry(s, s, s);
      const mat = new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity: 0.5 });
      const cube = new THREE.Mesh(geo, mat);
      cube.position.set(x, y, z);
      cube.userData = { rx, ry, floatOffset: Math.random() * Math.PI * 2 };
      scene.add(cube);
      cubes.push(cube);
    });

    // ── Mouse Parallax ────────────────────────────────────────
    let mouseX = 0, mouseY = 0;
    const onMouse = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth  - 0.5) * 0.4;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 0.25;
    };
    window.addEventListener('mousemove', onMouse);

    // ── Resize ────────────────────────────────────────────────
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    // ── Animation Loop ────────────────────────────────────────
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Move particles
      const pos = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        pos[i * 3]     += velocities[i].vx;
        pos[i * 3 + 1] += velocities[i].vy;
        pos[i * 3 + 2] += velocities[i].vz;
        // Wrap around bounds
        if (pos[i * 3]     >  10) pos[i * 3]     = -10;
        if (pos[i * 3]     < -10) pos[i * 3]     =  10;
        if (pos[i * 3 + 1] >   7) pos[i * 3 + 1] =  -7;
        if (pos[i * 3 + 1] <  -7) pos[i * 3 + 1] =   7;
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Connection lines between nearby particles
      let lineIdx = 0;
      const lp = lineGeo.attributes.position.array as Float32Array;
      for (let a = 0; a < PARTICLE_COUNT && lineIdx < MAX_LINES; a++) {
        for (let b = a + 1; b < PARTICLE_COUNT && lineIdx < MAX_LINES; b++) {
          const dx = pos[a*3] - pos[b*3];
          const dy = pos[a*3+1] - pos[b*3+1];
          const dz = pos[a*3+2] - pos[b*3+2];
          const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
          if (dist < 2.2) {
            lp[lineIdx*6+0] = pos[a*3];   lp[lineIdx*6+1] = pos[a*3+1]; lp[lineIdx*6+2] = pos[a*3+2];
            lp[lineIdx*6+3] = pos[b*3];   lp[lineIdx*6+4] = pos[b*3+1]; lp[lineIdx*6+5] = pos[b*3+2];
            lineIdx++;
          }
        }
      }
      (lineMat.material as THREE.LineBasicMaterial).opacity = 0.15;
      lineGeo.attributes.position.needsUpdate = true;
      lineGeo.setDrawRange(0, lineIdx * 2);

      // Spin rings
      rings.forEach(ring => { ring.rotation.z += ring.userData.speed; });

      // Float cubes
      cubes.forEach((cube, i) => {
        cube.rotation.x += cube.userData.rx;
        cube.rotation.y += cube.userData.ry;
        cube.position.y += Math.sin(t * 0.6 + cube.userData.floatOffset) * 0.001;
      });

      // Camera parallax
      camera.position.x += (mouseX - camera.position.x) * 0.04;
      camera.position.y += (-mouseY - camera.position.y) * 0.04;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 0,
      }}
    />
  );
}
