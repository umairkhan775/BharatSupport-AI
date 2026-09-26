import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface KnowledgeOrb3DProps {
  size?: number;
}

export const KnowledgeOrb3D: React.FC<KnowledgeOrb3DProps> = ({ size = 160 }) => {
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

    const dirLight = new THREE.DirectionalLight(0xF2A900, 2.5);
    dirLight.position.set(3, 4, 3);
    scene.add(dirLight);

    const tealLight = new THREE.PointLight(0x159A9C, 2.0, 10);
    tealLight.position.set(-3, -2, 2);
    scene.add(tealLight);

    // Knowledge Orb Center (Stylized Icosahedron with Wireframe Brain)
    const orbGroup = new THREE.Group();
    scene.add(orbGroup);

    const coreGeo = new THREE.IcosahedronGeometry(0.9, 1);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x202A5A,
      roughness: 0.2,
      metalness: 0.8,
      wireframe: true,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    orbGroup.add(coreMesh);

    const innerCoreGeo = new THREE.SphereGeometry(0.6, 24, 24);
    const innerCoreMat = new THREE.MeshStandardMaterial({
      color: 0xF2A900,
      emissive: 0xF2A900,
      emissiveIntensity: 0.6,
      roughness: 0.3
    });
    const innerCore = new THREE.Mesh(innerCoreGeo, innerCoreMat);
    orbGroup.add(innerCore);

    // Orbiting rings
    const ring1Geo = new THREE.TorusGeometry(1.4, 0.03, 16, 48);
    const ring1Mat = new THREE.MeshBasicMaterial({ color: 0x159A9C });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    orbGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(1.6, 0.025, 16, 48);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0xF2A900 });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = Math.PI / 2.5;
    orbGroup.add(ring2);

    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (document.hidden) return;

      const t = clock.getElapsedTime();
      coreMesh.rotation.y = t * 0.5;
      coreMesh.rotation.x = t * 0.3;
      ring1.rotation.y = t * 0.8;
      ring1.rotation.z = Math.sin(t * 0.5) * 0.4;
      ring2.rotation.z = -t * 0.6;
      orbGroup.position.y = Math.sin(t * 1.5) * 0.08;

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
