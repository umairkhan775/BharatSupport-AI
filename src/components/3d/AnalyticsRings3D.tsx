import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface AnalyticsRings3DProps {
  size?: number;
}

export const AnalyticsRings3D: React.FC<AnalyticsRings3DProps> = ({ size = 160 }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = size;
    const height = size;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 1.8);
    scene.add(ambientLight);

    const group = new THREE.Group();
    scene.add(group);

    // 3 Concentric nested holographic data rings
    const ring1 = new THREE.Mesh(
      new THREE.TorusGeometry(1.2, 0.04, 16, 48),
      new THREE.MeshBasicMaterial({ color: 0xF2A900 })
    );
    group.add(ring1);

    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(0.85, 0.04, 16, 48),
      new THREE.MeshBasicMaterial({ color: 0x159A9C })
    );
    group.add(ring2);

    const ring3 = new THREE.Mesh(
      new THREE.TorusGeometry(0.5, 0.04, 16, 48),
      new THREE.MeshBasicMaterial({ color: 0x202A5A })
    );
    group.add(ring3);

    // Central Data Core
    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.25, 0),
      new THREE.MeshStandardMaterial({ color: 0x159A9C, emissive: 0x159A9C, emissiveIntensity: 0.8 })
    );
    group.add(core);

    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (document.hidden) return;

      const t = clock.getElapsedTime();
      ring1.rotation.x = t * 0.8;
      ring1.rotation.y = t * 0.5;
      ring2.rotation.y = -t * 1.1;
      ring2.rotation.z = t * 0.7;
      ring3.rotation.x = -t * 0.9;
      ring3.rotation.z = -t * 0.4;
      core.rotation.y = t * 2;
      group.position.y = Math.sin(t * 1.8) * 0.06;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [size]);

  return <div ref={mountRef} className="inline-block" style={{ width: size, height: size }} />;
};
