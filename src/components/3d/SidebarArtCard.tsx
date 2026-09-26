import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Sparkles, BookOpen, GraduationCap, Award } from 'lucide-react';

interface Education3DShowcaseProps {
  width?: number;
  height?: number;
}

export const Education3DShowcase: React.FC<Education3DShowcaseProps> = ({
  width = 240,
  height = 190,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 1.4, 5.4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);

    // Multi-hue Indian Lighting
    const ambientLight = new THREE.AmbientLight(0xFFF9EE, 1.9);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xFFE8C0, 2.6);
    sunLight.position.set(4, 7, 5);
    sunLight.castShadow = true;
    scene.add(sunLight);

    const tealLight = new THREE.PointLight(0x159A9C, 3.0, 14);
    tealLight.position.set(-3.5, 2, 2.5);
    scene.add(tealLight);

    const saffronLight = new THREE.PointLight(0xF2A900, 2.8, 12);
    saffronLight.position.set(3.5, -1, 2.5);
    scene.add(saffronLight);

    // 3D Education & Knowledge Group
    const eduGroup = new THREE.Group();
    eduGroup.position.set(0, -0.2, 0);
    scene.add(eduGroup);

    // Stack of 3D Books
    const bookMat1 = new THREE.MeshStandardMaterial({ color: 0x159A9C, roughness: 0.3, metalness: 0.2 }); // Indian Teal
    const bookMat2 = new THREE.MeshStandardMaterial({ color: 0xF2A900, roughness: 0.3, metalness: 0.3 }); // Saffron
    const bookMat3 = new THREE.MeshStandardMaterial({ color: 0x69B88A, roughness: 0.4 }); // Soft Green
    const paperMat = new THREE.MeshStandardMaterial({ color: 0xFFFDF7, roughness: 0.6 });

    // Book 1 (Base Book - Teal)
    const b1Cover = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.26, 1.55), bookMat1);
    b1Cover.position.y = -0.55;
    b1Cover.castShadow = true;
    eduGroup.add(b1Cover);

    const b1Pages = new THREE.Mesh(new THREE.BoxGeometry(2.05, 0.2, 1.45), paperMat);
    b1Pages.position.set(0.04, -0.55, 0);
    eduGroup.add(b1Pages);

    // Book 2 (Middle Book - Saffron, slightly angled)
    const b2Group = new THREE.Group();
    b2Group.position.set(0, -0.22, 0);
    b2Group.rotation.y = 0.2;
    eduGroup.add(b2Group);

    const b2Cover = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.24, 1.45), bookMat2);
    b2Cover.castShadow = true;
    b2Group.add(b2Cover);

    const b2Pages = new THREE.Mesh(new THREE.BoxGeometry(1.88, 0.18, 1.35), paperMat);
    b2Pages.position.set(0.03, 0, 0);
    b2Group.add(b2Pages);

    // Book 3 (Top Book - Green, slightly angled)
    const b3Group = new THREE.Group();
    b3Group.position.set(0, 0.08, 0);
    b3Group.rotation.y = -0.16;
    eduGroup.add(b3Group);

    const b3Cover = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.22, 1.35), bookMat3);
    b3Cover.castShadow = true;
    b3Group.add(b3Cover);

    const b3Pages = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.16, 1.25), paperMat);
    b3Pages.position.set(0.03, 0, 0);
    b3Group.add(b3Pages);

    // Academic Graduation Cap (Sitting on top of books)
    const capGroup = new THREE.Group();
    capGroup.position.set(0, 0.55, 0);
    capGroup.rotation.y = 0.38;
    eduGroup.add(capGroup);

    const capMat = new THREE.MeshStandardMaterial({ color: 0x202A5A, roughness: 0.2, metalness: 0.3 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xF2A900, roughness: 0.2, metalness: 0.8 });

    // Cap Skull Base
    const capSkull = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.5, 0.32, 24), capMat);
    capSkull.position.y = -0.05;
    capGroup.add(capSkull);

    // Cap Flat Board (Diamond)
    const capBoard = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.09, 1.55), capMat);
    capBoard.position.y = 0.14;
    capBoard.rotation.y = Math.PI / 4;
    capBoard.castShadow = true;
    capGroup.add(capBoard);

    // Gold Tassel Button & String
    const tasselBtn = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.06, 16), goldMat);
    tasselBtn.position.y = 0.2;
    capGroup.add(tasselBtn);

    const tasselPendant = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 12), goldMat);
    tasselPendant.position.set(0.6, 0.02, 0.6);
    capGroup.add(tasselPendant);

    // Glowing Knowledge Network Orbiting Rings
    const ring1 = new THREE.Mesh(
      new THREE.TorusGeometry(1.85, 0.025, 16, 48),
      new THREE.MeshBasicMaterial({ color: 0x159A9C })
    );
    ring1.rotation.x = Math.PI / 2.8;
    eduGroup.add(ring1);

    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(2.05, 0.02, 16, 48),
      new THREE.MeshBasicMaterial({ color: 0xF2A900 })
    );
    ring2.rotation.x = -Math.PI / 3.2;
    ring2.rotation.y = 0.3;
    eduGroup.add(ring2);

    // Floating Ambient Digital Particle Orbs
    const particleCount = 24;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      particlePos[i * 3] = (Math.random() - 0.5) * 4.5;
      particlePos[i * 3 + 1] = Math.random() * 2.8 - 0.5;
      particlePos[i * 3 + 2] = (Math.random() - 0.5) * 3.5;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particlePoints = new THREE.Points(
      particleGeo,
      new THREE.PointsMaterial({ size: 0.1, color: 0xF2A900, transparent: true, opacity: 0.85 })
    );
    eduGroup.add(particlePoints);

    // Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (document.hidden) return;

      const t = clock.getElapsedTime();
      eduGroup.position.y = -0.2 + Math.sin(t * 1.5) * 0.08;
      eduGroup.rotation.y = Math.sin(t * 0.4) * 0.25;

      ring1.rotation.z = t * 0.6;
      ring2.rotation.z = -t * 0.5;
      particlePoints.rotation.y = t * 0.2;

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
  }, [width, height]);

  return (
    <div
      ref={mountRef}
      className="inline-block drop-shadow-md cursor-pointer hover:scale-105 transition-transform"
      style={{ width, height }}
    />
  );
};

interface SidebarArtCardProps {
  variant?: 'monument' | 'books' | 'support';
}

export const SidebarArtCard: React.FC<SidebarArtCardProps> = ({ variant = 'monument' }) => {
  if (variant === 'books') {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/10 via-white to-amber-500/10 p-3.5 border border-emerald-200/80 shadow-xs group hover:border-bsai-teal transition-all">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 via-bsai-teal to-bsai-indigo text-white flex items-center justify-center text-2xl shadow-sm shrink-0 group-hover:scale-105 transition-transform">
            🎓
          </div>
          <div>
            <div className="text-[11px] font-extrabold text-bsai-indigo leading-tight">
              Study & Schemes
            </div>
            <div className="text-[10px] text-emerald-700 font-bold flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              NSP & Skill India
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-500/10 via-white to-saffron/10 p-3.5 border border-teal-200/80 shadow-xs group hover:border-bsai-saffron transition-all">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 via-bsai-saffron to-bsai-teal text-white flex items-center justify-center text-2xl shadow-sm shrink-0 group-hover:scale-105 transition-transform">
          🇮🇳
        </div>
        <div>
          <div className="text-[11px] font-extrabold text-bsai-indigo leading-tight">
            Digital India AI
          </div>
          <div className="text-[10px] text-bsai-teal font-bold flex items-center gap-1 mt-0.5">
            <Sparkles className="w-3 h-3 text-bsai-saffron" />
            24/7 Citizen Desk
          </div>
        </div>
      </div>
    </div>
  );
};
