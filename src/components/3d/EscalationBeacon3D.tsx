import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface EscalationBeacon3DProps {
  size?: number;
}

export const EscalationBeacon3D: React.FC<EscalationBeacon3DProps> = ({ size = 160 }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = size;
    const height = size;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 1.6);
    scene.add(ambientLight);

    const light = new THREE.DirectionalLight(0xD9534F, 2.5);
    light.position.set(2, 4, 3);
    scene.add(light);

    // Human Support Beacon / Tower
    const beaconGroup = new THREE.Group();
    scene.add(beaconGroup);

    // Pedestal
    const baseGeo = new THREE.CylinderGeometry(0.8, 1.0, 0.3, 24);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x202A5A, roughness: 0.3 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = -0.8;
    beaconGroup.add(base);

    // Glowing Saffron / Coral Core Gem
    const gemGeo = new THREE.OctahedronGeometry(0.65, 0);
    const gemMat = new THREE.MeshStandardMaterial({
      color: 0xF2A900,
      emissive: 0xF2A900,
      emissiveIntensity: 0.5,
      roughness: 0.2
    });
    const gem = new THREE.Mesh(gemGeo, gemMat);
    beaconGroup.add(gem);

    // Pulsing signal rings
    const ringGeo = new THREE.RingGeometry(0.9, 1.0, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x159A9C, side: THREE.DoubleSide, transparent: true, opacity: 0.8 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    beaconGroup.add(ring);

    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (document.hidden) return;

      const t = clock.getElapsedTime();
      gem.rotation.y = t * 1.5;
      gem.rotation.z = Math.sin(t) * 0.3;
      beaconGroup.position.y = Math.sin(t * 2) * 0.08;

      const scale = 1.0 + (Math.sin(t * 4) + 1) * 0.25;
      ring.scale.set(scale, scale, scale);
      ringMat.opacity = Math.max(0.1, 1 - (scale - 1) * 2);

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
