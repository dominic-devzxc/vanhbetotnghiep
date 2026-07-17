"use client";

import { Canvas, type ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  CanvasTexture,
  DoubleSide,
  Group,
  MathUtils,
  Mesh,
  RepeatWrapping,
  Shape,
} from "three";

interface EnvelopeSceneProps {
  armed: boolean;
  guestName: string;
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
const sparklePositions = Array.from({ length: 12 }, (_, index) => {
  const angle = (index / 12) * Math.PI * 2;
  const radius = index % 2 === 0 ? 0.55 : 0.48;
  return [Math.cos(angle) * radius, Math.sin(angle) * radius, 0.025] as const;
});

function createPaperTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const context = canvas.getContext("2d");
  if (!context) return null;

  context.fillStyle = "#E2C3C1";
  context.fillRect(0, 0, 128, 128);
  for (let index = 0; index < 500; index += 1) {
    const alpha = 0.015 + ((index * 17) % 11) / 500;
    context.fillStyle = `rgba(105, 63, 72, ${alpha})`;
    context.fillRect((index * 37) % 128, (index * 53) % 128, 1, 1);
  }

  const texture = new CanvasTexture(canvas);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(3, 3);
  return texture;
}

function createInvitationTexture(guestName: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 768;
  canvas.height = 460;
  const context = canvas.getContext("2d");
  if (!context) return null;

  context.fillStyle = "#FFF6EC";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.lineWidth = 12;
  context.strokeStyle = "#C5B3D3";
  context.strokeRect(24, 24, canvas.width - 48, canvas.height - 48);
  context.lineWidth = 3;
  context.strokeStyle = "#EBC5A5";
  context.strokeRect(43, 43, canvas.width - 86, canvas.height - 86);
  context.fillStyle = "#7C5B8B";
  context.textAlign = "center";
  context.font = "italic 38px Georgia, serif";
  context.fillText("Thân gửi", canvas.width / 2, 190);
  context.font = "bold 52px Georgia, serif";
  context.fillText(guestName || "người bạn thân mến", canvas.width / 2, 266);
  context.font = "28px Georgia, serif";
  context.fillStyle = "#A66C79";
  context.fillText("Một lời mời dành riêng cho bạn", canvas.width / 2, 332);
  return new CanvasTexture(canvas);
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
    const radius = 0.355 + Math.sin(angle * 7) * 0.012 + Math.sin(angle * 11 + 0.8) * 0.008;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    if (index === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }

  shape.closePath();
  return shape;
}

function createLeafShape() {
  const shape = new Shape();
  shape.moveTo(0, 0);
  shape.quadraticCurveTo(0.085, 0.025, 0.125, 0.105);
  shape.quadraticCurveTo(0.035, 0.09, 0, 0);
  shape.closePath();
  return shape;
}

function WaxBranch({ armed }: { armed: boolean }) {
  const stem = useMemo(() => {
    const shape = new Shape();
    shape.moveTo(-0.025, -0.17);
    shape.quadraticCurveTo(0.01, -0.02, -0.01, 0.18);
    shape.lineTo(0.025, 0.18);
    shape.quadraticCurveTo(0.045, -0.02, 0.012, -0.17);
    shape.closePath();
    return shape;
  }, []);
  const leaf = useMemo(createLeafShape, []);

  const color = armed ? "#D98A9C" : "#C7B3BC";
  const metalness = armed ? 0.22 : 0.12;
  const roughness = armed ? 0.36 : 0.48;

  return (
    <group position={[0, 0, 0.225]}>
      <mesh castShadow>
        <shapeGeometry args={[stem]} />
        <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} />
      </mesh>
      {[-0.11, -0.025, 0.06].flatMap((y) => [
        <mesh castShadow key={`left-${y}`} position={[-0.018, y, 0.008]} rotation={[0, 0, 2.42]}>
          <shapeGeometry args={[leaf]} />
          <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} />
        </mesh>,
        <mesh castShadow key={`right-${y}`} position={[0.018, y + 0.025, 0.008]} rotation={[0, 0, 0.72]}>
          <shapeGeometry args={[leaf]} />
          <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} />
        </mesh>,
      ])}
      <mesh castShadow position={[0.005, 0.18, 0.008]} rotation={[0, 0, 1.08]} scale={0.8}>
        <shapeGeometry args={[leaf]} />
        <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} />
      </mesh>
    </group>
  );
}

function SparkleRing({ armed, reducedMotion }: Pick<EnvelopeSceneProps, "armed" | "reducedMotion">) {
  const ring = useRef<Group>(null);

  useFrame(({ clock }, delta) => {
    if (!ring.current || !armed) return;
    const elapsed = clock.getElapsedTime();
    ring.current.rotation.z += reducedMotion ? 0 : delta * 0.16;
    ring.current.scale.setScalar(reducedMotion ? 1 : 1 + Math.sin(elapsed * 2.8) * 0.035);
  });

  if (!armed) return null;

  return (
    <group ref={ring}>
      <mesh position={[0, 0, 0.005]}>
        <torusGeometry args={[0.51, 0.007, 8, 64]} />
        <meshBasicMaterial color="#FFE6C7" transparent opacity={0.72} />
      </mesh>
      {sparklePositions.map((position, index) => (
        <mesh key={index} position={position} rotation={[0, 0, index * 0.52]} scale={index % 3 === 0 ? 1.35 : 0.82}>
          <octahedronGeometry args={[0.035, 0]} />
          <meshBasicMaterial color="#FFF9E8" transparent opacity={index % 2 ? 0.72 : 1} />
        </mesh>
      ))}
    </group>
  );
}

function GlowRing({ armed }: { armed: boolean }) {
  const meshRef = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const elapsed = clock.getElapsedTime();
    meshRef.current.scale.setScalar(1.22 + Math.sin(elapsed * 3.5) * 0.035);
    const mat = meshRef.current.material as any;
    if (mat) {
      mat.opacity = 0.32 + Math.sin(elapsed * 3.5) * 0.1;
    }
  });

  if (!armed) return null;

  return (
    <mesh position={[0, 0, -0.06]} ref={meshRef}>
      <ringGeometry args={[0.34, 0.55, 32]} />
      <meshBasicMaterial color="#FFE6E6" transparent opacity={0.32} side={DoubleSide} />
    </mesh>
  );
}

function Sparkle({ x, y, size, blinkDelay }: { x: number; y: number; size: number; blinkDelay: number }) {
  const meshRef = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const elapsed = clock.getElapsedTime();
    const mat = meshRef.current.material as any;
    if (mat) {
      mat.opacity = 0.35 + Math.sin(elapsed * 4.2 + blinkDelay) * 0.35;
    }
  });

  return (
    <mesh position={[x, y, 0.05]} ref={meshRef}>
      <circleGeometry args={[size, 8]} />
      <meshBasicMaterial color="#FFF5EB" transparent opacity={0.35} side={DoubleSide} />
    </mesh>
  );
}

function EnvelopeModel({
  armed,
  guestName,
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
  const invitationCard = useRef<Mesh>(null);
  const completed = useRef(false);
  const startedAt = useRef<number | null>(null);
  const { camera, gl, pointer } = useThree();
  const paperTexture = useMemo(createPaperTexture, []);
  const invitationTexture = useMemo(() => createInvitationTexture(guestName), [guestName]);
  const waxSealShape = useMemo(createWaxSealShape, []);
  const leftFold = useMemo(() => createTriangle([[-2.175, -1.33], [-2.175, 1.33], [0, -0.02]]), []);
  const rightFold = useMemo(() => createTriangle([[2.175, -1.33], [2.175, 1.33], [0, -0.02]]), []);
  const bottomFold = useMemo(() => createTriangle([[-2.175, -1.33], [2.175, -1.33], [0, 0.34]]), []);
  const topFlap = useMemo(() => createTriangle([[-2.175, 0], [2.175, 0], [0, -1.55]]), []);

  useEffect(() => {
    onReady();
    return () => paperTexture?.dispose();
  }, [onReady, paperTexture]);

  useEffect(() => () => invitationTexture?.dispose(), [invitationTexture]);

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
    if (!envelopeGroup.current || !flapPivot.current || !waxSeal.current || !invitationCard.current) return;
    const elapsed = clock.getElapsedTime();
    const envelope = envelopeGroup.current;

    if (!opening) {
      envelope.position.y = reducedMotion ? 0 : Math.sin(elapsed * 0.8) * 0.055;
      envelope.rotation.x = MathUtils.damp(envelope.rotation.x, -0.15 + pointer.y * 0.07, 5, delta);
      envelope.rotation.y = MathUtils.damp(envelope.rotation.y, pointer.x * 0.07, 5, delta);
      flapPivot.current.rotation.x = MathUtils.damp(flapPivot.current.rotation.x, 0, 7, delta);
      waxSeal.current.position.set(0, -0.22, 0.29);
      waxSeal.current.rotation.set(0, 0, 0);
      waxSeal.current.scale.setScalar(armed && !reducedMotion ? 1 + Math.sin(elapsed * 2.8) * 0.025 : 1);
      invitationCard.current.position.set(0, -0.05, 0.08);
      invitationCard.current.rotation.set(0, 0, 0);
      camera.position.z = MathUtils.damp(camera.position.z, 5.3, 4, delta);
      camera.position.y = MathUtils.damp(camera.position.y, 0.52, 4, delta);
      camera.lookAt(0, 0, 0);
      return;
    }

    if (startedAt.current === null) startedAt.current = elapsed;
    const duration = reducedMotion ? 0.65 : 2.6;
    const progress = Math.min((elapsed - startedAt.current) / duration, 1);
    const sealProgress = Math.min(progress / 0.2, 1);
    const flapProgress = MathUtils.clamp((progress - 0.17) / 0.45, 0, 1);
    const cardProgress = MathUtils.clamp((progress - 0.43) / 0.43, 0, 1);
    const easedSeal = 1 - (1 - sealProgress) ** 3;
    const easedFlap = flapProgress * flapProgress * (3 - 2 * flapProgress);
    const easedCard = 1 - (1 - cardProgress) ** 3;

    waxSeal.current.position.set(0, -0.22 + easedSeal * 0.28, 0.29 + easedSeal * 0.4);
    waxSeal.current.rotation.set(easedSeal * 0.16, 0, easedSeal * 0.18);
    waxSeal.current.scale.setScalar(Math.max(0.01, 1 - easedSeal));
    flapPivot.current.rotation.x = -Math.PI * 0.972 * easedFlap;
    invitationCard.current.position.set(0, -0.05 + easedCard * 1.62, 0.08 + easedCard * 0.46);
    invitationCard.current.rotation.x = -0.25 * (1 - easedCard);
    envelope.position.y = MathUtils.damp(envelope.position.y, 0, 6, delta);
    envelope.rotation.x = MathUtils.damp(envelope.rotation.x, -0.15, 6, delta);
    envelope.rotation.y = MathUtils.damp(envelope.rotation.y, 0, 6, delta);
    camera.position.z = MathUtils.damp(camera.position.z, 4.65, 3.5, delta);
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
        <meshStandardMaterial color="#DAB9B7" map={paperTexture ?? undefined} roughness={0.86} metalness={0.01} />
      </mesh>

      <mesh castShadow name="invitationCard" receiveShadow ref={invitationCard} position={[0, -0.05, 0.08]}>
        <boxGeometry args={[3.65, 2.18, 0.075]} />
        <meshStandardMaterial color="#FFF6EC" roughness={0.88} />
        <mesh position={[0, 0, 0.045]}>
          <boxGeometry args={[3.36, 1.89, 0.008]} />
          <meshStandardMaterial color="#FDF6F1" map={invitationTexture ?? undefined} roughness={0.9} />
        </mesh>
      </mesh>

      <mesh castShadow name="leftFold" position={[0, 0, envelopeDepth / 2 + 0.018]}>
        <extrudeGeometry args={[leftFold, { depth: 0.035, bevelEnabled: false }]} />
        <meshStandardMaterial color="#C7A2A5" roughness={0.86} side={DoubleSide} />
      </mesh>
      <mesh castShadow name="rightFold" position={[0, 0, envelopeDepth / 2 + 0.019]}>
        <extrudeGeometry args={[rightFold, { depth: 0.034, bevelEnabled: false }]} />
        <meshStandardMaterial color="#E0BEC0" roughness={0.86} side={DoubleSide} />
      </mesh>
      <mesh castShadow name="bottomFold" position={[0, 0, envelopeDepth / 2 + 0.06]}>
        <extrudeGeometry args={[bottomFold, { depth: 0.035, bevelEnabled: false }]} />
        <meshStandardMaterial color="#D1AAAC" roughness={0.84} side={DoubleSide} />
      </mesh>

      <group name="flapPivot" position={[0, envelopeHeight / 2, envelopeDepth / 2 + 0.04]} ref={flapPivot}>
        <mesh castShadow name="topFlap" position={[0, 0, 0]}>
          <extrudeGeometry args={[topFlap, { depth: 0.055, bevelEnabled: false }]} />
          <meshStandardMaterial color="#E5C5C3" map={paperTexture ?? undefined} roughness={0.82} side={DoubleSide} />
        </mesh>
        <mesh position={[-1.07, -0.77, 0.062]} rotation={[0, 0, -0.62]}>
          <boxGeometry args={[2.57, 0.016, 0.025]} />
          <meshStandardMaterial color="#C89472" metalness={0.16} roughness={0.48} />
        </mesh>
        <mesh position={[1.07, -0.77, 0.062]} rotation={[0, 0, 0.62]}>
          <boxGeometry args={[2.57, 0.016, 0.025]} />
          <meshStandardMaterial color="#C89472" metalness={0.16} roughness={0.48} />
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
        position={[0, -0.22, 0.29]}
        ref={waxSeal}
      >
        <pointLight color={armed ? "#FFE5D9" : "#F7C6C0"} distance={2.5} intensity={armed ? 4.2 : 0.15} />
        <GlowRing armed={armed} />
        {armed && Array.from({ length: 8 }).map((_, idx) => {
          const angle = (idx * Math.PI * 2) / 8 + idx * 0.25;
          const dist = 0.65 + Math.sin(idx * 2.3) * 0.14;
          const x = Math.cos(angle) * dist;
          const y = Math.sin(angle) * dist;
          const size = 0.015 + Math.abs(Math.sin(idx * 1.5)) * 0.02;
          const blinkDelay = idx * 0.45;
          return (
            <Sparkle
              key={`sparkle-${idx}`}
              x={x}
              y={y}
              size={size}
              blinkDelay={blinkDelay}
            />
          );
        })}
        <mesh castShadow position={[0, 0, 0.07]}>
          <extrudeGeometry
            args={[waxSealShape, { bevelEnabled: true, bevelSegments: 3, bevelSize: 0.022, bevelThickness: 0.018, curveSegments: 64, depth: 0.12 }]}
          />
          <meshStandardMaterial color={armed ? "#A64A62" : "#B39EA8"} metalness={0.14} roughness={0.44} transparent opacity={armed ? 1 : 0.72} />
        </mesh>

        <mesh position={[0, 0, 0.218]}>
          <torusGeometry args={[0.275, 0.018, 12, 64]} />
          <meshStandardMaterial color={armed ? "#D98A9C" : "#C7B3BC"} metalness={armed ? 0.22 : 0.12} roughness={armed ? 0.36 : 0.48} />
        </mesh>
        <WaxBranch armed={armed} />
      </group>
    </group>
  );
}

function SceneContents(props: EnvelopeSceneProps) {
  return (
    <>
      <ambientLight intensity={1.55} />
      <directionalLight castShadow intensity={1.15} position={[-4, 6, 5]} shadow-mapSize={[1024, 1024]} />
      <spotLight castShadow angle={0.6} intensity={1.45} penumbra={0.7} position={[1.5, 4.5, 5]} />
      <mesh position={[0, -1.58, -0.16]} scale={[2.35, 0.24, 1]}>
        <circleGeometry args={[1, 48]} />
        <meshBasicMaterial color="#7C5B8B" opacity={0.15} transparent />
      </mesh>
      <EnvelopeModel {...props} />
    </>
  );
}

export default function EnvelopeScene(props: EnvelopeSceneProps) {
  return (
    <Canvas
      camera={{ fov: 34, position: [0, 0.52, 5.3] }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      shadows
    >
      <SceneContents {...props} />
    </Canvas>
  );
}
