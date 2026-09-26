import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface TicketHologram3DProps {
  size?: number;
}

export const TicketHologram3D: React.FC<TicketHologram3DProps> = ({ size = 160 }) => {
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

    const light = new THREE.DirectionalLight(0xF2A900, 2.0);
    light.position.set(2, 3, 2);
    scene.add(light);

    // Floating Ticket / Digital Pass geometry
    const ticketGroup = new THREE.Group();
    scene.add(ticketGroup);

    // Main Ticket Card
    const cardGeo = new THREE.BoxGeometry(1.4, 2.0, 0.08);
    const cardMat = new THREE.MeshStandardMaterial({
      color: 0x202A5A,
      roughness: 0.2,
      metalness: 0.5
    });
    const card = new THREE.Mesh(cardGeo, cardMat);
    ticketGroup.add(card);

    // Saffron Header Stripe
    const stripeGeo = new THREE.BoxGeometry(1.41, 0.4, 0.09);
    const stripeMat = new THREE.MeshStandardMaterial({
      color: 0xF2A900,
      roughness: 0.3
    });
    const stripe = new THREE.Mesh(stripeGeo, stripeMat);
    stripe.position.y = 0.75;
    ticketGroup.add(stripe);

    // Glowing QR/Verification Chip
    const chipGeo = new THREE.BoxGeometry(0.35, 0.35, 0.1);
    const chipMat = new THREE.MeshBasicMaterial({ color: 0x159A9C });
    const chip = new THREE.Mesh(chipGeo, chipMat);
    chip.position.set(-0.35, 0.1, 0.04);
    ticketGroup.add(chip);

    // Hologram aura rings
    const ringGeo = new THREE.TorusGeometry(1.3, 0.02, 16, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x159A9C });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ticketGroup.add(ring);

    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (document.hidden) return;

      const t = clock.getElapsedTime();
      ticketGroup.rotation.y = Math.sin(t * 1.2) * 0.4;
      ticketGroup.rotation.x = Math.cos(t * 0.8) * 0.2;
      ticketGroup.position.y = Math.sin(t * 2) * 0.08;
      ring.rotation.z = t * 1.5;

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
