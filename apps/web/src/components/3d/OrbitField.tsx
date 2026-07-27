'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

const PURPLE = '#a855f7';
const BLUE = '#3b82f6';
const RING_RADII = [1.15, 1.65, 2.15] as const;
const RING_SPEEDS = [0.32, -0.2, 0.14] as const;
const RING_COUNT = RING_RADII.length;

interface OrbitFieldProps {
  /** Number of glowing nodes distributed evenly across the orbit rings. */
  count: number;
}

/**
 * Reusable decorative WebGL visualization: nodes distributed across three
 * concentric rings orbiting a glowing core, in the site's purple/blue brand
 * colors. Used as a supplementary "wow" layer above accessible content in the
 * Skills and Tech Stack sections — never a replacement for the real,
 * screen-reader/SEO-visible lists underneath.
 */
export default function OrbitField({ count }: OrbitFieldProps) {
  const ring0 = useRef<THREE.Group>(null);
  const ring1 = useRef<THREE.Group>(null);
  const ring2 = useRef<THREE.Group>(null);
  const ringRefs = useMemo(() => [ring0, ring1, ring2], []);

  const rings = useMemo(() => {
    const buckets: number[][] = Array.from({ length: RING_COUNT }, () => []);
    for (let i = 0; i < count; i++) {
      buckets[i % RING_COUNT].push(i);
    }
    return buckets;
  }, [count]);

  useFrame((_, delta) => {
    ringRefs.forEach((ref, i) => {
      if (ref.current) ref.current.rotation.y += delta * RING_SPEEDS[i];
    });
  });

  return (
    <>
      <ambientLight intensity={0.7} />
      <pointLight position={[3, 3, 3]} intensity={40} color={PURPLE} />
      <pointLight position={[-3, -2, -3]} intensity={30} color={BLUE} />

      {/* Core */}
      <mesh>
        <sphereGeometry args={[0.26, 24, 24]} />
        <meshStandardMaterial
          color={PURPLE}
          emissive={PURPLE}
          emissiveIntensity={0.6}
          transparent
          opacity={0.85}
        />
      </mesh>

      {rings.map((indices, ringIndex) => (
        <group
          key={ringIndex}
          ref={ringRefs[ringIndex]}
          rotation={[ringIndex * 0.32, 0, ringIndex * 0.16]}
        >
          {/* Faint guide ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[RING_RADII[ringIndex] - 0.004, RING_RADII[ringIndex] + 0.004, 64]} />
            <meshBasicMaterial
              color={ringIndex % 2 === 0 ? PURPLE : BLUE}
              transparent
              opacity={0.1}
              side={THREE.DoubleSide}
            />
          </mesh>

          {indices.map((i) => {
            const angle = (i / Math.max(indices.length, 1)) * Math.PI * 2;
            const radius = RING_RADII[ringIndex];
            const pos: [number, number, number] = [
              Math.cos(angle) * radius,
              0,
              Math.sin(angle) * radius,
            ];
            return (
              <Float key={i} speed={1.2} floatIntensity={0.5} rotationIntensity={0}>
                <mesh position={pos}>
                  <sphereGeometry args={[0.07, 14, 14]} />
                  <meshStandardMaterial
                    color={i % 2 === 0 ? PURPLE : BLUE}
                    emissive={i % 2 === 0 ? PURPLE : BLUE}
                    emissiveIntensity={1}
                    transparent
                    opacity={0.9}
                  />
                </mesh>
              </Float>
            );
          })}
        </group>
      ))}
    </>
  );
}
