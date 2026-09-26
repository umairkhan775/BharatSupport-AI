import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { SupportCategory } from '../../types';
import { Sparkles, ArrowRight, Play, CheckCircle2, ShieldCheck, Globe, Bot, BookOpen, GraduationCap, HeartPulse, Briefcase, FileText, Scale, Languages } from 'lucide-react';
import { BSAIButton } from '../common/BSAIButton';

export interface ServiceNodeData {
  id: string;
  category: SupportCategory;
  name: string;
  nameHi: string;
  icon: string;
  color: string;
  colorHex: number;
  badgeBg: string;
  position: [number, number, number];
  description: string;
  descriptionHi: string;
  sampleQuestions: string[];
}

export const HERO_SERVICE_NODES: ServiceNodeData[] = [
  {
    id: 'node-govt',
    category: 'Government Services',
    name: 'Government Services',
    nameHi: 'सरकारी सेवाएं',
    icon: '🏛️',
    color: '#F2A900', // Saffron
    colorHex: 0xF2A900,
    badgeBg: 'bg-amber-500',
    position: [-3.8, 3.2, 0.5],
    description: 'Direct guidance on PM-Kisan, Direct Benefit Transfer (DBT), Ration Card portability, and State Welfare Schemes.',
    descriptionHi: 'पीएम-किसान, डीबीटी, राशन कार्ड और राज्य कल्याणकारी योजनाओं पर त्वरित मार्गदर्शन।',
    sampleQuestions: ['How to check PM-Kisan installment status?', 'How to do Land Seeding e-KYC?', 'Apply for State Farmer Subsidies']
  },
  {
    id: 'node-edu',
    category: 'Education',
    name: 'Education & Studies',
    nameHi: 'शिक्षा व छात्रवृत्ति',
    icon: '🎓',
    color: '#69B88A', // Soft Green
    colorHex: 0x69B88A,
    badgeBg: 'bg-emerald-500',
    position: [3.8, 3.4, 0.5],
    description: 'National Scholarship Portal (NSP), PM-YASASVI, Skill India PMKVY vouchers, and higher education assistance.',
    descriptionHi: 'राष्ट्रीय छात्रवृत्ति पोर्टल (NSP), पीएम-यशस्वी और कौशल विकास योजनाओं की जानकारी।',
    sampleQuestions: ['How to generate NSP OTR Number?', 'Check Post-Matric Scholarship Deadline', 'Free PMKVY Skill Courses']
  },
  {
    id: 'node-health',
    category: 'Healthcare',
    name: 'Healthcare & PM-JAY',
    nameHi: 'आयुष्मान भारत',
    icon: '🏥',
    color: '#E9785A', // Coral
    colorHex: 0xE9785A,
    badgeBg: 'bg-rose-500',
    position: [4.6, 1.2, 1.8],
    description: 'Ayushman Bharat Golden Card generation, ₹5 Lakh cashless hospital finder, and Jan Aushadhi generic medicines.',
    descriptionHi: 'आयुष्मान गोल्डन कार्ड, ₹५ लाख कैशलेस अस्पताल सूची और जन औषधि केंद्र।',
    sampleQuestions: ['Download Ayushman Card Online', 'Senior Citizen 70+ Health Card', 'Find Empanelled Hospitals']
  },
  {
    id: 'node-emp',
    category: 'Employment',
    name: 'Employment & MSME',
    nameHi: 'रोजगार व उद्यम',
    icon: '💼',
    color: '#F4A340', // Warm Orange
    colorHex: 0xF4A340,
    badgeBg: 'bg-orange-500',
    position: [3.6, -1.2, 2.5],
    description: 'Free Udyam MSME Registration, PM Mudra collateral-free business loans, and National Career Service jobs.',
    descriptionHi: 'मुफ्त उद्यम रजिस्ट्रेशन, पीएम मुद्रा लोन और रोजगार मेले की जानकारी।',
    sampleQuestions: ['Apply for ₹10 Lakh Mudra Loan', 'Generate Free Udyam Certificate', 'Rozgar Mela Registration']
  },
  {
    id: 'node-docs',
    category: 'Documents & Identity',
    name: 'Documents & DigiLocker',
    nameHi: 'दस्तावेज व आधार',
    icon: '📄',
    color: '#6C8FE8', // Soft Blue
    colorHex: 0x6C8FE8,
    badgeBg: 'bg-blue-500',
    position: [-4.6, 1.0, 1.8],
    description: 'Aadhaar address update, DigiLocker legal digital documents, instant e-PAN, and driving license sync.',
    descriptionHi: 'आधार पता सुधार, डिजिलॉकर कानूनी दस्तावेज, ई-पैन और ड्राइविंग लाइसेंस डाउनलोड।',
    sampleQuestions: ['Update Aadhaar Address Online', 'Fetch Driving License to DigiLocker', 'Order Official PVC Aadhaar Card']
  },
  {
    id: 'node-grievance',
    category: 'Grievance Redressal',
    name: 'Grievance Redressal',
    nameHi: 'जन शिकायत (CPGRAMS)',
    icon: '⚖️',
    color: '#159A9C', // Indian Teal
    colorHex: 0x159A9C,
    badgeBg: 'bg-teal-600',
    position: [0, -2.2, 3.4],
    description: 'Guidance on grievance submission and routing complex cases for district officer review.',
    descriptionHi: 'सीपीजीआरएएमएस पर सरकारी विभागों व बिजली/पानी के खिलाफ २१-दिवसीय गारंटीड शिकायत दर्ज करें।',
    sampleQuestions: ['Lodge CPGRAMS Public Grievance', 'Track Disputed Electricity Tariff', 'Escalate to Appellate Authority']
  },
  {
    id: 'node-lang',
    category: 'Other Citizen Services',
    name: '22+ Indian Languages',
    nameHi: 'बहुभाषी वॉइस एआई',
    icon: '🌐',
    color: '#9B8FD4', // Lavender
    colorHex: 0x9B8FD4,
    badgeBg: 'bg-purple-500',
    position: [-3.5, -1.2, 2.5],
    description: 'Support across 22 official Indian languages including Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati and English.',
    descriptionHi: 'हिंदी, तमिल, तेलुगु, बंगाली, मराठी सहित २२ भारतीय भाषाओं में वॉइस व टेक्स्ट सहायता।',
    sampleQuestions: ['Speak in Hindi / Regional Dialect', 'Voice Assistance Demo', 'Translate Official Directives']
  }
];

interface Bharat3DHeroProps {
  onSelectNode: (node: ServiceNodeData) => void;
  onExploreClick: () => void;
  onEnterDashboard: () => void;
  onWatchVideoClick?: () => void;
}

export const Bharat3DHero: React.FC<Bharat3DHeroProps> = ({
  onSelectNode,
  onExploreClick,
  onEnterDashboard,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = useState<ServiceNodeData | null>(null);
  const [parallaxOffset, setParallaxOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;
    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || 720;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    scene.background = null; // Transparent to blend seamlessly with Ivory `#F7F4ED` page

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 1.8, 14.5);

    // 2. High-Performance Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    container.appendChild(renderer.domElement);

    // 3. Multi-Hue Dynamic Cinematic Lighting System
    const ambientLight = new THREE.AmbientLight(0xFFF9EE, 1.85);
    scene.add(ambientLight);

    // Dynamic Key Sun Light (Warm Golden Ivory)
    const sunLight = new THREE.DirectionalLight(0xFFE8C0, 2.9);
    sunLight.position.set(12, 18, 14);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    // Dynamic Fill Light (Indian Teal)
    const tealLight = new THREE.PointLight(0x159A9C, 3.2, 28);
    tealLight.position.set(-10, 8, 6);
    scene.add(tealLight);

    // Dynamic Accent Light (Rich Saffron)
    const saffronLight = new THREE.PointLight(0xF2A900, 3.4, 28);
    saffronLight.position.set(10, 6, 6);
    scene.add(saffronLight);

    // Dynamic Overhead Rim Light (Soft Lavender)
    const lavenderLight = new THREE.PointLight(0x9B8FD4, 2.4, 22);
    lavenderLight.position.set(0, 11, -6);
    scene.add(lavenderLight);

    // 4. Floating Bharat Terraced Island (Layer 2 Parallax)
    const worldGroup = new THREE.Group();
    worldGroup.position.set(0.8, -0.2, 0);
    scene.add(worldGroup);

    // Terraced Island Base (Lawn green platform + warm sandstone plinth)
    const islandTopGeo = new THREE.CylinderGeometry(7.0, 7.8, 0.8, 48);
    const islandTopMat = new THREE.MeshStandardMaterial({
      color: 0x76B860, // Vibrant lawn green
      roughness: 0.55,
      metalness: 0.05
    });
    const islandTop = new THREE.Mesh(islandTopGeo, islandTopMat);
    islandTop.position.y = -1.6;
    islandTop.receiveShadow = true;
    worldGroup.add(islandTop);

    const islandBaseGeo = new THREE.CylinderGeometry(7.8, 5.5, 1.6, 48);
    const islandBaseMat = new THREE.MeshStandardMaterial({
      color: 0xD8C4A6, // Warm sandstone
      roughness: 0.8,
      metalness: 0.1
    });
    const islandBase = new THREE.Mesh(islandBaseGeo, islandBaseMat);
    islandBase.position.y = -2.8;
    worldGroup.add(islandBase);

    // Glowing Turquoise River Canal with Water Ripples
    const canalGeo = new THREE.TorusGeometry(4.6, 0.5, 16, 48, Math.PI * 0.9);
    const canalMat = new THREE.MeshStandardMaterial({
      color: 0x159A9C,
      emissive: 0x0E7577,
      emissiveIntensity: 0.6,
      roughness: 0.1,
      metalness: 0.8
    });
    const canal = new THREE.Mesh(canalGeo, canalMat);
    canal.rotation.x = Math.PI / 2;
    canal.rotation.z = -Math.PI / 3.2;
    canal.position.set(0.2, -1.18, 0.9);
    worldGroup.add(canal);

    // 5. Architectural Monuments on Island
    // A) India Gate Monument (Left Background)
    const indiaGateGroup = new THREE.Group();
    indiaGateGroup.position.set(-4.0, -1.2, -3.0);
    indiaGateGroup.scale.set(0.65, 0.65, 0.65);
    worldGroup.add(indiaGateGroup);

    const gateMat = new THREE.MeshStandardMaterial({ color: 0xF4A340, roughness: 0.4, metalness: 0.15 });
    const p1 = new THREE.Mesh(new THREE.BoxGeometry(0.9, 3.4, 1.3), gateMat);
    p1.position.set(-1.2, 1.7, 0);
    p1.castShadow = true;
    indiaGateGroup.add(p1);

    const p2 = new THREE.Mesh(new THREE.BoxGeometry(0.9, 3.4, 1.3), gateMat);
    p2.position.set(1.2, 1.7, 0);
    p2.castShadow = true;
    indiaGateGroup.add(p2);

    const archTop = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.1, 1.5), gateMat);
    archTop.position.set(0, 3.9, 0);
    archTop.castShadow = true;
    indiaGateGroup.add(archTop);

    // B) Indian Stupa / Taj Dome Monument (Right Background)
    const domeGroup = new THREE.Group();
    domeGroup.position.set(4.0, -1.2, -2.8);
    domeGroup.scale.set(0.7, 0.7, 0.7);
    worldGroup.add(domeGroup);

    const marbleMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.2, metalness: 0.1 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xF2A900, roughness: 0.2, metalness: 0.8 });

    const dPlinth = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.6, 3.2), marbleMat);
    dPlinth.position.y = 0.3;
    domeGroup.add(dPlinth);

    const dBody = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.3, 1.8, 32), marbleMat);
    dBody.position.y = 1.5;
    domeGroup.add(dBody);

    const dDome = new THREE.Mesh(new THREE.SphereGeometry(1.4, 32, 24), marbleMat);
    dDome.position.y = 2.6;
    dDome.scale.set(1, 1.25, 1);
    domeGroup.add(dDome);

    const dFinial = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.9, 16), goldMat);
    dFinial.position.y = 4.3;
    domeGroup.add(dFinial);

    // Trees & Garden foliage
    const treeMat = new THREE.MeshStandardMaterial({ color: 0x4CAF50, roughness: 0.5 });
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x6D4C41, roughness: 0.9 });
    [
      [-2.2, -1.2, -2.2],
      [-5.0, -1.2, -0.8],
      [2.0, -1.2, -3.6],
      [5.2, -1.2, -1.0],
      [-3.5, -1.2, 2.2],
      [4.8, -1.2, 1.5]
    ].forEach(([tx, ty, tz]) => {
      const tree = new THREE.Group();
      tree.position.set(tx, ty, tz);
      tree.scale.setScalar(0.45 + Math.random() * 0.2);

      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.22, 0.9, 8), trunkMat);
      trunk.position.y = 0.45;
      tree.add(trunk);

      const foliage = new THREE.Mesh(new THREE.SphereGeometry(0.7, 12, 12), treeMat);
      foliage.position.y = 1.1;
      tree.add(foliage);

      worldGroup.add(tree);
    });

    // 6. LARGE HERO BSAI AI ROBOT (Layer 4 Parallax)
    const robotGroup = new THREE.Group();
    robotGroup.position.set(0.6, 0.2, 0.8);
    robotGroup.scale.set(1.45, 1.45, 1.45); // HERO SCALE
    scene.add(robotGroup);

    // Multi-tier Glowing Pedestal
    const pedGeo1 = new THREE.CylinderGeometry(1.4, 1.6, 0.35, 32);
    const pedMat1 = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.15, metalness: 0.4 });
    const ped1 = new THREE.Mesh(pedGeo1, pedMat1);
    ped1.position.y = -0.95;
    ped1.receiveShadow = true;
    robotGroup.add(ped1);

    const pedGlow = new THREE.Mesh(
      new THREE.RingGeometry(1.1, 1.35, 32),
      new THREE.MeshBasicMaterial({ color: 0x159A9C, side: THREE.DoubleSide })
    );
    pedGlow.rotation.x = -Math.PI / 2;
    pedGlow.position.y = -0.76;
    robotGroup.add(pedGlow);

    // Soft Contact Shadow Disc beneath the Robot
    const shadowDisc = new THREE.Mesh(
      new THREE.CircleGeometry(1.5, 32),
      new THREE.MeshBasicMaterial({
        color: 0x2A2016,
        transparent: true,
        opacity: 0.35,
        side: THREE.DoubleSide
      })
    );
    shadowDisc.rotation.x = -Math.PI / 2;
    shadowDisc.position.set(0.6, -1.18, 0.8);
    scene.add(shadowDisc);

    // Ceramic Gloss Robot Torso
    const torsoMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.1, metalness: 0.15 });
    const tealMat = new THREE.MeshStandardMaterial({ color: 0x159A9C, roughness: 0.2, metalness: 0.6 });
    const saffronMat = new THREE.MeshStandardMaterial({ color: 0xF2A900, roughness: 0.2, metalness: 0.7 });

    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.58, 1.1, 32), torsoMat);
    torso.position.y = 0.05;
    torso.castShadow = true;
    robotGroup.add(torso);

    // Chest Emblem / Chakra Glow Core
    const coreOuter = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.1, 24), tealMat);
    coreOuter.rotation.x = Math.PI / 2;
    coreOuter.position.set(0, 0.15, 0.62);
    robotGroup.add(coreOuter);

    const coreInner = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.14, 0.12, 24),
      new THREE.MeshBasicMaterial({ color: 0xF2A900 })
    );
    coreInner.rotation.x = Math.PI / 2;
    coreInner.position.set(0, 0.15, 0.63);
    robotGroup.add(coreInner);

    // Articulated Shoulders
    const leftShoulder = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 16), tealMat);
    leftShoulder.position.set(-0.85, 0.45, 0);
    robotGroup.add(leftShoulder);

    const rightShoulder = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 16), tealMat);
    rightShoulder.position.set(0.85, 0.45, 0);
    robotGroup.add(rightShoulder);

    // Floating Levitating Hands
    const handMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.2 });
    const leftHand = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), handMat);
    leftHand.position.set(-1.05, 0.05, 0.35);
    robotGroup.add(leftHand);

    const rightHand = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), handMat);
    rightHand.position.set(1.05, 0.05, 0.35);
    robotGroup.add(rightHand);

    // Large Friendly Robot Head (with Gaze Tracking)
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.95, 0);
    robotGroup.add(headGroup);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.8, 32, 32), torsoMat);
    head.scale.set(1.15, 0.95, 0.95);
    head.castShadow = true;
    headGroup.add(head);

    // Dark Visor Face Screen
    const visor = new THREE.Mesh(
      new THREE.CylinderGeometry(0.62, 0.62, 0.48, 32, 1, false, 0, Math.PI),
      new THREE.MeshStandardMaterial({ color: 0x0F172A, roughness: 0.1, metalness: 0.9 })
    );
    visor.rotation.y = -Math.PI / 2;
    visor.position.set(0, 0.02, 0.42);
    headGroup.add(visor);

    // Expressive Bright Cyan Smiling Eyes & Smile
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x38BDF8 });
    const leftEye = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.08, 0.05), eyeMat);
    leftEye.position.set(-0.24, 0.06, 0.9);
    headGroup.add(leftEye);

    const rightEye = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.08, 0.05), eyeMat);
    rightEye.position.set(0.24, 0.06, 0.9);
    headGroup.add(rightEye);

    const smile = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.022, 8, 16, Math.PI), eyeMat);
    smile.position.set(0, -0.07, 0.91);
    headGroup.add(smile);

    // Golden Floating Halo Crown
    const halo = new THREE.Mesh(
      new THREE.TorusGeometry(0.95, 0.035, 16, 48),
      new THREE.MeshBasicMaterial({ color: 0xF2A900 })
    );
    halo.rotation.x = Math.PI / 2.3;
    halo.position.set(0, 0.75, 0);
    headGroup.add(halo);

    // 7. CRAFTED 3D SERVICE OBJECTS (Layer 3 Parallax)
    const raycastTargets: THREE.Mesh[] = [];
    const serviceObjects: {
      group: THREE.Group;
      modelGroup: THREE.Group;
      auraRing: THREE.Mesh;
      basePos: [number, number, number];
      data: ServiceNodeData;
      currentScale: number;
    }[] = [];

    HERO_SERVICE_NODES.forEach((node) => {
      const objGroup = new THREE.Group();
      objGroup.position.set(...node.position);
      scene.add(objGroup);

      const modelGroup = new THREE.Group();
      objGroup.add(modelGroup);

      // Hitbox for raycasting click/hover
      const hitBox = new THREE.Mesh(
        new THREE.SphereGeometry(1.2, 16, 16),
        new THREE.MeshBasicMaterial({ visible: false })
      );
      (hitBox as any).userData = { nodeData: node };
      objGroup.add(hitBox);
      raycastTargets.push(hitBox);

      // Dedicated 3D Model for each Service Domain:
      if (node.id === 'node-edu') {
        // 🎓 EDUCATION: Stacked 3D Books + Graduation Cap with Gold Tassel
        const bookMat1 = new THREE.MeshStandardMaterial({ color: 0x69B88A, roughness: 0.4 });
        const bookMat2 = new THREE.MeshStandardMaterial({ color: 0xF2A900, roughness: 0.4 });
        const capMat = new THREE.MeshStandardMaterial({ color: 0x202A5A, roughness: 0.2 });
        const goldTasselMat = new THREE.MeshStandardMaterial({ color: 0xF2A900, metalness: 0.8 });

        const b1 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.25, 0.9), bookMat1);
        b1.position.y = -0.3;
        modelGroup.add(b1);

        const b2 = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.25, 0.85), bookMat2);
        b2.position.set(0, -0.05, 0);
        b2.rotation.y = 0.2;
        modelGroup.add(b2);

        const capBoard = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.08, 1.0), capMat);
        capBoard.position.set(0, 0.3, 0);
        capBoard.rotation.y = 0.35;
        modelGroup.add(capBoard);

        const capSkull = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.35, 0.25, 16), capMat);
        capSkull.position.set(0, 0.15, 0);
        modelGroup.add(capSkull);

        const tassel = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), goldTasselMat);
        tassel.position.set(0.35, 0.25, 0.35);
        modelGroup.add(tassel);
      } else if (node.id === 'node-govt') {
        // 🏛️ GOVERNMENT: Indian Civic Pavilion & Stupa Crest
        const govMat = new THREE.MeshStandardMaterial({ color: 0xF2A900, roughness: 0.3, metalness: 0.5 });
        const pillarMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.2 });

        const gBase = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.8, 0.2, 16), govMat);
        gBase.position.y = -0.4;
        modelGroup.add(gBase);

        const gDome = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), govMat);
        gDome.position.y = 0.4;
        modelGroup.add(gDome);

        for (let i = 0; i < 4; i++) {
          const angle = (i / 4) * Math.PI * 2;
          const pil = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.6, 8), pillarMat);
          pil.position.set(Math.cos(angle) * 0.45, 0, Math.sin(angle) * 0.45);
          modelGroup.add(pil);
        }
      } else if (node.id === 'node-health') {
        // 🏥 HEALTHCARE: 3D Medical Cross with Glowing Health Shield
        const healthMat = new THREE.MeshStandardMaterial({ color: 0xE9785A, roughness: 0.2, emissive: 0xE9785A, emissiveIntensity: 0.3 });
        const whiteMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.2 });

        const crossV = new THREE.Mesh(new THREE.BoxGeometry(0.35, 1.0, 0.35), healthMat);
        modelGroup.add(crossV);

        const crossH = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.35, 0.35), healthMat);
        modelGroup.add(crossH);

        const shieldRing = new THREE.Mesh(new THREE.TorusGeometry(0.8, 0.04, 16, 32), whiteMat);
        modelGroup.add(shieldRing);
      } else if (node.id === 'node-emp') {
        // 💼 EMPLOYMENT: 3D Business Briefcase & Gear
        const empMat = new THREE.MeshStandardMaterial({ color: 0xF4A340, roughness: 0.3, metalness: 0.4 });
        const handleMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.2 });

        const bag = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.65, 0.35), empMat);
        modelGroup.add(bag);

        const handle = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.04, 8, 16, Math.PI), handleMat);
        handle.position.set(0, 0.35, 0);
        modelGroup.add(handle);
      } else if (node.id === 'node-docs') {
        // 📄 DOCUMENTS: 3D Digital Identity Card & QR Chip
        const docMat = new THREE.MeshStandardMaterial({ color: 0x6C8FE8, roughness: 0.2, metalness: 0.4 });
        const card = new THREE.Mesh(new THREE.BoxGeometry(0.85, 1.15, 0.08), docMat);
        modelGroup.add(card);

        const chip = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.25, 0.1), new THREE.MeshBasicMaterial({ color: 0xF2A900 }));
        chip.position.set(-0.2, 0.25, 0.05);
        modelGroup.add(chip);
      } else if (node.id === 'node-grievance') {
        // ⚖️ GRIEVANCE REDRESSAL: 3D Scales of Justice / Resolution Badge
        const gMat = new THREE.MeshStandardMaterial({ color: 0x159A9C, roughness: 0.3, metalness: 0.6 });
        const fulcrum = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 0.9, 8), gMat);
        modelGroup.add(fulcrum);

        const beam = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.06, 0.06), gMat);
        beam.position.y = 0.4;
        modelGroup.add(beam);

        const pan1 = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.06, 16), gMat);
        pan1.position.set(-0.45, 0.1, 0);
        modelGroup.add(pan1);

        const pan2 = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.06, 16), gMat);
        pan2.position.set(0.45, 0.2, 0);
        modelGroup.add(pan2);
      } else {
        // 🌐 MULTILINGUAL: 3D Speech Orb & Translation Ring
        const langMat = new THREE.MeshStandardMaterial({ color: 0x9B8FD4, roughness: 0.2, emissive: 0x9B8FD4, emissiveIntensity: 0.3 });
        const orb = new THREE.Mesh(new THREE.SphereGeometry(0.55, 24, 24), langMat);
        modelGroup.add(orb);

        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.03, 16, 32), new THREE.MeshBasicMaterial({ color: 0xF2A900 }));
        ring.rotation.x = Math.PI / 2.4;
        modelGroup.add(ring);
      }

      // Subtle Pulsing Ambient Ring underneath each object
      const auraRing = new THREE.Mesh(
        new THREE.RingGeometry(0.8, 0.95, 32),
        new THREE.MeshBasicMaterial({
          color: node.colorHex,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.55
        })
      );
      auraRing.rotation.x = -Math.PI / 2;
      auraRing.position.y = -0.7;
      objGroup.add(auraRing);

      serviceObjects.push({
        group: objGroup,
        modelGroup,
        auraRing,
        basePos: [...node.position] as [number, number, number],
        data: node,
        currentScale: 1.0
      });
    });

    // 8. Glowing Curved Data Lines connecting Robot to Service Nodes
    HERO_SERVICE_NODES.forEach((node) => {
      const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(0.6, 0.5, 0.8),
        new THREE.Vector3(node.position[0] * 0.4, 1.8, node.position[2] * 0.4),
        new THREE.Vector3(...node.position)
      );
      const points = curve.getPoints(24);
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const lineMat = new THREE.LineBasicMaterial({
        color: node.colorHex,
        transparent: true,
        opacity: 0.4,
        linewidth: 2
      });
      scene.add(new THREE.Line(lineGeo, lineMat));
    });

    // 9. Floating Ambient Micro-Particles (Layer 1 Far Parallax)
    const particleCount = 90;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);

    const colorSaffron = new THREE.Color(0xF2A900);
    const colorTeal = new THREE.Color(0x159A9C);
    const colorGold = new THREE.Color(0xFFE8C0);

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      particlePositions[idx] = (Math.random() - 0.5) * 16;
      particlePositions[idx + 1] = Math.random() * 8 - 2;
      particlePositions[idx + 2] = (Math.random() - 0.5) * 14;

      const choice = Math.random();
      const col = choice < 0.4 ? colorGold : choice < 0.7 ? colorTeal : colorSaffron;
      particleColors[idx] = col.r;
      particleColors[idx + 1] = col.g;
      particleColors[idx + 2] = col.b;

      particleSpeeds[i] = 0.008 + Math.random() * 0.015;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.75
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 10. REAL-TIME CONTINUOUS CURSOR TRACKING & SMOOTH CINEMATIC PARALLAX (CRITICAL FIX)
    let cursorTargetX = 0; // Normalized -1 to +1
    let cursorTargetY = 0; // Normalized -1 to +1
    let cursorSmoothX = 0;
    let cursorSmoothY = 0;

    let dragOrbitX = 0;
    let dragOrbitY = 0.05;
    let isDragging = false;
    let pointerStartX = 0;
    let pointerStartY = 0;

    let targetDistance = 14.5;
    let currentDistance = 14.5;

    const raycaster = new THREE.Raycaster();
    const mouse2D = new THREE.Vector2();

    // Continuous pointer movement listener over entire window and hero canvas
    const onGlobalPointerMove = (e: PointerEvent) => {
      if (!mountRef.current) return;
      const rect = mountRef.current.getBoundingClientRect();
      // Only track when hero is visible in viewport
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const normX = (e.clientX - centerX) / (rect.width / 2);
      const normY = -(e.clientY - centerY) / (rect.height / 2);

      cursorTargetX = Math.max(-1.5, Math.min(1.5, normX));
      cursorTargetY = Math.max(-1.5, Math.min(1.5, normY));

      // Raycast for hovering 3D service objects if cursor is within container bounds
      if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
        mouse2D.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse2D.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
        raycaster.setFromCamera(mouse2D, camera);
        const hits = raycaster.intersectObjects(raycastTargets);
        if (hits.length > 0) {
          const hitData = (hits[0].object as any).userData?.nodeData as ServiceNodeData;
          if (hitData) {
            setHoveredNode(hitData);
            if (!isDragging) container.style.cursor = 'pointer';
          }
        } else {
          setHoveredNode(null);
          if (!isDragging) container.style.cursor = 'grab';
        }
      }

      // Manual drag rotation modulation
      if (isDragging) {
        const deltaX = e.clientX - pointerStartX;
        const deltaY = e.clientY - pointerStartY;

        dragOrbitX += deltaX * 0.007;
        dragOrbitY += deltaY * 0.004;
        dragOrbitY = Math.max(-0.4, Math.min(0.6, dragOrbitY));

        pointerStartX = e.clientX;
        pointerStartY = e.clientY;
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      isDragging = true;
      pointerStartX = e.clientX;
      pointerStartY = e.clientY;
      container.setPointerCapture(e.pointerId);
      container.style.cursor = 'grabbing';
    };

    const onPointerUp = (e: PointerEvent) => {
      if (isDragging) {
        isDragging = false;
        try {
          container.releasePointerCapture(e.pointerId);
        } catch (_) {}
        container.style.cursor = 'grab';
      }
    };

    const onPointerLeave = () => {
      // Settle gently towards center when pointer leaves
      cursorTargetX = 0;
      cursorTargetY = 0;
      setHoveredNode(null);
    };

    const onClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse2D.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse2D.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      raycaster.setFromCamera(mouse2D, camera);
      const hits = raycaster.intersectObjects(raycastTargets);
      if (hits.length > 0) {
        const hitData = (hits[0].object as any).userData?.nodeData as ServiceNodeData;
        if (hitData) {
          onSelectNode(hitData);
        }
      }
    };

    // Mobile Pinch-to-Zoom and Touch Orbit
    let initialTouchDistance = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        initialTouchDistance = Math.hypot(dx, dy);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.hypot(dx, dy);
        if (initialTouchDistance > 0) {
          const delta = initialTouchDistance - dist;
          targetDistance += delta * 0.02;
          targetDistance = Math.max(9, Math.min(22, targetDistance));
          initialTouchDistance = dist;
        }
      }
    };

    // Non-blocking Zoom
    const onWheel = (e: WheelEvent) => {
      if (e.shiftKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        targetDistance += e.deltaY * 0.01;
        targetDistance = Math.max(9, Math.min(22, targetDistance));
      }
    };

    window.addEventListener('pointermove', onGlobalPointerMove, { passive: true });
    container.addEventListener('pointerdown', onPointerDown);
    container.addEventListener('pointerup', onPointerUp);
    container.addEventListener('pointercancel', onPointerUp);
    container.addEventListener('pointerleave', onPointerLeave);
    container.addEventListener('click', onClick);
    container.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('touchmove', onTouchMove, { passive: true });
    container.addEventListener('wheel', onWheel, { passive: true });

    // Handle Window Resize
    const onResize = () => {
      if (!mountRef.current) return;
      width = mountRef.current.clientWidth || window.innerWidth;
      height = mountRef.current.clientHeight || 720;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', onResize);

    // 11. CINEMATIC ANIMATION LOOP WITH AMPLIFIED LERP & DEPTH PARALLAX
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (document.hidden) return;

      const elapsed = clock.getElapsedTime();

      // Exponential smoothing (lerp) for silky-smooth cursor follow
      cursorSmoothX += (cursorTargetX - cursorSmoothX) * 0.065;
      cursorSmoothY += (cursorTargetY - cursorSmoothY) * 0.065;
      currentDistance += (targetDistance - currentDistance) * 0.08;

      // Update 2D Parallax state for HTML badges
      setParallaxOffset({ x: cursorSmoothX * 16, y: -cursorSmoothY * 14 });

      // Total Camera Orbit Angle = Drag Offset + Continuous Cursor-Follow Angle
      const totalAngleY = dragOrbitX + cursorSmoothX * 0.55;
      const totalAngleX = dragOrbitY + cursorSmoothY * 0.28;

      // Camera Position & Gaze (Smoothly tracking cursor in 3D space)
      camera.position.x = Math.sin(totalAngleY) * Math.cos(totalAngleX) * currentDistance + cursorSmoothX * 1.4;
      camera.position.y = Math.sin(totalAngleX) * currentDistance + 1.8 + cursorSmoothY * 1.1;
      camera.position.z = Math.cos(totalAngleY) * Math.cos(totalAngleX) * currentDistance;
      camera.lookAt(0.6 + cursorSmoothX * 0.5, 0.4 + cursorSmoothY * 0.35, 0.8);

      // Dynamic Cinematic Lighting: Shifting specular glints and directional shadows
      sunLight.position.set(12 + cursorSmoothX * 8, 18 + cursorSmoothY * 6, 14);
      tealLight.position.set(-10 - cursorSmoothX * 7, 8 + cursorSmoothY * 3, 6);
      saffronLight.position.set(10 + cursorSmoothX * 7, 6 + cursorSmoothY * 3, 6);
      lavenderLight.position.set(0, 11 + cursorSmoothY * 5, -6);

      // Layer 2 Parallax: Island Base & Heritage Monuments
      worldGroup.position.x = 0.8 + cursorSmoothX * 0.4;
      worldGroup.position.y = -0.2 + cursorSmoothY * 0.28;
      worldGroup.rotation.z = -cursorSmoothX * 0.035;
      worldGroup.rotation.x = cursorSmoothY * 0.035;

      // Layer 4 Parallax: Central Hero BSAI Robot (Breathing, Floating, Head Gaze Tracking)
      robotGroup.position.x = 0.6 + cursorSmoothX * 0.55;
      robotGroup.position.y = 0.2 + Math.sin(elapsed * 1.8) * 0.07 + cursorSmoothY * 0.32;
      robotGroup.rotation.y = cursorSmoothX * 0.45;

      // Robot Head follows the cursor with lively natural gaze!
      headGroup.rotation.y = cursorSmoothX * 0.85 + Math.sin(elapsed * 1.0) * 0.05;
      headGroup.rotation.x = -cursorSmoothY * 0.45;
      halo.rotation.z = elapsed * 0.6 + cursorSmoothX * 0.5;

      leftHand.position.x = -1.05 + cursorSmoothX * 0.12;
      leftHand.position.y = 0.05 + Math.sin(elapsed * 2.0) * 0.07 + cursorSmoothY * 0.12;
      rightHand.position.x = 1.05 + cursorSmoothX * 0.12;
      rightHand.position.y = 0.05 + Math.cos(elapsed * 2.0) * 0.07 + cursorSmoothY * 0.12;

      // Contact shadow breathes and tracks the robot
      shadowDisc.position.set(robotGroup.position.x, -1.18, 0.8 + cursorSmoothX * 0.25);
      const shadowScale = 1.45 + Math.sin(elapsed * 1.8) * 0.08;
      shadowDisc.scale.set(shadowScale, 1, shadowScale);

      // Layer 3 Parallax: 3D Service Objects (Gentle float + hover scale-up)
      serviceObjects.forEach((item, idx) => {
        const offset = idx * 0.9;
        const isHovered = hoveredNode?.id === item.data.id;
        const targetScale = isHovered ? 1.28 : 1.0;
        item.currentScale += (targetScale - item.currentScale) * 0.14;
        item.modelGroup.scale.setScalar(item.currentScale);

        item.group.position.x = item.basePos[0] + cursorSmoothX * (0.65 + idx * 0.05);
        item.group.position.y = item.basePos[1] + cursorSmoothY * (0.45 + idx * 0.04) + Math.sin(elapsed * 1.6 + offset) * 0.15;
        item.group.position.z = item.basePos[2] + cursorSmoothX * 0.25;
        item.group.rotation.y = elapsed * 0.35 + offset + cursorSmoothX * 0.25;

        (item.auraRing.material as THREE.MeshBasicMaterial).opacity = isHovered ? 0.95 : 0.55;
        item.auraRing.scale.setScalar(item.currentScale * (1.0 + Math.sin(elapsed * 3 + offset) * 0.08));
      });

      // Layer 1 Far Parallax: Ambient Floating Light Dust Particles
      const posAttr = particleGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < particleCount; i++) {
        const pyIdx = i * 3 + 1;
        posAttr.array[pyIdx] += particleSpeeds[i];
        if (posAttr.array[pyIdx] > 6.5) {
          posAttr.array[pyIdx] = -2.5;
        }
      }
      posAttr.needsUpdate = true;
      particles.position.x = cursorSmoothX * 0.25;
      particles.position.y = cursorSmoothY * 0.2;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('pointermove', onGlobalPointerMove);
      container.removeEventListener('pointerdown', onPointerDown);
      container.removeEventListener('pointerup', onPointerUp);
      container.removeEventListener('pointercancel', onPointerUp);
      container.removeEventListener('pointerleave', onPointerLeave);
      container.removeEventListener('click', onClick);
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchmove', onTouchMove);
      container.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', onResize);

      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [onSelectNode]);

  return (
    <div className="relative w-full h-full min-h-[640px] lg:min-h-[740px] select-none overflow-hidden">
      {/* 3D Interactive WebGL Canvas */}
      <div
        ref={mountRef}
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-0 touch-none"
      />

      {/* Floating 3D Service Action Pills on Desktop/Tablet with Multi-Layer Parallax */}
      <div
        className="absolute inset-0 pointer-events-none z-10 hidden md:block transition-transform duration-75 ease-out"
        style={{
          transform: `translate3d(${parallaxOffset.x}px, ${parallaxOffset.y}px, 0)`
        }}
      >
        <div className="relative w-full h-full max-w-7xl mx-auto">
          {/* 1. Government Services (Top Left) */}
          <button
            onClick={() => onSelectNode(HERO_SERVICE_NODES[0])}
            onMouseEnter={() => setHoveredNode(HERO_SERVICE_NODES[0])}
            onMouseLeave={() => setHoveredNode(null)}
            className={`pointer-events-auto absolute top-[18%] right-[44%] lg:right-[40%] bg-amber-500/90 hover:bg-amber-500 text-white font-bold text-xs px-4 py-2 rounded-full shadow-lg shadow-amber-500/20 flex items-center gap-1.5 transition-all duration-200 hover:scale-108 active:scale-95 border border-white/60 backdrop-blur-md animate-float ${
              hoveredNode?.id === 'node-govt' ? 'ring-2 ring-amber-300 scale-108 shadow-xl shadow-amber-500/30' : ''
            }`}
          >
            <span>🏛️</span>
            <span>Government Services</span>
          </button>

          {/* 2. Education & Studies (Top Right) */}
          <button
            onClick={() => onSelectNode(HERO_SERVICE_NODES[1])}
            onMouseEnter={() => setHoveredNode(HERO_SERVICE_NODES[1])}
            onMouseLeave={() => setHoveredNode(null)}
            className={`pointer-events-auto absolute top-[20%] right-[16%] lg:right-[14%] bg-emerald-500/90 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-full shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 transition-all duration-200 hover:scale-108 active:scale-95 border border-white/60 backdrop-blur-md animate-float [animation-delay:0.8s] ${
              hoveredNode?.id === 'node-edu' ? 'ring-2 ring-emerald-300 scale-108 shadow-xl shadow-emerald-500/30' : ''
            }`}
          >
            <span>🎓</span>
            <span>Education & Studies</span>
          </button>

          {/* 3. Healthcare (Middle Right) */}
          <button
            onClick={() => onSelectNode(HERO_SERVICE_NODES[2])}
            onMouseEnter={() => setHoveredNode(HERO_SERVICE_NODES[2])}
            onMouseLeave={() => setHoveredNode(null)}
            className={`pointer-events-auto absolute top-[42%] right-[10%] lg:right-[8%] bg-rose-500/90 hover:bg-rose-500 text-white font-bold text-xs px-4 py-2 rounded-full shadow-lg shadow-rose-500/20 flex items-center gap-1.5 transition-all duration-200 hover:scale-108 active:scale-95 border border-white/60 backdrop-blur-md animate-float [animation-delay:1.6s] ${
              hoveredNode?.id === 'node-health' ? 'ring-2 ring-rose-300 scale-108 shadow-xl shadow-rose-500/30' : ''
            }`}
          >
            <span>🏥</span>
            <span>Healthcare</span>
          </button>

          {/* 4. Employment & MSME (Lower Right) */}
          <button
            onClick={() => onSelectNode(HERO_SERVICE_NODES[3])}
            onMouseEnter={() => setHoveredNode(HERO_SERVICE_NODES[3])}
            onMouseLeave={() => setHoveredNode(null)}
            className={`pointer-events-auto absolute top-[64%] right-[14%] lg:right-[12%] bg-orange-500/90 hover:bg-orange-500 text-white font-bold text-xs px-4 py-2 rounded-full shadow-lg shadow-orange-500/20 flex items-center gap-1.5 transition-all duration-200 hover:scale-108 active:scale-95 border border-white/60 backdrop-blur-md animate-float [animation-delay:1.2s] ${
              hoveredNode?.id === 'node-emp' ? 'ring-2 ring-orange-300 scale-108 shadow-xl shadow-orange-500/30' : ''
            }`}
          >
            <span>💼</span>
            <span>Employment & MSME</span>
          </button>

          {/* 5. Documents & Identity (Middle Left) */}
          <button
            onClick={() => onSelectNode(HERO_SERVICE_NODES[4])}
            onMouseEnter={() => setHoveredNode(HERO_SERVICE_NODES[4])}
            onMouseLeave={() => setHoveredNode(null)}
            className={`pointer-events-auto absolute top-[44%] right-[54%] lg:right-[50%] bg-blue-500/90 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2 rounded-full shadow-lg shadow-blue-500/20 flex items-center gap-1.5 transition-all duration-200 hover:scale-108 active:scale-95 border border-white/60 backdrop-blur-md animate-float [animation-delay:0.4s] ${
              hoveredNode?.id === 'node-docs' ? 'ring-2 ring-blue-300 scale-108 shadow-xl shadow-blue-500/30' : ''
            }`}
          >
            <span>📄</span>
            <span>Documents & Identity</span>
          </button>

          {/* 6. Grievance Redressal (Bottom Center) */}
          <button
            onClick={() => onSelectNode(HERO_SERVICE_NODES[5])}
            onMouseEnter={() => setHoveredNode(HERO_SERVICE_NODES[5])}
            onMouseLeave={() => setHoveredNode(null)}
            className={`pointer-events-auto absolute bottom-[14%] right-[32%] lg:right-[28%] bg-teal-600/90 hover:bg-teal-600 text-white font-bold text-xs px-4.5 py-2 rounded-full shadow-lg shadow-teal-600/20 flex items-center gap-2 transition-all duration-200 hover:scale-108 active:scale-95 border border-white/60 backdrop-blur-md animate-float [animation-delay:2.0s] ${
              hoveredNode?.id === 'node-grievance' ? 'ring-2 ring-teal-300 scale-108 shadow-xl shadow-teal-600/30' : ''
            }`}
          >
            <span>⚖️</span>
            <span>Grievance Redressal</span>
          </button>

          {/* 7. 22+ Languages (Lower Left) */}
          <button
            onClick={() => onSelectNode(HERO_SERVICE_NODES[6])}
            onMouseEnter={() => setHoveredNode(HERO_SERVICE_NODES[6])}
            onMouseLeave={() => setHoveredNode(null)}
            className={`pointer-events-auto absolute bottom-[18%] right-[50%] lg:right-[46%] bg-purple-500/90 hover:bg-purple-500 text-white font-bold text-xs px-4 py-2 rounded-full shadow-lg shadow-purple-500/20 flex items-center gap-1.5 transition-all duration-200 hover:scale-108 active:scale-95 border border-white/60 backdrop-blur-md animate-float [animation-delay:1.4s] ${
              hoveredNode?.id === 'node-lang' ? 'ring-2 ring-purple-300 scale-108 shadow-xl shadow-purple-500/30' : ''
            }`}
          >
            <span>🌐</span>
            <span>22+ Languages</span>
          </button>

          {/* Digital India Flag Badge (Bottom Right) */}
          <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-bsai-border shadow-sm flex items-center gap-2.5 text-xs font-bold text-bsai-indigo">
            <span className="text-xl">🇮🇳</span>
            <div>
              <div className="leading-tight text-[11px] font-extrabold text-bsai-indigo">Digital India</div>
              <div className="text-[9px] text-bsai-teal font-bold">AI Support For All</div>
            </div>
          </div>
        </div>
      </div>

      {/* Left-Side Hero Text & Interactive Floating Features */}
      <div className="relative z-10 max-w-7xl mx-auto h-full flex items-center px-6 lg:px-12 pointer-events-none">
        <div className="max-w-xl space-y-6 pt-10 pb-16 pointer-events-auto">
          {/* Main Hero Headings */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-md border border-bsai-saffron/40 px-3.5 py-1.5 rounded-full text-xs font-bold text-bsai-indigo shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-bsai-saffron" />
              <span>National AI Citizen Intelligence Hub</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display text-bsai-indigo tracking-tight leading-tight">
              Bharat Support <span className="text-bsai-saffron">AI</span>
            </h1>

            <p className="text-xl sm:text-2xl font-bold font-display text-bsai-teal">
              Your Voice. Our AI. A Stronger Bharat.
            </p>
          </div>

          <p className="text-sm sm:text-base text-bsai-indigoMuted leading-relaxed max-w-lg">
            Intelligent, multilingual and always available — Bharat Support AI delivers instant scheme eligibility, student scholarship guidance, document processes, and public grievance resolution.
          </p>

          {/* Primary Action Buttons (Cinematic 3D Glassmorphic CTAs) */}
          <div className="flex flex-wrap items-center gap-4 pt-1">
            <BSAIButton
              variant="cinematic-primary"
              size="lg"
              onClick={onExploreClick}
              icon={<ArrowRight className="w-4 h-4 text-cyan-200 group-hover:translate-x-1 transition-transform" />}
              iconPosition="right"
            >
              Explore BSAI
            </BSAIButton>

            <BSAIButton
              variant="cinematic-secondary"
              size="lg"
              onClick={onEnterDashboard}
              icon={
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white flex items-center justify-center shadow-xs">
                  <Play className="w-3 h-3 fill-white ml-0.5" />
                </div>
              }
              iconPosition="left"
            >
              Enter Dashboard
            </BSAIButton>
          </div>

          {/* Floating Value Badges with Colors */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4">
            <div className="bg-white/90 backdrop-blur-md p-3 rounded-2xl border border-teal-200 shadow-2xs flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-xs shrink-0">
                24/7
              </div>
              <div className="text-[11px] font-bold text-bsai-indigo leading-tight">
                Citizen Support
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-md p-3 rounded-2xl border border-purple-200 shadow-2xs flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-xs shrink-0">
                🌐
              </div>
              <div className="text-[11px] font-bold text-bsai-indigo leading-tight">
                22+ Languages
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-md p-3 rounded-2xl border border-emerald-200 shadow-2xs flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs shrink-0">
                🎓
              </div>
              <div className="text-[11px] font-bold text-bsai-indigo leading-tight">
                Study & Schemes
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-md p-3 rounded-2xl border border-amber-200 shadow-2xs flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xs shrink-0">
                ⚡
              </div>
              <div className="text-[11px] font-bold text-bsai-indigo leading-tight">
                Smart Redressal
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
