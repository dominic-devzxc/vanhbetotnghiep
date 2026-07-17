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
  const radius = index % 2 === 0 ? 0.7 : 0.62;
  return [Math.cos(angle) * radius, Math.sin(angle) * radius, 0.025] as const;
});

function createPaperTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const context = canvas.getContext("2d");
  if (!context) return null;

  context.fillStyle = "#B59EC8";
  context.fillRect(0, 0, 128, 128);
  for (let index = 0; index < 500; index += 1) {
    const alpha = 0.015 + ((index * 17) % 11) / 500;
    context.fillStyle = `rgba(75, 48, 93, ${alpha})`;
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

  // Khi con dấu sáng lên, cành lá có cùng màu sáp hồng trà nhưng sáng màu bắt sáng để tạo khối nổi bật chân thực
  const color = armed ? "#E5A9A0" : "#D2BFCE";
  const metalness = armed ? 0.38 : 0.25;
  const roughness = armed ? 0.28 : 0.35;

  return (
    <group position={[0, 0, 0.21]}>
      <mesh castShadow>
        <shapeGeometry args={[stem]} />
        <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} />
      </mesh>
      {[-0.1, -0.02, 0.08].flatMap((y, index) => [
        <mesh castShadow key={`left-${y}`} position={[-0.07, y, 0.008]} rotation={[0, 0, -0.7]} scale={[0.8, 0.5, 1]}>
          <sphereGeometry args={[0.075, 12, 12]} />
          <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} />
        </mesh>,
        <mesh castShadow key={`right-${y}`} position={[0.07, y + 0.025, 0.008]} rotation={[0, 0, 0.7]} scale={[0.8, 0.5, 1]}>
          <sphereGeometry args={[0.075, 12, 12]} />
          <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} />
        </mesh>,
      ])}
      <mesh castShadow position={[0.01, 0.22, 0.008]}>
        <sphereGeometry args={[0.055, 16, 16]} />
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
        <torusGeometry args={[0.65, 0.008, 8, 64]} />
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
      <ringGeometry args={[0.45, 0.72, 32]} />
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
        <meshStandardMaterial color="#B59EC8" map={paperTexture ?? undefined} roughness={0.78} metalness={0.03} />
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
        <meshStandardMaterial color="#A48CB8" roughness={0.78} side={DoubleSide} />
      </mesh>
      <mesh castShadow name="rightFold" position={[0, 0, envelopeDepth / 2 + 0.019]}>
        <extrudeGeometry args={[rightFold, { depth: 0.034, bevelEnabled: false }]} />
        <meshStandardMaterial color="#BCA7CE" roughness={0.78} side={DoubleSide} />
      </mesh>
      <mesh castShadow name="bottomFold" position={[0, 0, envelopeDepth / 2 + 0.06]}>
        <extrudeGeometry args={[bottomFold, { depth: 0.035, bevelEnabled: false }]} />
        <meshStandardMaterial color="#B099C2" roughness={0.75} side={DoubleSide} />
      </mesh>

      <group name="flapPivot" position={[0, envelopeHeight / 2, envelopeDepth / 2 + 0.04]} ref={flapPivot}>
        <mesh castShadow name="topFlap" position={[0, 0, 0]}>
          <extrudeGeometry args={[topFlap, { depth: 0.055, bevelEnabled: false }]} />
          <meshStandardMaterial color="#BFA8D1" map={paperTexture ?? undefined} roughness={0.72} side={DoubleSide} />
        </mesh>
        <mesh position={[-1.07, -0.77, 0.062]} rotation={[0, 0, -0.62]}>
          <boxGeometry args={[2.57, 0.016, 0.025]} />
          <meshStandardMaterial color="#DFB088" metalness={0.92} roughness={0.1} />
        </mesh>
        <mesh position={[1.07, -0.77, 0.062]} rotation={[0, 0, 0.62]}>
          <boxGeometry args={[2.57, 0.016, 0.025]} />
          <meshStandardMaterial color="#DFB088" metalness={0.92} roughness={0.1} />
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
        <mesh castShadow position={[0, 0, 0.09]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.46, 0.5, 0.17, 48]} />
          <meshStandardMaterial color={armed ? "#D88D86" : "#B89EAD"} metalness={0.36} roughness={0.31} transparent opacity={armed ? 1 : 0.65} />
        </mesh>
        {Array.from({ length: 7 }).map((_, i) => {
          const angle = (i * Math.PI * 2) / 7;
          const radius = 0.4 + Math.sin(i * 1.8) * 0.035;
          const scale = 0.11 + Math.cos(i * 1.5) * 0.025;
          return (
            <mesh
              key={i}
              position={[Math.cos(angle) * radius, Math.sin(angle) * radius, 0.1]}
              scale={[scale * 3.3, scale * 3.3, 0.18]}
            >
              <sphereGeometry args={[1, 16, 16]} />
              <meshStandardMaterial
                color={armed ? "#D6948A" : "#B89EAD"}
                metalness={0.22}
                roughness={0.42}
                transparent
                opacity={armed ? 1 : 0.65}
              />
            </mesh>
          );
        })}

        <mesh position={[0, 0, 0.195]}>
          <torusGeometry args={[0.35, 0.028, 12, 64]} />
          <meshStandardMaterial color={armed ? "#F0B1A5" : "#C4ABB9"} metalness={armed ? 0.44 : 0.2} roughness={armed ? 0.24 : 0.4} />
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
