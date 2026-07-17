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

function createPaperTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 96;
  canvas.height = 96;
  const context = canvas.getContext("2d");
  if (!context) return null;

  context.fillStyle = "#C5B3D3";
  context.fillRect(0, 0, 96, 96);
  for (let index = 0; index < 360; index += 1) {
    const alpha = 0.018 + ((index * 17) % 11) / 600;
    context.fillStyle = `rgba(92, 67, 111, ${alpha})`;
    context.fillRect((index * 37) % 96, (index * 53) % 96, 1, 1);
  }

  const texture = new CanvasTexture(canvas);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(4, 3);
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

function WaxBranch() {
  const stem = useMemo(() => {
    const shape = new Shape();
    shape.moveTo(-0.025, -0.17);
    shape.quadraticCurveTo(0.01, -0.02, -0.01, 0.18);
    shape.lineTo(0.025, 0.18);
    shape.quadraticCurveTo(0.045, -0.02, 0.012, -0.17);
    shape.closePath();
    return shape;
  }, []);

  return (
    <group position={[0, 0, 0.13]}>
      <mesh castShadow>
        <shapeGeometry args={[stem]} />
        <meshStandardMaterial color="#FCE8E0" metalness={0.45} roughness={0.28} />
      </mesh>
      {[-0.1, -0.02, 0.08].flatMap((y, index) => [
        <mesh castShadow key={`left-${y}`} position={[-0.07, y, 0.008]} rotation={[0, 0, -0.7]} scale={[0.8, 0.5, 1]}>
          <sphereGeometry args={[0.075, 12, 12]} />
          <meshStandardMaterial color="#FCE8E0" metalness={0.42} roughness={0.3} />
        </mesh>,
        <mesh castShadow key={`right-${y}`} position={[0.07, y + 0.025, 0.008]} rotation={[0, 0, 0.7]} scale={[0.8, 0.5, 1]}>
          <sphereGeometry args={[0.075, 12, 12]} />
          <meshStandardMaterial color="#FCE8E0" metalness={0.42} roughness={0.3} />
        </mesh>,
      ])}
      <mesh castShadow position={[0.01, 0.22, 0.008]}>
        <sphereGeometry args={[0.055, 16, 16]} />
        <meshStandardMaterial color="#FFEFE8" metalness={0.5} roughness={0.2} />
      </mesh>
    </group>
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
      waxSeal.current.position.set(0, -1.31, 0.29);
      waxSeal.current.rotation.set(Math.PI / 2, 0, 0);
      waxSeal.current.scale.setScalar(armed && !reducedMotion ? 1 + Math.sin(elapsed * 2.8) * 0.025 : 1);
      invitationCard.current.position.set(0, -0.05, 0.08);
      invitationCard.current.rotation.set(0, 0, 0);
      camera.position.z = MathUtils.damp(camera.position.z, 6.15, 4, delta);
      camera.position.y = MathUtils.damp(camera.position.y, 1.25, 4, delta);
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

    waxSeal.current.position.set(0, -1.31 + easedSeal * 0.28, 0.29 + easedSeal * 0.4);
    waxSeal.current.rotation.set(Math.PI / 2 + easedSeal * 0.16, 0, easedSeal * 0.18);
    waxSeal.current.scale.setScalar(Math.max(0.01, 1 - easedSeal));
    flapPivot.current.rotation.x = -Math.PI * 0.972 * easedFlap;
    invitationCard.current.position.set(0, -0.05 + easedCard * 1.62, 0.08 + easedCard * 0.46);
    invitationCard.current.rotation.x = -0.25 * (1 - easedCard);
    envelope.position.y = MathUtils.damp(envelope.position.y, 0, 6, delta);
    envelope.rotation.x = MathUtils.damp(envelope.rotation.x, -0.15, 6, delta);
    envelope.rotation.y = MathUtils.damp(envelope.rotation.y, 0, 6, delta);
    camera.position.z = MathUtils.damp(camera.position.z, 5.2, 3.5, delta);
    camera.position.y = MathUtils.damp(camera.position.y, 1.05, 3.5, delta);
    camera.lookAt(0, 0.1, 0);

    if (progress === 1 && !completed.current) {
      completed.current = true;
      onOpenComplete();
    }
  });

  return (
    <group name="envelopeGroup" ref={envelopeGroup} rotation={[-0.15, 0, 0]}>
      <mesh castShadow name="envelopeBody" receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[envelopeWidth, envelopeHeight, envelopeDepth]} />
        <meshStandardMaterial color="#C5B3D3" map={paperTexture ?? undefined} roughness={0.82} metalness={0.02} />
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
        <meshStandardMaterial color="#B7A1C5" roughness={0.8} side={DoubleSide} />
      </mesh>
      <mesh castShadow name="rightFold" position={[0, 0, envelopeDepth / 2 + 0.019]}>
        <extrudeGeometry args={[rightFold, { depth: 0.034, bevelEnabled: false }]} />
        <meshStandardMaterial color="#CBB9D7" roughness={0.8} side={DoubleSide} />
      </mesh>
      <mesh castShadow name="bottomFold" position={[0, 0, envelopeDepth / 2 + 0.06]}>
        <extrudeGeometry args={[bottomFold, { depth: 0.035, bevelEnabled: false }]} />
        <meshStandardMaterial color="#C0ADD0" roughness={0.79} side={DoubleSide} />
      </mesh>

      <group name="flapPivot" position={[0, envelopeHeight / 2, envelopeDepth / 2 + 0.04]} ref={flapPivot}>
        <mesh castShadow name="topFlap" position={[0, 0, 0]}>
          <extrudeGeometry args={[topFlap, { depth: 0.055, bevelEnabled: false }]} />
          <meshStandardMaterial color="#CFBDDC" map={paperTexture ?? undefined} roughness={0.78} side={DoubleSide} />
        </mesh>
        <mesh position={[-1.07, -0.77, 0.062]} rotation={[0, 0, -0.62]}>
          <boxGeometry args={[2.57, 0.021, 0.025]} />
          <meshStandardMaterial color="#EBC5A5" metalness={0.48} roughness={0.32} />
        </mesh>
        <mesh position={[1.07, -0.77, 0.062]} rotation={[0, 0, 0.62]}>
          <boxGeometry args={[2.57, 0.021, 0.025]} />
          <meshStandardMaterial color="#EBC5A5" metalness={0.48} roughness={0.32} />
        </mesh>
      </group>

      <mesh position={[-1.08, -0.5, envelopeDepth / 2 + 0.11]} rotation={[0, 0, 0.56]}>
        <boxGeometry args={[2.5, 0.021, 0.025]} />
        <meshStandardMaterial color="#EBC5A5" metalness={0.45} roughness={0.3} />
      </mesh>
      <mesh position={[1.08, -0.5, envelopeDepth / 2 + 0.11]} rotation={[0, 0, -0.56]}>
        <boxGeometry args={[2.5, 0.021, 0.025]} />
        <meshStandardMaterial color="#EBC5A5" metalness={0.45} roughness={0.3} />
      </mesh>

      <group
        name="waxSeal"
        onClick={activateSeal}
        onPointerOut={() => setSealCursor(false)}
        onPointerOver={(event) => {
          event.stopPropagation();
          setSealCursor(true);
        }}
        position={[0, -1.31, 0.29]}
        ref={waxSeal}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <pointLight color="#F7C6C0" distance={2.1} intensity={armed ? 1.6 : 0.28} />
        <mesh castShadow>
          <cylinderGeometry args={[0.49, 0.53, 0.16, 48]} />
          <meshStandardMaterial color={armed ? "#DE9897" : "#B694AA"} metalness={0.42} roughness={0.31} transparent opacity={armed ? 1 : 0.58} />
        </mesh>
        <mesh position={[0, 0, 0.095]}>
          <torusGeometry args={[0.37, 0.027, 10, 48]} />
          <meshStandardMaterial color="#F5BCB5" metalness={0.52} roughness={0.25} />
        </mesh>
        <WaxBranch />
      </group>
    </group>
  );
}

function SceneContents(props: EnvelopeSceneProps) {
  return (
    <>
      <ambientLight intensity={1.25} />
      <directionalLight castShadow intensity={1.65} position={[-4, 6, 5]} shadow-mapSize={[1024, 1024]} />
      <spotLight castShadow angle={0.6} intensity={2.1} penumbra={0.7} position={[1.5, 4.5, 5]} />
      <mesh receiveShadow position={[0, -1.95, -0.65]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 9]} />
        <shadowMaterial opacity={0.22} />
      </mesh>
      <EnvelopeModel {...props} />
    </>
  );
}

export default function EnvelopeScene(props: EnvelopeSceneProps) {
  return (
    <Canvas
      camera={{ fov: 34, position: [0, 1.25, 6.15] }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      shadows
    >
      <SceneContents {...props} />
    </Canvas>
  );
}
