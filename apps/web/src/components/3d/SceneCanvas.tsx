'use client';

import dynamic from 'next/dynamic';
import { Suspense, useEffect, useRef, useState } from 'react';
import { useMotionPreference } from '@/lib/motion-preferences';
import { cn } from '@/lib/utils';

const Canvas = dynamic(() => import('@react-three/fiber').then((mod) => mod.Canvas), {
  ssr: false,
});

interface SceneCanvasProps {
  /** The R3F scene graph (meshes, lights, etc). Only mounted when 3D is allowed. */
  children: React.ReactNode;
  /** Rendered instead of the WebGL canvas when 3D is disabled, loading, or off-screen. */
  fallback: React.ReactNode;
  className?: string;
  cameraPosition?: [number, number, number];
  cameraFov?: number;
}

/**
 * Shared, perf-conscious WebGL canvas wrapper for flagship 3D scenes.
 *
 * - Only mounts the Canvas once the container is near the viewport.
 * - Never mounts at all when the user prefers reduced motion, is on a
 *   low-power device, or has disabled 3D via the motion-preference toggle —
 *   the accessible `fallback` is rendered instead in every one of those cases.
 * - Pauses the render loop when the tab isn't visible to save battery/CPU.
 */
export default function SceneCanvas({
  children,
  fallback,
  className,
  cameraPosition = [0, 0, 6],
  cameraFov = 45,
}: SceneCanvasProps) {
  const { allow3D } = useMotionPreference();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isNearViewport, setIsNearViewport] = useState(false);
  const [isTabVisible, setIsTabVisible] = useState(true);

  useEffect(() => {
    const node = containerRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setIsNearViewport(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onVisibilityChange = () => setIsTabVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, []);

  const shouldRenderScene = allow3D && isNearViewport;

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {shouldRenderScene ? (
        <Suspense fallback={fallback}>
          <Canvas
            camera={{ position: cameraPosition, fov: cameraFov }}
            dpr={[1, 1.75]}
            frameloop={isTabVisible ? 'always' : 'never'}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
            style={{ position: 'absolute', inset: 0 }}
          >
            {children}
          </Canvas>
        </Suspense>
      ) : (
        fallback
      )}
    </div>
  );
}
