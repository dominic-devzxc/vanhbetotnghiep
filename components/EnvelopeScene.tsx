"use client";

import { Canvas, type ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  CanvasTexture,
  DoubleSide,
  Group,
  MathUtils,
  RepeatWrapping,
  Shape,
  SRGBColorSpace,
} from "three";

interface EnvelopeSceneProps {
  armed: boolean;
  onInvalidSealClick: () => void;
  onOpenComplete: () => void;
  onReady: () => void;
  onSealClick: () => void;
  opening?: boolean;
  reducedMotion?: boolean;
}

const envelopeWidth = 4.35;
const envelopeHeight = 2.66;
const envelopeDepth = 0.16;
const waxSealScale = 1.12;
const ornamentDots = Array.from({ length: 12 }, (_, index) => {
  const angle = (index / 12) * Math.PI * 2;
  return [Math.cos(angle) * 0.242, Math.sin(angle) * 0.242] as const;
});
const haloSparkles = Array.from({ length: 10 }, (_, index) => {
  const angle = (index / 10) * Math.PI * 2;
  return [Math.cos(angle) * 0.655, Math.sin(angle) * 0.655] as const;
});

function createPaperTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const context = canvas.getContext("2d");
  if (!context) return null;

  context.fillStyle = "#FFF9F8";
  context.fillRect(0, 0, 128, 128);
  for (let index = 0; index < 500; index += 1) {
    const alpha = 0.008 + ((index * 17) % 11) / 700;
    context.fillStyle = `rgba(116, 78, 88, ${alpha})`;
    context.fillRect((index * 37) % 128, (index * 53) % 128, 1, 1);
  }

  const texture = new CanvasTexture(canvas);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(3, 3);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

function createTriangle(points: Array<[number, number]>) {
  const shape = new Shape();
  points.forEach(([x, y], index) => {
    if (index === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  });
  shape.closePath();
  return shape;
}

function createWaxSealShape() {
  const shape = new Shape();
  const segments = 64;

  for (let index = 0; index <= segments; index += 1) {
    const angle = (index / segments) * Math.PI * 2;
    const radius = 0.39 + Math.sin(angle * 7) * 0.014 + Math.sin(angle * 11 + 0.8) * 0.009;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    if (index === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }

  shape.closePath();
  return shape;
}

function createLaurelLeafShape() {
  const shape = new Shape();
  shape.moveTo(-0.04, 0);
  shape.quadraticCurveTo(0.005, 0.027, 0.052, 0);
  shape.quadraticCurveTo(0.005, -0.027, -0.04, 0);
  shape.closePath();
  return shape;
}

function createGraduationCapTop() {
  return createTriangle([[-0.14, 0.035], [0, 0.11], [0.14, 0.035], [0, -0.04]]);
}

function createGraduationCapBand() {
  return createTriangle([[-0.092, -0.035], [0.092, -0.035], [0.07, -0.105], [-0.07, -0.105]]);
}

function createTasselShape() {
  return createTriangle([[0.112, 0.032], [0.126, 0.032], [0.105, -0.11], [0.09, -0.11]]);
}

function SealHalo({ armed }: { armed: boolean }) {
  const groupRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current || !armed) return;
    const elapsed = clock.getElapsedTime();
    // Quay vòng sáng quanh con dấu theo chiều kim đồng hồ
    groupRef.current.rotation.z = elapsed * 0.26;
    // Co giãn pulsing nhẹ nhàng
    groupRef.current.scale.setScalar(1.08 + Math.sin(elapsed * 2.8) * 0.032);
  });

  if (!armed) return null;

  return (
    <group position={[0, 0, 0.055]} ref={groupRef}>
      <pointLight color="#FFE2B8" distance={2.2} intensity={1.2} position={[0, 0, 0.18]} />
      {/* Vòng hào quang sáng trong (To hơn) */}
      <mesh>
        <ringGeometry args={[0.58, 0.62, 64]} />
        <meshBasicMaterial color="#FFE2B8" opacity={0.48} side={DoubleSide} transparent />
      </mesh>
      {/* Vòng hào quang sáng ngoài (To hơn) */}
      <mesh position={[0, 0, -0.002]}>
        <ringGeometry args={[0.66, 0.67, 64]} />
        <meshBasicMaterial color="#FFF1D4" opacity={0.32} side={DoubleSide} transparent />
      </mesh>
      {/* Vòng tỏa mờ siêu to ngoài cùng */}
      <mesh position={[0, 0, -0.004]}>
        <ringGeometry args={[0.67, 0.85, 64]} />
        <meshBasicMaterial color="#FFE6E6" opacity={0.16} side={DoubleSide} transparent />
      </mesh>
      {/* Các hạt sáng lấp lánh (Sparkles) bay nhảy quay theo */}
      {haloSparkles.map(([x, y], index) => (
        <mesh key={`halo-${index}`} position={[x, y, 0.012]} rotation={[0, 0, index * 0.63]} scale={index % 2 === 0 ? 1 : 0.7}>
          <octahedronGeometry args={[0.024, 0]} />
          <meshBasicMaterial color="#FFF0CE" />
        </mesh>
      ))}
    </group>
  );
}

function WaxMedallion({ armed }: { armed: boolean }) {
  const leaf = useMemo(createLaurelLeafShape, []);
  const graduationCapTop = useMemo(createGraduationCapTop, []);
  const graduationCapBand = useMemo(createGraduationCapBand, []);
  const tassel = useMemo(createTasselShape, []);

  const color = armed ? "#F4BEC0" : "#E9C9D0";
  const detailColor = armed ? "#FFE3D2" : "#F7E5E7";
  const metalness = armed ? 0.18 : 0.08;
  const roughness = armed ? 0.38 : 0.52;
  const emboss = { bevelEnabled: true, bevelSegments: 2, bevelSize: 0.004, bevelThickness: 0.004, depth: 0.018 } as const;

  return (
    <group position={[0, 0, 0.222]}>
      <mesh castShadow>
        <torusGeometry args={[0.292, 0.016, 12, 64]} />
        <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} />
      </mesh>
      <mesh castShadow position={[0, 0, 0.004]}>
        <torusGeometry args={[0.185, 0.008, 10, 64]} />
        <meshStandardMaterial color={detailColor} metalness={metalness} roughness={roughness} />
      </mesh>

      {ornamentDots.map(([x, y], index) => (
        <mesh castShadow key={`dot-${index}`} position={[x, y, 0.012]}>
          <circleGeometry args={[index % 3 === 0 ? 0.014 : 0.01, 16]} />
          <meshStandardMaterial color={detailColor} metalness={metalness} roughness={roughness} />
        </mesh>
      ))}

      {[-0.095, -0.03, 0.035, 0.1].flatMap((y, index) => [
        <mesh castShadow key={`laurel-left-${y}`} position={[-0.135 - index * 0.006, y, 0.014]} rotation={[0, 0, 0.72 + index * 0.12]} scale={0.82}>
          <shapeGeometry args={[leaf]} />
          <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} />
        </mesh>,
        <mesh castShadow key={`laurel-right-${y}`} position={[0.135 + index * 0.006, y, 0.014]} rotation={[0, 0, 2.42 - index * 0.12]} scale={0.82}>
          <shapeGeometry args={[leaf]} />
          <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} />
        </mesh>,
      ])}

      <mesh castShadow position={[0, 0.012, 0.016]}>
        <extrudeGeometry args={[graduationCapTop, emboss]} />
        <meshStandardMaterial color={detailColor} metalness={metalness} roughness={roughness} />
      </mesh>
      <mesh castShadow position={[0, 0.002, 0.016]}>
        <extrudeGeometry args={[graduationCapBand, emboss]} />
        <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} />
      </mesh>
      <mesh castShadow position={[0, 0.01, 0.017]}>
        <extrudeGeometry args={[tassel, emboss]} />
        <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} />
      </mesh>
      <mesh castShadow position={[0.097, -0.105, 0.04]}>
        <sphereGeometry args={[0.018, 16, 12]} />
        <meshStandardMaterial color={detailColor} metalness={metalness} roughness={roughness} />
      </mesh>
    </group>
  );
}

function EnvelopeModel({
  armed,
  onInvalidSealClick,
  onOpenComplete,
  onReady,
  onSealClick,
  opening = false,
  reducedMotion = false,
}: EnvelopeSceneProps) {
  const envelopeGroup = useRef<Group>(null);
  const flapPivot = useRef<Group>(null);
  const waxSeal = useRef<Group>(null);
  const completed = useRef(false);
  const startedAt = useRef<number | null>(null);
  const { camera, gl, pointer } = useThree();
  const paperTexture = useMemo(createPaperTexture, []);
  const waxSealShape = useMemo(createWaxSealShape, []);
  const leftFold = useMemo(() => createTriangle([[-2.175, -1.33], [-2.175, 1.33], [0, -0.02]]), []);
  const rightFold = useMemo(() => createTriangle([[2.175, -1.33], [2.175, 1.33], [0, -0.02]]), []);
  const bottomFold = useMemo(() => createTriangle([[-2.175, -1.33], [2.175, -1.33], [0, 0.34]]), []);
  const topFlap = useMemo(() => createTriangle([[-2.175, 0], [2.175, 0], [0, -1.55]]), []);

  useEffect(() => {
    onReady();
    return () => paperTexture?.dispose();
  }, [onReady, paperTexture]);

  useEffect(() => {
    if (!opening) {
      startedAt.current = null;
      completed.current = false;
    }
  }, [opening]);

  const activateSeal = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    if (!armed) {
      onInvalidSealClick();
      return;
    }
    if (!opening) onSealClick();
  };

  const setSealCursor = (active: boolean) => {
    gl.domElement.style.cursor = active && armed && !opening ? "pointer" : "default";
  };

  useFrame(({ clock }, delta) => {
    if (!envelopeGroup.current || !flapPivot.current || !waxSeal.current) return;
    const elapsed = clock.getElapsedTime();
    const envelope = envelopeGroup.current;

    if (!opening) {
      envelope.position.y = reducedMotion ? 0 : Math.sin(elapsed * 0.8) * 0.055;
      envelope.rotation.x = MathUtils.damp(envelope.rotation.x, -0.15 + pointer.y * 0.07, 5, delta);
      envelope.rotation.y = MathUtils.damp(envelope.rotation.y, pointer.x * 0.07, 5, delta);
      flapPivot.current.rotation.x = MathUtils.damp(flapPivot.current.rotation.x, 0, 7, delta);
      waxSeal.current.position.set(0, -0.02, 0.29);
      waxSeal.current.rotation.set(0, 0, 0);
      waxSeal.current.scale.setScalar(waxSealScale);
      camera.position.z = MathUtils.damp(camera.position.z, 7.0, 4, delta);
      camera.position.y = MathUtils.damp(camera.position.y, 0.52, 4, delta);
      camera.lookAt(0, 0, 0);
      return;
    }

    if (startedAt.current === null) startedAt.current = elapsed;
    const duration = reducedMotion ? 0.65 : 2.6;
    const progress = Math.min((elapsed - startedAt.current) / duration, 1);
    const sealProgress = Math.min(progress / 0.2, 1);
    const flapProgress = MathUtils.clamp((progress - 0.17) / 0.45, 0, 1);
    const easedSeal = 1 - (1 - sealProgress) ** 3;
    const easedFlap = flapProgress * flapProgress * (3 - 2 * flapProgress);

    waxSeal.current.position.set(0, -0.02 + easedSeal * 0.28, 0.29 + easedSeal * 0.4);
    waxSeal.current.rotation.set(easedSeal * 0.16, 0, easedSeal * 0.18);
    waxSeal.current.scale.setScalar(Math.max(0.01, waxSealScale * (1 - easedSeal)));
    flapPivot.current.rotation.x = -Math.PI * 0.972 * easedFlap;
    envelope.position.y = MathUtils.damp(envelope.position.y, 0, 6, delta);
    envelope.rotation.x = MathUtils.damp(envelope.rotation.x, -0.15, 6, delta);
    envelope.rotation.y = MathUtils.damp(envelope.rotation.y, 0, 6, delta);
    camera.position.z = MathUtils.damp(camera.position.z, 6.15, 3.5, delta);
    camera.position.y = MathUtils.damp(camera.position.y, 0.42, 3.5, delta);
    camera.lookAt(0, 0.1, 0);

    if (progress === 1 && !completed.current) {
      completed.current = true;
      onOpenComplete();
    }
  });

  return (
    <group name="envelopeGroup" ref={envelopeGroup} rotation={[-0.06, 0, 0]}>
      <mesh castShadow name="envelopeBody" receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[envelopeWidth, envelopeHeight, envelopeDepth]} />
        <meshStandardMaterial color="#D7C0DE" map={paperTexture ?? undefined} roughness={0.88} metalness={0} />
      </mesh>

      <mesh castShadow name="leftFold" position={[0, 0, envelopeDepth / 2 + 0.018]}>
        <extrudeGeometry args={[leftFold, { depth: 0.035, bevelEnabled: false }]} />
        <meshStandardMaterial color="#B89CC2" roughness={0.88} side={DoubleSide} />
      </mesh>
      <mesh castShadow name="rightFold" position={[0, 0, envelopeDepth / 2 + 0.019]}>
        <extrudeGeometry args={[rightFold, { depth: 0.034, bevelEnabled: false }]} />
        <meshStandardMaterial color="#D8C2DF" roughness={0.88} side={DoubleSide} />
      </mesh>
      <mesh castShadow name="bottomFold" position={[0, 0, envelopeDepth / 2 + 0.06]}>
        <extrudeGeometry args={[bottomFold, { depth: 0.035, bevelEnabled: false }]} />
        <meshStandardMaterial color="#C9ADD1" roughness={0.86} side={DoubleSide} />
      </mesh>
      <mesh position={[-1.0875, -0.495, envelopeDepth / 2 + 0.102]} rotation={[0, 0, 0.655]}>
        <boxGeometry args={[2.742, 0.014, 0.022]} />
        <meshStandardMaterial color="#E0B77F" metalness={0.1} roughness={0.5} />
      </mesh>
      <mesh position={[1.0875, -0.495, envelopeDepth / 2 + 0.102]} rotation={[0, 0, -0.655]}>
        <boxGeometry args={[2.742, 0.014, 0.022]} />
        <meshStandardMaterial color="#E0B77F" metalness={0.1} roughness={0.5} />
      </mesh>
      <mesh position={[0, -1.326, envelopeDepth / 2 + 0.102]}>
        <boxGeometry args={[4.33, 0.014, 0.022]} />
        <meshStandardMaterial color="#E0B77F" metalness={0.1} roughness={0.5} />
      </mesh>

      <group name="flapPivot" position={[0, envelopeHeight / 2, envelopeDepth / 2 + 0.04]} ref={flapPivot}>
        <mesh castShadow name="topFlap" position={[0, 0, 0]}>
          <extrudeGeometry args={[topFlap, { depth: 0.055, bevelEnabled: false }]} />
          <meshStandardMaterial color="#E5D3EA" map={paperTexture ?? undefined} roughness={0.86} side={DoubleSide} />
        </mesh>
        <mesh position={[-1.07, -0.77, 0.062]} rotation={[0, 0, -0.62]}>
          <boxGeometry args={[2.57, 0.016, 0.025]} />
          <meshStandardMaterial color="#E0B77F" metalness={0.1} roughness={0.5} />
        </mesh>
        <mesh position={[1.07, -0.77, 0.062]} rotation={[0, 0, 0.62]}>
          <boxGeometry args={[2.57, 0.016, 0.025]} />
          <meshStandardMaterial color="#E0B77F" metalness={0.1} roughness={0.5} />
        </mesh>
      </group>

      <group
        name="waxSeal"
        onClick={activateSeal}
        onPointerOut={() => setSealCursor(false)}
        onPointerOver={(event) => {
          event.stopPropagation();
          setSealCursor(true);
        }}
        position={[0, -0.02, 0.29]}
        ref={waxSeal}
      >
        <mesh castShadow position={[0, 0, 0.07]}>
          <extrudeGeometry
            args={[waxSealShape, { bevelEnabled: true, bevelSegments: 3, bevelSize: 0.022, bevelThickness: 0.018, curveSegments: 64, depth: 0.12 }]}
          />
          <meshStandardMaterial color={armed ? "#E9959F" : "#DDB8C0"} metalness={armed ? 0.18 : 0.08} roughness={armed ? 0.36 : 0.52} />
        </mesh>

        <SealHalo armed={armed} />
        <WaxMedallion armed={armed} />
      </group>
    </group>
  );
}

function SceneContents(props: EnvelopeSceneProps) {
  return (
    <>
      <ambientLight intensity={1.8} />
      <directionalLight castShadow intensity={0.8} position={[-4, 6, 5]} shadow-mapSize={[1024, 1024]} />
      <spotLight castShadow angle={0.6} intensity={0.7} penumbra={0.8} position={[1.5, 4.5, 5]} />
      <mesh position={[0, -1.58, -0.16]} scale={[2.35, 0.24, 1]}>
        <circleGeometry args={[1, 48]} />
        <meshBasicMaterial color="#C99EAE" opacity={0.11} transparent />
      </mesh>
      <EnvelopeModel {...props} />
    </>
  );
}

export default function EnvelopeScene(props: EnvelopeSceneProps) {
  return (
    <Canvas
      camera={{ fov: 34, position: [0, 0.52, 7.0] }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      shadows
    >
      <SceneContents {...props} />
    </Canvas>
  );
}
