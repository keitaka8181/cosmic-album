"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Markers } from "./Markers";
import { createProceduralEarthTexture } from "./createEarthTexture";

type EarthProps = {
  position?: [number, number, number];
  radius?: number;
};

/**
 * 地球コンポーネント。
 * - 本体: テクスチャを貼った球体、ゆっくり自転
 * - マーカー: 子要素として配置、地球と一緒に回る
 * - 大気: 一回り大きい球体を裏面描画して "縁が光る" 効果
 *
 * テクスチャは現在プログラム生成だが、public/textures/earth_day.jpg を配置すれば
 * useLoader(TextureLoader, ...) に置き換え可能。
 */
export function Earth({ position = [-3, 0, -2], radius = 1.8 }: EarthProps) {
  const earthRef = useRef<THREE.Group>(null);

  const earthTexture = useMemo(() => createProceduralEarthTexture(), []);

  // 自転
  useFrame((_, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <group position={position}>
      {/* 大気のリムライト（地球より一回り大きい球の裏面を光らせる） */}
      <mesh scale={1.08}>
        <sphereGeometry args={[radius, 64, 64]} />
        <shaderMaterial
          transparent
          side={THREE.BackSide}
          uniforms={{
            color: { value: new THREE.Color("#6ab6ff") },
          }}
          vertexShader={`
            varying vec3 vNormal;
            void main() {
              vNormal = normalize(normalMatrix * normal);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            uniform vec3 color;
            varying vec3 vNormal;
            void main() {
              float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.5);
              gl_FragColor = vec4(color, 1.0) * intensity;
            }
          `}
        />
      </mesh>

      {/* 地球本体とマーカー */}
      <group ref={earthRef}>
        <mesh>
          <sphereGeometry args={[radius, 64, 64]} />
          <meshStandardMaterial
            map={earthTexture}
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>

        <Markers radius={radius} />
      </group>
    </group>
  );
}
