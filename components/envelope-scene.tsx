"use client";

import { Canvas } from "@react-three/fiber";

function EnvelopeModel() {
  return (
    <group rotation={[-0.13, -0.18, 0]}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[3.8, 2.35, 0.18]} />
        <meshStandardMaterial color="#FFE2E2" roughness={0.75} />
      </mesh>
      <mesh position={[0, 0.06, 0.12]} rotation={[0, 0, Math.PI / 4]}>
        <planeGeometry args={[2.5, 2.5]} />
        <meshStandardMaterial color="#F5CBCB" roughness={0.82} />
      </mesh>
      <mesh position={[0, 0.8, 0.25]} rotation={[-0.42, 0, 0]}>
        <boxGeometry args={[3.68, 1.2, 0.07]} />
        <meshStandardMaterial color="#FBEFEF" roughness={0.7} />
      </mesh>
      <mesh position={[0, -0.1, 0.34]}>
        <cylinderGeometry args={[0.26, 0.26, 0.09, 40]} />
        <meshStandardMaterial color="#C5B3D3" metalness={0.08} roughness={0.55} />
      </mesh>
    </group>
  );
}

export function EnvelopeScene() {
  return (
    <div className="h-52 w-full sm:h-60" aria-hidden="true">
      <Canvas camera={{ fov: 38, position: [0, 0, 7] }} dpr={[1, 1.5]} frameloop="demand" gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={1.8} />
        <directionalLight intensity={1.1} position={[3, 4, 4]} />
        <pointLight color="#C5B3D3" intensity={18} position={[-2, 1, 3]} />
        <EnvelopeModel />
      </Canvas>
    </div>
  );
}
