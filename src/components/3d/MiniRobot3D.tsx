import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface MiniRobot3DProps {
  isThinking?: boolean;
  isSpeaking?: boolean;
  size?: number;
}

export const MiniRobot3D: React.FC<MiniRobot3DProps> = ({
  isThinking = false,
  isSpeaking = false,
  size = 140
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = size;
    const height = size;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.8, 4.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xFFF8EE, 1.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xFFF0D0, 2.2);
    keyLight.position.set(3, 4, 3);
    scene.add(keyLight);

    const tealLight = new THREE.PointLight(0x159A9C, 2.0, 10);
    tealLight.position.set(-2, 1, 2);
    scene.add(tealLight);

    // Robot Avatar Group
    const robot = new THREE.Group();
    scene.add(robot);

    // Head
    const headGeo = new THREE.SphereGeometry(0.85, 32, 32);
    const headMat = new THREE.MeshStandardMaterial({
      color: 0xFFFFFF,
      roughness: 0.15,
      metalness: 0.1
    });
    const head = new THREE.Mesh(headGeo, headMat);
    robot.add(head);

    // Visor
    const visorGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.4, 32, 1, false, 0, Math.PI);
    const visorMat = new THREE.MeshStandardMaterial({
      color: 0x131B3D,
      roughness: 0.1,
      metalness: 0.8
    });
    const visor = new THREE.Mesh(visorGeo, visorMat);
    visor.rotation.y = -Math.PI / 2;
    visor.position.set(0, 0.05, 0.45);
    robot.add(visor);

    // Cyan Eyes
    const eyeGeo = new THREE.CapsuleGeometry ? new THREE.CapsuleGeometry(0.08, 0.16, 4, 8) : new THREE.CylinderGeometry(0.08, 0.08, 0.25, 8);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x26B9BB });

    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.rotation.z = Math.PI / 2;
    leftEye.position.set(-0.24, 0.08, 0.9);
    robot.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.rotation.z = Math.PI / 2;
    rightEye.position.set(0.24, 0.08, 0.9);
    robot.add(rightEye);

    // Golden Halo Ring
    const haloGeo = new THREE.TorusGeometry(1.15, 0.035, 16, 48);
    const haloMat = new THREE.MeshBasicMaterial({ color: 0xF2A900 });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.rotation.x = Math.PI / 2.3;
    halo.position.set(0, 0.8, 0);
    robot.add(halo);

    // Animation Loop
    let animationId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      if (document.hidden) return;

      const t = clock.getElapsedTime();

      // Floating oscillation
      robot.position.y = Math.sin(t * 2) * 0.08;

      if (isThinking) {
        robot.rotation.y = Math.sin(t * 4) * 0.3;
        halo.rotation.z = t * 4;
        eyeMat.color.setHex(0xF2A900); // Amber when thinking
      } else if (isSpeaking) {
        robot.rotation.y = Math.sin(t * 2) * 0.15;
        halo.rotation.z = t * 1.5;
        eyeMat.color.setHex(0x159A9C); // Teal pulsing when speaking
        robot.scale.setScalar(1.0 + Math.sin(t * 8) * 0.03);
      } else {
        robot.rotation.y = Math.sin(t * 0.8) * 0.12;
        halo.rotation.z = t * 0.5;
        eyeMat.color.setHex(0x26B9BB);
        robot.scale.setScalar(1.0);
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isThinking, isSpeaking, size]);

  return <div ref={mountRef} className="inline-block" style={{ width: size, height: size }} />;
};
