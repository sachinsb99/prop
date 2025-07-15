"use client";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { OrbitControls, useGLTF, Environment } from "@react-three/drei";
import { useRef, useEffect } from "react";
import * as THREE from "three";
// import { useGLTF } from "@react-three/drei";

// function HouseModel() {
//   // automatically caches after first load
//   const { scene } = useGLTF("/models/suburban_house.glb"); 
//   return <primitive object={scene} />;
// }

export function HouseModel() {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/suburban_house.glb");

  useEffect(() => {
    if (!groupRef.current) return;

    // Compute bounding box
    const box = new THREE.Box3().setFromObject(scene);
    const center = new THREE.Vector3();
    box.getCenter(center);

    // Recenter the model
    scene.position.sub(center); // shift model so center aligns with (0,0,0)
  }, [scene]);

  return <group ref={groupRef}><primitive object={scene} /></group>;
}

export default function HouseViewer() {
  return (
    <div className="relative w-full h-[500px]"> {/* static height */}
      <Canvas
        // camera={{ position: [3, 2, 5], fov: 45 }}
        camera={{ position: [10, -0.5, 0], fov: 75 }}
        dpr={[1, 2]}
      >
        {/* ambient + HDRI lighting */}
        <ambientLight intensity={0.4} />
        <Suspense fallback={null}>
          <Environment preset="city" />
          <HouseModel />
        </Suspense>

        {/* drag-to-rotate only */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
        />
      </Canvas>
    </div>
  );
}
