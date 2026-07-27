'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Line, Sparkles } from '@react-three/drei';
import { useTheme } from 'next-themes';
import * as THREE from 'three';
import type { MotionValue } from 'framer-motion';

const PURPLE = '#a855f7';
const BLUE = '#3b82f6';
const NODE_COUNT = 14;
const CORE_RADIUS = 1.6;
const NODE_RADIUS = 2.15;
const EDGE_MAX_DISTANCE = 1.7;

interface SignalCoreProps {
  /** 0 → 1 scroll progress through the hero section, read imperatively each frame. */
  scrollProgress: MotionValue<number>;
}

function useFibonacciSphere(count: number, radius: number): [number, number, number][] {
  return useMemo(() => {
    const points: [number, number, number][] = [];
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / Math.max(count - 1, 1)) * 2;
      const r = Math.sqrt(Math.max(1 - y * y, 0));
      const theta = goldenAngle * i;
      points.push([Math.cos(theta) * r * radius, y * radius, Math.sin(theta) * r * radius]);
    }
    return points;
  }, [count, radius]);
}

/**
 * "Signal Core" — the hero's flagship 3D centerpiece. An abstract lattice of
 * connected nodes evoking a full-stack system (frontend/backend/data/cloud
 * layers wired together), rendered in the site's existing purple/blue brand
 * gradient. Reacts gently to the cursor and recedes as the user scrolls past
 * the hero. Purely decorative — no content lives inside the canvas.
 */
export default function SignalCore({ scrollProgress }: SignalCoreProps) {
  const { resolvedTheme } = useTheme();
  const groupRef = useRef<THREE.Group>(null);
  const nodePositions = useFibonacciSphere(NODE_COUNT, NODE_RADIUS);
  const wireColor = resolvedTheme === 'light' ? '#64748b' : '#94a3b8';

  const edges = useMemo(() => {
    const list: { a: [number, number, number]; b: [number, number, number]; key: string }[] = [];
    for (let i = 0; i < nodePositions.length; i++) {
      for (let j = i + 1; j < nodePositions.length; j++) {
        const [ax, ay, az] = nodePositions[i];
        const [bx, by, bz] = nodePositions[j];
        const dist = Math.hypot(ax - bx, ay - by, az - bz);
        if (dist <= EDGE_MAX_DISTANCE) {
          list.push({ a: nodePositions[i], b: nodePositions[j], key: `${i}-${j}` });
        }
      }
    }
    return list;
  }, [nodePositions]);

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const progress = scrollProgress.get();

    group.rotation.y += delta * 0.16;
    group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, state.pointer.y * 0.22, 0.05);
    group.rotation.z = THREE.MathUtils.lerp(group.rotation.z, -state.pointer.x * 0.14, 0.05);

    const scale = THREE.MathUtils.clamp(1 - progress * 0.5, 0.55, 1);
    group.scale.setScalar(scale);
    group.position.y = progress * -0.6;
  });

  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[4, 4, 4]} intensity={45} color={PURPLE} />
      <pointLight position={[-4, -2, -4]} intensity={35} color={BLUE} />

      <group ref={groupRef}>
        {/* Glowing core lattice */}
        <mesh>
          <icosahedronGeometry args={[CORE_RADIUS, 1]} />
          <meshStandardMaterial
            color={PURPLE}
            emissive={PURPLE}
            emissiveIntensity={0.35}
            wireframe
            transparent
            opacity={0.55}
          />
        </mesh>
        <mesh>
          <icosahedronGeometry args={[CORE_RADIUS, 1]} />
          <meshBasicMaterial color={wireColor} wireframe transparent opacity={0.12} />
        </mesh>

        {/* Orbiting system nodes */}
        {nodePositions.map((pos, i) => (
          <Float key={i} speed={1.4} rotationIntensity={0} floatIntensity={0.7}>
            <mesh position={pos}>
              <sphereGeometry args={[0.05, 12, 12]} />
              <meshStandardMaterial
                color={i % 2 === 0 ? PURPLE : BLUE}
                emissive={i % 2 === 0 ? PURPLE : BLUE}
                emissiveIntensity={1.1}
                transparent
                opacity={0.9}
              />
            </mesh>
          </Float>
        ))}

        {/* Connective traces between nearby nodes */}
        {edges.map(({ a, b, key }) => (
          <Line key={key} points={[a, b]} color={PURPLE} transparent opacity={0.14} lineWidth={1} />
        ))}
      </group>

      <Sparkles count={50} scale={4.5} size={1.3} speed={0.25} color={BLUE} opacity={0.45} />
    </>
  );
}
