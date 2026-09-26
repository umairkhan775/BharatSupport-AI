import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  Database,
  Brain,
  BookOpen,
  AlertTriangle,
  LineChart,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Bot,
  GraduationCap,
  Volume2,
  CheckCircle2,
  FileText,
  Zap,
  Radio,
  Clock,
  Inbox,
  User
} from 'lucide-react';
import { BSAIButton } from '../common/BSAIButton';

export interface WorkflowOrbitNode {
  id: string;
  step: number;
  name: string;
  nameHi: string;
  subtitle: string;
  description: string;
  color: string;
  colorHex: number;
  accentHex: number;
  iconName: string;
  targetView: string;
  badge: string;
  details: string[];
}

export const BSAI_WORKFLOW_NODES: WorkflowOrbitNode[] = [
  {
    id: 'orbit-data',
    step: 1,
    name: 'Data Collection',
    nameHi: 'डेटा एकत्रीकरण',
    subtitle: 'Multilingual Ingestion & Voice STT',
    description: 'Captures inquiries across 22 official Indian languages, regional voice dialects, and government portal feeds 24/7.',
    color: '#087F6A',
    colorHex: 0x087F6A,
    accentHex: 0xF2A900,
    iconName: 'Database',
    targetView: 'ai-assistant',
    badge: '22+ Languages',
    details: ['Voice STT in 22 Languages', 'Regional Dialect Parser', 'Government Portal Connectors']
  },
  {
    id: 'orbit-understanding',
    step: 2,
    name: 'AI Understanding',
    nameHi: 'एआई समझ व विश्लेषण',
    subtitle: 'Semantic NLP & Intent Scoring',
    description: 'Analyzes citizen intent, extracts scheme entities, calculates confidence score, and determines resolution route.',
    color: '#159A9C',
    colorHex: 0x159A9C,
    accentHex: 0x16C7C9,
    iconName: 'Brain',
    targetView: 'knowledge-base',
    badge: 'Semantic NLP',
    details: ['Intent Classification', 'Scheme Entity Extraction', 'Urgency Confidence Scoring']
  },
  {
    id: 'orbit-knowledge',
    step: 3,
    name: 'Knowledge & Reasoning',
    nameHi: 'ज्ञान व अध्ययन आधार',
    subtitle: 'Verified Welfare & Study Hub',
    description: 'Queries verified government scheme repositories, scholarship guidelines, and educational study modules.',
    color: '#087F6A',
    colorHex: 0x087F6A,
    accentHex: 0x8DE0C3,
    iconName: 'BookOpen',
    targetView: 'knowledge-base',
    badge: 'Verified DB',
    details: ['NSP & PMKVY Schemes', 'Verified FAQs & Manuals', 'AI Study Tutor Modules']
  },
  {
    id: 'orbit-action',
    step: 4,
    name: 'Action & Escalation',
    nameHi: 'कार्रवाई व मानव हस्तांतरण',
    subtitle: 'Instant Resolution & Handoff',
    description: 'Generates verified instant answers, auto-fills citizen forms, or routes high-priority grievances to District Nodal Officers.',
    color: '#E9785A', // Warm Coral
    colorHex: 0xE9785A,
    accentHex: 0xF4A340,
    iconName: 'AlertTriangle',
    targetView: 'escalations',
    badge: 'District Handoff',
    details: ['Instant Auto-Resolution', 'CPGRAMS Handoff', 'District Officer Routing']
  },
  {
    id: 'orbit-dashboard',
    step: 5,
    name: 'Dashboard & Insights',
    nameHi: 'डैशबोर्ड व लाइव इनसाइट्स',
    subtitle: 'Live Telemetry & Satisfaction',
    description: 'Continuously tracks national resolution speed, citizen feedback ratings, query volumes, and model learning.',
    color: '#6C8FE8',
    colorHex: 0x6C8FE8,
    accentHex: 0x159A9C,
    iconName: 'LineChart',
    targetView: 'analytics',
    badge: 'Live Telemetry',
    details: ['98.4% Resolution Telemetry', 'Citizen Feedback Loops', 'Real-Time Language Trends']
  }
];

interface BSAICycleOrbit3DProps {
  onNavigateView: (view: string) => void;
  onSelectNodeModal?: (node: WorkflowOrbitNode) => void;
  onAskAIQuery?: (query: string) => void;
  onCoreClick?: () => void;
}

export const BSAICycleOrbit3D: React.FC<BSAICycleOrbit3DProps> = ({
  onNavigateView,
  onSelectNodeModal,
  onAskAIQuery,
  onCoreClick,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeNode, setActiveNode] = useState<WorkflowOrbitNode>(BSAI_WORKFLOW_NODES[0]);
  const [hoveredNode, setHoveredNode] = useState<WorkflowOrbitNode | null>(null);
  const [isRotating, setIsRotating] = useState(true);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const nodeMeshesRef = useRef<{ mesh: THREE.Group; data: WorkflowOrbitNode; beam: THREE.Line }[]>([]);
  const coreRobotGroupRef = useRef<THREE.Group | null>(null);
  const orbitGroupRef = useRef<THREE.Group | null>(null);
  const dataPacketsRef = useRef<{ mesh: THREE.Mesh; angle: number; speed: number }[]>([]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 920;
    const height = 580;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera Setup (Generous Perspective for Complete Cycle)
    const camera = new THREE.PerspectiveCamera(44, width / height, 0.1, 100);
    camera.position.set(0, 3.8, 10.2);
    camera.lookAt(0, -0.1, 0);
    cameraRef.current = camera;

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lighting System (Soft Light Green + Deep Emerald + Warm Coral + Saffron Rim)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(6, 9, 7);
    keyLight.castShadow = true;
    scene.add(keyLight);

    // Deep Emerald Atmospheric Fill Light (Left)
    const emeraldFill = new THREE.PointLight(0x087F6A, 2.8, 18);
    emeraldFill.position.set(-6, 3, 4);
    scene.add(emeraldFill);

    // Warm Coral Atmospheric Rim Light (Right)
    const coralRim = new THREE.PointLight(0xE9785A, 2.4, 16);
    coralRim.position.set(6, -2, -3);
    scene.add(coralRim);

    // Soft Mint Core Accent Light
    const corePoint = new THREE.PointLight(0x8DE0C3, 2.2, 10);
    corePoint.position.set(0, 0, 2);
    scene.add(corePoint);

    // Saffron Golden Floor Reflection Light
    const saffronFloor = new THREE.PointLight(0xF2A900, 1.6, 12);
    saffronFloor.position.set(0, -3.5, 2);
    scene.add(saffronFloor);

    // =========================================================================
    // 5. Central 3D BSAI AI Core Robot (The Brain of Bharat Support AI)
    // =========================================================================
    const coreRobotGroup = new THREE.Group();
    coreRobotGroupRef.current = coreRobotGroup;

    // Multi-tier Floating Platform Base with Energy Rings
    const baseCylinder = new THREE.Mesh(
      new THREE.CylinderGeometry(1.8, 2.1, 0.22, 48),
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.12,
        metalness: 0.25,
        transparent: true,
        opacity: 0.95,
      })
    );
    baseCylinder.position.y = -1.6;
    coreRobotGroup.add(baseCylinder);

    const platformGlowTrim = new THREE.Mesh(
      new THREE.TorusGeometry(1.9, 0.045, 16, 64),
      new THREE.MeshBasicMaterial({ color: 0x087F6A })
    );
    platformGlowTrim.rotation.x = Math.PI / 2;
    platformGlowTrim.position.y = -1.55;
    coreRobotGroup.add(platformGlowTrim);

    const secondaryTrim = new THREE.Mesh(
      new THREE.TorusGeometry(2.15, 0.025, 16, 64),
      new THREE.MeshBasicMaterial({ color: 0x159A9C, transparent: true, opacity: 0.6 })
    );
    secondaryTrim.rotation.x = Math.PI / 2;
    secondaryTrim.position.y = -1.58;
    coreRobotGroup.add(secondaryTrim);

    // Robot Main Head (Sleek Pearl White Shell)
    const headGeo = new THREE.SphereGeometry(1.0, 40, 40);
    headGeo.scale(1, 0.96, 0.92);
    const headMat = new THREE.MeshStandardMaterial({
      color: 0xF7FDF9,
      roughness: 0.1,
      metalness: 0.18,
    });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 0;
    head.castShadow = true;
    coreRobotGroup.add(head);

    // Holographic Visor (Deep Emerald/Teal with Luminous Glow)
    const visorGeo = new THREE.CylinderGeometry(0.65, 0.65, 0.3, 36, 1, false, 0, Math.PI);
    const visorMat = new THREE.MeshStandardMaterial({
      color: 0x087F6A,
      emissive: 0x159A9C,
      emissiveIntensity: 1.1,
      roughness: 0.08,
      metalness: 0.85,
    });
    const visor = new THREE.Mesh(visorGeo, visorMat);
    visor.rotation.y = Math.PI / 2;
    visor.rotation.z = Math.PI / 2;
    visor.position.set(0, 0.08, 0.74);
    coreRobotGroup.add(visor);

    // Luminous Mint Eyes
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x8DE0C3 });
    const leftEye = new THREE.Mesh(new THREE.CapsuleGeometry(0.055, 0.1, 8, 16), eyeMat);
    leftEye.rotation.z = Math.PI / 2;
    leftEye.position.set(-0.24, 0.1, 0.94);
    coreRobotGroup.add(leftEye);

    const rightEye = new THREE.Mesh(new THREE.CapsuleGeometry(0.055, 0.1, 8, 16), eyeMat);
    rightEye.rotation.z = Math.PI / 2;
    rightEye.position.set(0.24, 0.1, 0.94);
    coreRobotGroup.add(rightEye);

    // AI Neural Antenna with Saffron Top
    const antennaStem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, 0.45, 16),
      new THREE.MeshStandardMaterial({ color: 0x087F6A, metalness: 0.85 })
    );
    antennaStem.position.set(0, 1.15, 0);
    coreRobotGroup.add(antennaStem);

    const antennaSphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.14, 24, 24),
      new THREE.MeshStandardMaterial({
        color: 0xF2A900,
        emissive: 0xF2A900,
        emissiveIntensity: 0.9,
      })
    );
    antennaSphere.position.set(0, 1.4, 0);
    coreRobotGroup.add(antennaSphere);

    // Dual Rotating Holographic Energy Rings
    const ring1Geo = new THREE.TorusGeometry(1.45, 0.035, 16, 64);
    const ring1Mat = new THREE.MeshBasicMaterial({ color: 0x159A9C, transparent: true, opacity: 0.85 });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 2.7;
    coreRobotGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(1.6, 0.025, 16, 64);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0xF2A900, transparent: true, opacity: 0.65 });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = -Math.PI / 3.2;
    ring2.rotation.y = Math.PI / 4;
    coreRobotGroup.add(ring2);

    coreRobotGroup.userData = { isCore: true };
    scene.add(coreRobotGroup);

    // =========================================================================
    // 6. Continuous Circular Orbit System with 5 Meaningful 3D Nodes
    // =========================================================================
    const orbitGroup = new THREE.Group();
    orbitGroupRef.current = orbitGroup;

    const orbitRadius = 4.3;

    // Primary Luminous Orbit Ring
    const primaryOrbitGeo = new THREE.TorusGeometry(orbitRadius, 0.035, 16, 128);
    const primaryOrbitMat = new THREE.MeshBasicMaterial({
      color: 0x087F6A,
      transparent: true,
      opacity: 0.45,
    });
    const primaryOrbit = new THREE.Mesh(primaryOrbitGeo, primaryOrbitMat);
    primaryOrbit.rotation.x = Math.PI / 2;
    primaryOrbit.position.y = -0.2;
    orbitGroup.add(primaryOrbit);

    // Outer Secondary Pulse Halo
    const outerOrbitGeo = new THREE.TorusGeometry(orbitRadius + 0.45, 0.018, 16, 128);
    const outerOrbitMat = new THREE.MeshBasicMaterial({
      color: 0x159A9C,
      transparent: true,
      opacity: 0.25,
    });
    const outerOrbit = new THREE.Mesh(outerOrbitGeo, outerOrbitMat);
    outerOrbit.rotation.x = Math.PI / 2;
    outerOrbit.position.y = -0.2;
    orbitGroup.add(outerOrbit);

    // Inner Tertiary Track
    const innerOrbitGeo = new THREE.TorusGeometry(orbitRadius - 0.45, 0.015, 16, 128);
    const innerOrbitMat = new THREE.MeshBasicMaterial({
      color: 0x8DE0C3,
      transparent: true,
      opacity: 0.2,
    });
    const innerOrbit = new THREE.Mesh(innerOrbitGeo, innerOrbitMat);
    innerOrbit.rotation.x = Math.PI / 2;
    innerOrbit.position.y = -0.2;
    orbitGroup.add(innerOrbit);

    // Build 5 Distinct 3D Meaningful Nodes
    const nodeMeshes: { mesh: THREE.Group; data: WorkflowOrbitNode; beam: THREE.Line }[] = [];
    const totalNodes = BSAI_WORKFLOW_NODES.length;

    BSAI_WORKFLOW_NODES.forEach((node, i) => {
      const angle = (i / totalNodes) * Math.PI * 2 - Math.PI / 2; // Start from top
      const x = Math.cos(angle) * orbitRadius;
      const z = Math.sin(angle) * orbitRadius;

      const nodeGroup = new THREE.Group();
      nodeGroup.position.set(x, -0.2, z);

      // Node Platform Pod Base
      const podBase = new THREE.Mesh(
        new THREE.CylinderGeometry(0.7, 0.8, 0.15, 32),
        new THREE.MeshStandardMaterial({
          color: 0xffffff,
          roughness: 0.15,
          metalness: 0.2,
          transparent: true,
          opacity: 0.95,
        })
      );
      podBase.position.y = -0.35;
      nodeGroup.add(podBase);

      const podGlowRim = new THREE.Mesh(
        new THREE.TorusGeometry(0.75, 0.035, 16, 48),
        new THREE.MeshBasicMaterial({ color: node.accentHex })
      );
      podGlowRim.rotation.x = Math.PI / 2;
      podGlowRim.position.y = -0.32;
      nodeGroup.add(podGlowRim);

      // Core Glass Luminous Orb
      const orbGeo = new THREE.SphereGeometry(0.48, 32, 32);
      const orbMat = new THREE.MeshStandardMaterial({
        color: node.colorHex,
        roughness: 0.12,
        metalness: 0.3,
        emissive: node.colorHex,
        emissiveIntensity: 0.4,
        transparent: true,
        opacity: 0.92,
      });
      const orb = new THREE.Mesh(orbGeo, orbMat);
      orb.castShadow = true;
      nodeGroup.add(orb);

      // =======================================================================
      // DISTINCT 3D OBJECTS FOR EACH NODE TYPE:
      // =======================================================================
      if (node.step === 1) {
        // NODE 01: DATA COLLECTION -> 3D Stacked Documents + Voice Microphone Wave
        const docGeo = new THREE.BoxGeometry(0.38, 0.05, 0.32);
        const docMat = new THREE.MeshStandardMaterial({ color: 0xF7FDF9, roughness: 0.2 });
        const doc1 = new THREE.Mesh(docGeo, docMat);
        doc1.position.set(0, 0.55, 0);
        doc1.rotation.y = 0.2;
        nodeGroup.add(doc1);

        const doc2 = new THREE.Mesh(docGeo, docMat);
        doc2.position.set(0, 0.62, 0);
        doc2.rotation.y = -0.15;
        nodeGroup.add(doc2);

        // Golden Mic Tip / Signal Orb
        const micSphere = new THREE.Mesh(
          new THREE.SphereGeometry(0.12, 16, 16),
          new THREE.MeshStandardMaterial({ color: 0xF2A900, emissive: 0xF2A900, emissiveIntensity: 0.8 })
        );
        micSphere.position.set(0, 0.82, 0);
        nodeGroup.add(micSphere);
      } else if (node.step === 2) {
        // NODE 02: AI UNDERSTANDING -> 3D Holographic Brain / Neural Lattice
        const brainCore = new THREE.Mesh(
          new THREE.IcosahedronGeometry(0.28, 1),
          new THREE.MeshStandardMaterial({
            color: 0x16C7C9,
            emissive: 0x16C7C9,
            emissiveIntensity: 0.8,
            wireframe: true,
          })
        );
        brainCore.position.set(0, 0.65, 0);
        nodeGroup.add(brainCore);

        const neuralRing = new THREE.Mesh(
          new THREE.TorusGeometry(0.38, 0.02, 16, 32),
          new THREE.MeshBasicMaterial({ color: 0x8DE0C3 })
        );
        neuralRing.rotation.x = Math.PI / 3;
        neuralRing.position.set(0, 0.65, 0);
        nodeGroup.add(neuralRing);
      } else if (node.step === 3) {
        // NODE 03: KNOWLEDGE & REASONING -> 3D Open Book + Graduation Cap
        const bookCover = new THREE.Mesh(
          new THREE.BoxGeometry(0.42, 0.06, 0.34),
          new THREE.MeshStandardMaterial({ color: 0xF7FDF9, roughness: 0.15 })
        );
        bookCover.position.set(0, 0.58, 0);
        nodeGroup.add(bookCover);

        const capBase = new THREE.Mesh(
          new THREE.ConeGeometry(0.24, 0.14, 4),
          new THREE.MeshStandardMaterial({ color: 0x087F6A, roughness: 0.3 })
        );
        capBase.rotation.y = Math.PI / 4;
        capBase.position.set(0, 0.74, 0);
        nodeGroup.add(capBase);

        const tassel = new THREE.Mesh(
          new THREE.SphereGeometry(0.06, 12, 12),
          new THREE.MeshStandardMaterial({ color: 0xF2A900, emissive: 0xF2A900, emissiveIntensity: 0.9 })
        );
        tassel.position.set(0.18, 0.76, 0);
        nodeGroup.add(tassel);
      } else if (node.step === 4) {
        // NODE 04: ACTION & ESCALATION -> 3D Support Shield + Warm Coral Bolt
        const shieldGeo = new THREE.CylinderGeometry(0.24, 0.18, 0.32, 6);
        const shieldMat = new THREE.MeshStandardMaterial({
          color: 0xE9785A,
          emissive: 0xE9785A,
          emissiveIntensity: 0.6,
          metalness: 0.5,
        });
        const shield = new THREE.Mesh(shieldGeo, shieldMat);
        shield.position.set(0, 0.64, 0);
        nodeGroup.add(shield);

        const bolt = new THREE.Mesh(
          new THREE.OctahedronGeometry(0.14),
          new THREE.MeshStandardMaterial({ color: 0xF4A340, emissive: 0xF4A340, emissiveIntensity: 0.9 })
        );
        bolt.position.set(0, 0.88, 0);
        nodeGroup.add(bolt);
      } else if (node.step === 5) {
        // NODE 05: DASHBOARD & INSIGHTS -> 3D Holographic Chart Columns
        const barGeo1 = new THREE.BoxGeometry(0.08, 0.22, 0.08);
        const barGeo2 = new THREE.BoxGeometry(0.08, 0.34, 0.08);
        const barGeo3 = new THREE.BoxGeometry(0.08, 0.44, 0.08);
        const barMat = new THREE.MeshStandardMaterial({
          color: 0x6C8FE8,
          emissive: 0x6C8FE8,
          emissiveIntensity: 0.7,
        });

        const b1 = new THREE.Mesh(barGeo1, barMat);
        b1.position.set(-0.14, 0.61, 0);
        nodeGroup.add(b1);

        const b2 = new THREE.Mesh(barGeo2, barMat);
        b2.position.set(0, 0.67, 0);
        nodeGroup.add(b2);

        const b3 = new THREE.Mesh(barGeo3, barMat);
        b3.position.set(0.14, 0.72, 0);
        nodeGroup.add(b3);
      }

      // Connecting Luminous Ray to Central Core
      const points = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(-x, 0, -z)];
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const lineMat = new THREE.LineBasicMaterial({
        color: node.colorHex,
        transparent: true,
        opacity: 0.35,
      });
      const beamLine = new THREE.Line(lineGeo, lineMat);
      nodeGroup.add(beamLine);

      nodeGroup.userData = { nodeData: node };
      orbitGroup.add(nodeGroup);
      nodeMeshes.push({ mesh: nodeGroup, data: node, beam: beamLine });
    });

    nodeMeshesRef.current = nodeMeshes;
    scene.add(orbitGroup);

    // =========================================================================
    // 7. Continuous Living Data Flow Particles (Traveling along Orbit)
    // =========================================================================
    const packetCount = 14;
    const dataPackets: { mesh: THREE.Mesh; angle: number; speed: number }[] = [];

    const packetColors = [0x087F6A, 0x159A9C, 0x8DE0C3, 0xF2A900, 0xE9785A, 0x6C8FE8];

    for (let i = 0; i < packetCount; i++) {
      const pColor = packetColors[i % packetColors.length];
      const pMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.085, 16, 16),
        new THREE.MeshBasicMaterial({ color: pColor })
      );
      const angle = (i / packetCount) * Math.PI * 2;
      pMesh.position.set(
        Math.cos(angle) * orbitRadius,
        -0.2 + (Math.random() - 0.5) * 0.15,
        Math.sin(angle) * orbitRadius
      );
      orbitGroup.add(pMesh);
      dataPackets.push({
        mesh: pMesh,
        angle,
        speed: 0.008 + Math.random() * 0.004,
      });
    }
    dataPacketsRef.current = dataPackets;

    // =========================================================================
    // 8. Ambient Atmospheric 3D Particles
    // =========================================================================
    const ambientParticleCount = 80;
    const ambGeo = new THREE.BufferGeometry();
    const ambPos = new Float32Array(ambientParticleCount * 3);
    const ambColors = new Float32Array(ambientParticleCount * 3);

    const colorPalette = [
      new THREE.Color(0x087F6A),
      new THREE.Color(0x159A9C),
      new THREE.Color(0xE9785A),
      new THREE.Color(0x8DE0C3),
      new THREE.Color(0xF2A900),
      new THREE.Color(0x6C8FE8),
    ];

    for (let i = 0; i < ambientParticleCount; i++) {
      ambPos[i * 3] = (Math.random() - 0.5) * 18;
      ambPos[i * 3 + 1] = (Math.random() - 0.5) * 10 + 0.5;
      ambPos[i * 3 + 2] = (Math.random() - 0.5) * 12;

      const c = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      ambColors[i * 3] = c.r;
      ambColors[i * 3 + 1] = c.g;
      ambColors[i * 3 + 2] = c.b;
    }

    ambGeo.setAttribute('position', new THREE.BufferAttribute(ambPos, 3));
    ambGeo.setAttribute('color', new THREE.BufferAttribute(ambColors, 3));

    const ambMat = new THREE.PointsMaterial({
      size: 0.14,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
    });
    const ambientField = new THREE.Points(ambGeo, ambMat);
    scene.add(ambientField);

    // =========================================================================
    // 9. Raycasting Pointer Interactivity (Hover & Click)
    // =========================================================================
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-999, -999);

    const handlePointerMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      // Check node meshes
      const interactiveNodeMeshes = nodeMeshes.map((n) => n.mesh);
      const nodeIntersects = raycaster.intersectObjects(interactiveNodeMeshes, true);

      if (nodeIntersects.length > 0) {
        let rootGroup: THREE.Object3D | null = nodeIntersects[0].object;
        while (rootGroup && !rootGroup.userData?.nodeData && rootGroup.parent) {
          rootGroup = rootGroup.parent;
        }
        if (rootGroup && rootGroup.userData?.nodeData) {
          setHoveredNode(rootGroup.userData.nodeData);
          renderer.domElement.style.cursor = 'pointer';
          return;
        }
      }

      // Check Central AI Core
      if (coreRobotGroupRef.current) {
        const coreIntersects = raycaster.intersectObjects(coreRobotGroupRef.current.children, true);
        if (coreIntersects.length > 0) {
          renderer.domElement.style.cursor = 'pointer';
          setHoveredNode(null);
          return;
        }
      }

      setHoveredNode(null);
      renderer.domElement.style.cursor = 'grab';
    };

    const handleClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      // Check node click
      const interactiveNodeMeshes = nodeMeshes.map((n) => n.mesh);
      const nodeIntersects = raycaster.intersectObjects(interactiveNodeMeshes, true);

      if (nodeIntersects.length > 0) {
        let rootGroup: THREE.Object3D | null = nodeIntersects[0].object;
        while (rootGroup && !rootGroup.userData?.nodeData && rootGroup.parent) {
          rootGroup = rootGroup.parent;
        }
        if (rootGroup && rootGroup.userData?.nodeData) {
          const selected = rootGroup.userData.nodeData as WorkflowOrbitNode;
          setActiveNode(selected);
          if (onSelectNodeModal) onSelectNodeModal(selected);
          return;
        }
      }

      // Check Central AI Core click
      if (coreRobotGroupRef.current) {
        const coreIntersects = raycaster.intersectObjects(coreRobotGroupRef.current.children, true);
        if (coreIntersects.length > 0 && onCoreClick) {
          onCoreClick();
        }
      }
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousemove', handlePointerMove);
    domEl.addEventListener('click', handleClick);

    // =========================================================================
    // 10. Animation & Render Loop
    // =========================================================================
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth idle bob for central AI core robot
      if (coreRobotGroupRef.current) {
        coreRobotGroupRef.current.position.y = Math.sin(elapsedTime * 1.8) * 0.12;

        // When a node is hovered, face subtly towards it
        if (hoveredNode || activeNode) {
          const targetNode = hoveredNode || activeNode;
          const targetAngle = (targetNode.step / 5) * Math.PI * 2 - Math.PI / 2;
          const targetRotY = Math.sin(elapsedTime * 0.4) * 0.1 + (targetAngle > 0 ? 0.15 : -0.15);
          coreRobotGroupRef.current.rotation.y = THREE.MathUtils.lerp(
            coreRobotGroupRef.current.rotation.y,
            targetRotY,
            0.05
          );
        } else {
          coreRobotGroupRef.current.rotation.y = Math.sin(elapsedTime * 0.5) * 0.15;
        }
      }

      // Rotate Dual Holographic Rings
      if (ring1) ring1.rotation.z = elapsedTime * 0.75;
      if (ring2) ring2.rotation.z = -elapsedTime * 0.6;

      // Orbit Slow Rotation (if enabled)
      if (orbitGroupRef.current && isRotating) {
        orbitGroupRef.current.rotation.y += 0.003;
      }

      // Continuous Traveling Data Packets along Orbit
      dataPackets.forEach((p) => {
        p.angle += p.speed;
        p.mesh.position.x = Math.cos(p.angle) * orbitRadius;
        p.mesh.position.z = Math.sin(p.angle) * orbitRadius;
        p.mesh.position.y = -0.2 + Math.sin(elapsedTime * 3 + p.angle) * 0.12;
      });

      // Individual Node Hover Lift & Scale
      nodeMeshes.forEach((item) => {
        const isHovered = hoveredNode?.id === item.data.id;
        const isActive = activeNode.id === item.data.id;

        const targetScale = isHovered ? 1.28 : isActive ? 1.15 : 1.0;
        item.mesh.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.12);

        const targetY = (isHovered ? 0.4 : 0) + Math.sin(elapsedTime * 2.2 + item.data.step) * 0.09;
        item.mesh.position.y = targetY;

        // Highlight radial beam to core
        (item.beam.material as THREE.LineBasicMaterial).opacity = isHovered ? 0.9 : isActive ? 0.6 : 0.25;
      });

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth || 920;
      camera.aspect = w / height;
      camera.updateProjectionMatrix();
      renderer.setSize(w, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      domEl.removeEventListener('mousemove', handlePointerMove);
      domEl.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      container.innerHTML = '';
    };
  }, [isRotating, hoveredNode, activeNode, onSelectNodeModal, onCoreClick]);

  return (
    <div className="relative w-full rounded-3xl bg-white/70 backdrop-blur-md border border-emerald-200/80 shadow-lg overflow-hidden transition-all">
      {/* Top Header Controls Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-6 py-4 border-b border-emerald-200/70 bg-gradient-to-r from-emerald-50/70 via-white/80 to-teal-50/70">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-bsai-emerald to-bsai-teal text-white flex items-center justify-center shadow-md shadow-emerald-700/20 shrink-0">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black font-display text-bsai-indigo tracking-tight">
                BSAI Support Ecosystem Cycle
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1 shadow-2xs">
                <Sparkles className="w-3 h-3 text-bsai-teal" />
                Live 3D AI Core
              </span>
            </div>
            <p className="text-[11px] text-bsai-indigoLight">
              The continuous brain of Bharat Support AI. Click any 3D node or central AI core to interact.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => setIsRotating((prev) => !prev)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              isRotating
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                : 'bg-white text-bsai-indigoMuted border-bsai-border hover:text-bsai-indigo'
            }`}
          >
            {isRotating ? '⏸ Orbit Active' : '▶ Resume Orbit'}
          </button>
        </div>
      </div>

      {/* 3D Canvas Viewport */}
      <div className="relative w-full h-[540px] bg-gradient-to-b from-[#E8F6EE]/30 via-transparent to-[#E8F6EE]/50">
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Floating Contextual Node Inspection HUD Card */}
        {(hoveredNode || activeNode) && (
          <div className="absolute top-5 left-5 max-w-sm bg-white/95 backdrop-blur-md p-5 rounded-3xl border border-emerald-200/80 shadow-xl space-y-3 pointer-events-auto animate-in fade-in zoom-in-95 duration-150 z-20">
            <div className="flex items-center justify-between">
              <span
                className="text-[10px] font-black px-2.5 py-0.5 rounded-full text-white shadow-2xs uppercase tracking-wider"
                style={{ backgroundColor: (hoveredNode || activeNode).color }}
              >
                Stage 0{(hoveredNode || activeNode).step} of 05 • {(hoveredNode || activeNode).badge}
              </span>
              <span className="text-[10px] font-bold text-bsai-indigoMuted font-mono">
                {(hoveredNode || activeNode).nameHi}
              </span>
            </div>

            <div>
              <h3 className="text-base font-black font-display text-bsai-indigo">
                {(hoveredNode || activeNode).name}
              </h3>
              <p className="text-xs text-bsai-teal font-bold">
                {(hoveredNode || activeNode).subtitle}
              </p>
            </div>

            <p className="text-xs text-bsai-indigoLight leading-relaxed">
              {(hoveredNode || activeNode).description}
            </p>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {(hoveredNode || activeNode).details.map((item, idx) => (
                <span
                  key={idx}
                  className="bg-[#E8F6EE] px-2 py-0.5 rounded-lg text-[10px] font-bold text-emerald-800 border border-emerald-200"
                >
                  ✓ {item}
                </span>
              ))}
            </div>

            <div className="pt-2 border-t border-bsai-border flex items-center justify-between gap-3">
              <BSAIButton
                variant={(hoveredNode || activeNode).step === 4 ? 'escalate' : 'primary'}
                size="sm"
                onClick={() => onNavigateView((hoveredNode || activeNode).targetView)}
                icon={<ArrowRight className="w-3.5 h-3.5" />}
                iconPosition="right"
              >
                Launch {(hoveredNode || activeNode).name}
              </BSAIButton>

              <span className="text-[10px] text-bsai-indigoMuted font-semibold">
                Click to inspect
              </span>
            </div>
          </div>
        )}

        {/* Bottom Interactive Stage Progression Badges */}
        <div className="absolute bottom-4 inset-x-4 flex items-center justify-center gap-2 flex-wrap pointer-events-auto z-10">
          {BSAI_WORKFLOW_NODES.map((node) => {
            const isSelected = activeNode.id === node.id;
            return (
              <button
                key={node.id}
                onClick={() => {
                  setActiveNode(node);
                  if (onSelectNodeModal) onSelectNodeModal(node);
                }}
                className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold transition-all duration-200 flex items-center gap-2 shadow-2xs cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-bsai-emerald to-bsai-teal text-white shadow-md scale-105 ring-2 ring-emerald-400/40'
                    : 'bg-white/90 text-bsai-indigo hover:bg-emerald-50 hover:text-emerald-900 border border-emerald-200/70'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shadow-2xs"
                  style={{ backgroundColor: node.color }}
                />
                <span>0{node.step}. {node.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
