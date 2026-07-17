"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { DoubleSide, Group, MathUtils, Mesh, Shape } from "three";

interface EnvelopeSceneProps {
  animate?: boolean;
  onReady: () => void;
  opening?: boolean;
}

const sealBeads = Array.from({ length: 12 }, (_, index) => {
  const angle = (index / 12) * Math.PI * 2;
  return [Math.cos(angle) * 0.36, -1.32 + Math.sin(angle) * 0.36, 0.245] as [number, number, number];
});

const sealPetals = Array.from({ length: 5 }, (_, index) => {
  const angle = (index / 5) * Math.PI * 2 - Math.PI / 2;
  return {
    angle,
    position: [Math.cos(angle) * 0.13, -1.32 + Math.sin(angle) * 0.13, 0.285] as [number, number, number],
  };
});

function EnvelopeModel({ animate, onReady, opening }: Required<EnvelopeSceneProps>) {
  const envelope = useRef<Group>(null);
  const flap = useRef<Mesh>(null);
  const letter = useRef<Mesh>(null);
  const { viewport } = useThree();
  const envelopeScale = Math.min(viewport.width / 4.5, 1.2);

  const flapShape = useMemo(() => {
    const shape = new Shape();
    shape.moveTo(-2.05, 0);
    shape.lineTo(2.05, 0);
    shape.lineTo(0, -1.48);
    shape.closePath();
    return shape;
  }, []);

  const pocketShape = useMemo(() => {
    const shape = new Shape();
    shape.moveTo(-2.05, -1.28);
    shape.lineTo(2.05, -1.28);
    shape.lineTo(0, 0.35);
    shape.closePath();
    return shape;
  }, []);

  const leftFoldShape = useMemo(() => {
    const shape = new Shape();
    shape.moveTo(-2.05, -1.28);
    shape.lineTo(-2.05, 1.28);
    shape.lineTo(0, 0);
    shape.closePath();
    return shape;
  }, []);

  const rightFoldShape = useMemo(() => {
    const shape = new Shape();
    shape.moveTo(2.05, -1.28);
    shape.lineTo(2.05, 1.28);
    shape.lineTo(0, 0);
    shape.closePath();
    return shape;
  }, []);

  useEffect(() => onReady(), [onReady]);

  useFrame(({ clock }, delta) => {
    if (!flap.current || !letter.current || !envelope.current) return;

    flap.current.rotation.x = MathUtils.damp(
      flap.current.rotation.x,
      opening ? Math.PI * 0.92 : 0,
      6,
      delta,
    );
    letter.current.position.y = MathUtils.damp(letter.current.position.y, opening ? 0.82 : 0.05, 5, delta);

    if (!animate || opening) return;
    const elapsed = clock.getElapsedTime();
    envelope.current.rotation.x = -0.06 + Math.sin(elapsed * 0.7) * 0.025;
    envelope.current.rotation.y = Math.sin(elapsed * 0.55) * 0.09;
    envelope.current.rotation.z = Math.sin(elapsed * 0.45) * 0.018;
    envelope.current.position.y = Math.sin(elapsed * 0.85) * 0.07;
  });

  return (
    <group ref={envelope} rotation={[-0.06, 0, 0]} scale={envelopeScale}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[4.2, 2.58, 0.18]} />
        <meshStandardMaterial color="#B7A1C5" roughness={0.78} />
      </mesh>

      <mesh ref={letter} position={[0, 0.05, 0.12]}>
        <boxGeometry args={[3.62, 2.14, 0.06]} />
        <meshStandardMaterial color="#FFF8F5" roughness={0.86} />
      </mesh>

      <mesh position={[0, -0.01, 0.22]}>
        <shapeGeometry args={[pocketShape]} />
        <meshStandardMaterial color="#C5B3D3" roughness={0.72} side={DoubleSide} />
      </mesh>
      <mesh position={[0, 0, 0.215]}>
        <shapeGeometry args={[leftFoldShape]} />
        <meshStandardMaterial color="#BCA8CA" roughness={0.74} side={DoubleSide} />
      </mesh>
      <mesh position={[0, 0, 0.215]}>
        <shapeGeometry args={[rightFoldShape]} />
        <meshStandardMaterial color="#C9B8D6" roughness={0.74} side={DoubleSide} />
      </mesh>

      <mesh position={[-1.02, -0.5, 0.245]} rotation={[0, 0, 0.56]}>
        <boxGeometry args={[2.42, 0.025, 0.025]} />
        <meshStandardMaterial color="#EBC5A5" metalness={0.4} roughness={0.35} />
      </mesh>
      <mesh position={[1.02, -0.5, 0.245]} rotation={[0, 0, -0.56]}>
        <boxGeometry args={[2.42, 0.025, 0.025]} />
        <meshStandardMaterial color="#EBC5A5" metalness={0.4} roughness={0.35} />
      </mesh>

      <mesh ref={flap} position={[0, 1.27, 0.25]}>
        <shapeGeometry args={[flapShape]} />
        <meshStandardMaterial color="#C9B8D6" roughness={0.68} side={DoubleSide} />

        <mesh position={[-1.02, -0.72, 0.035]} rotation={[0, 0, -0.62]}>
          <boxGeometry args={[2.5, 0.026, 0.025]} />
          <meshStandardMaterial color="#EBC5A5" metalness={0.48} roughness={0.3} />
        </mesh>
        <mesh position={[1.02, -0.72, 0.035]} rotation={[0, 0, 0.62]}>
          <boxGeometry args={[2.5, 0.026, 0.025]} />
          <meshStandardMaterial color="#EBC5A5" metalness={0.48} roughness={0.3} />
        </mesh>

        <mesh position={[0, -1.32, 0.14]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.49, 0.46, 0.14, 64]} />
          <meshStandardMaterial color="#D89491" metalness={0.28} roughness={0.4} />
        </mesh>
        <mesh position={[0, -1.32, 0.225]}>
          <torusGeometry args={[0.35, 0.035, 14, 64]} />
          <meshStandardMaterial color="#F3B9AE" metalness={0.34} roughness={0.32} />
        </mesh>
        <mesh position={[0, -1.32, 0.255]}>
          <torusGeometry args={[0.245, 0.022, 12, 48]} />
          <meshStandardMaterial color="#F9D4C9" metalness={0.3} roughness={0.3} />
        </mesh>
        {sealBeads.map((position, index) => (
          <mesh key={index} position={position}>
            <sphereGeometry args={[0.042, 14, 14]} />
            <meshStandardMaterial color="#F7C8BE" metalness={0.28} roughness={0.34} />
          </mesh>
        ))}
        {sealPetals.map(({ angle, position }, index) => (
          <mesh key={index} position={position} rotation={[0, 0, angle]} scale={[1, 0.58, 0.42]}>
            <sphereGeometry args={[0.09, 18, 18]} />
            <meshStandardMaterial color="#F7C1B8" metalness={0.24} roughness={0.38} />
          </mesh>
        ))}
        <mesh position={[0, -1.32, 0.23]}>
          <sphereGeometry args={[0.075, 24, 24]} />
          <meshStandardMaterial color="#FFE2D8" metalness={0.25} roughness={0.35} />
        </mesh>
      </mesh>
    </group>
  );
}

export default function EnvelopeScene({ animate = true, onReady, opening = false }: EnvelopeSceneProps) {
  return (
    <Canvas
      camera={{ fov: 33, position: [0, 0.15, 4.9] }}
      dpr={[1, 1.35]}
      frameloop="always"
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={1.65} />
      <directionalLight intensity={1.35} position={[3, 4, 5]} />
      <pointLight color="#F5CBCB" intensity={14} position={[2, -1, 4]} />
      <pointLight color="#C5B3D3" intensity={10} position={[-3, 2, 3]} />
      <Suspense fallback={null}>
        <EnvelopeModel animate={animate} onReady={onReady} opening={opening} />
      </Suspense>
    </Canvas>
  );
}
