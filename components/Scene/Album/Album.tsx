"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PhotoCards } from "./PhotoCards";
import { createAlbumTexture } from "./createAlbumTexture";

type AlbumProps = {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
};

/**
 * アルバム本体（仮モデル）。
 *
 * 構造:
 * - 見開きの台紙 (Plane)
 * - 背表紙の影（中央の綴じ目、テクスチャ内で表現）
 * - 黒いバインダークリップ（上下に2つ）
 * - 写真カード群（子要素として配置）
 *
 * すべて Group にまとめてあり、全体を position/rotation/scale で動かせる。
 * 将来 .glb モデルに置き換える際は、台紙+クリップ部分だけを useGLTF の scene に差し替える。
 *
 * アイドル時にごくわずかに揺れるアニメーションで「空間に浮いている」雰囲気を演出。
 */
export function Album({
  position = [2.3, -0.2, 1],
  rotation = [0.08, -0.38, 0.02],
  scale = 2.1,
}: AlbumProps) {
  const groupRef = useRef<THREE.Group>(null);

  const albumTexture = useMemo(() => createAlbumTexture(), []);

  // アイドル時の微揺れ
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.elapsedTime;
    groupRef.current.rotation.x = rotation[0] + Math.sin(t * 0.4) * 0.015;
    groupRef.current.rotation.z = rotation[2] + Math.cos(t * 0.3) * 0.01;
    groupRef.current.position.y = position[1] + Math.sin(t * 0.6) * 0.02;
  });

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      scale={scale}
    >
      {/* 本の厚み（薄い Box を台紙の下に置く） */}
      <mesh position={[0, 0, -0.04]}>
        <boxGeometry args={[2.1, 1.35, 0.06]} />
        <meshStandardMaterial color="#3a2a1a" roughness={0.9} />
      </mesh>

      {/* 見開きの台紙 */}
      <mesh>
        <planeGeometry args={[2, 1.25]} />
        <meshStandardMaterial
          map={albumTexture}
          roughness={0.85}
          metalness={0}
        />
      </mesh>

      {/* 中央の綴じ目（わずかに盛り上がった線） */}
      <mesh position={[0, 0, 0.005]}>
        <planeGeometry args={[0.04, 1.25]} />
        <meshStandardMaterial color="#1f1208" roughness={0.9} opacity={0.6} transparent />
      </mesh>

      {/* バインダークリップ上下 */}
      <BinderClip position={[0.7, 0.65, 0.04]} />
      <BinderClip position={[0.7, -0.65, 0.04]} />

      {/* 写真カード群 */}
      <PhotoCards />
    </group>
  );
}

/**
 * 参考画像にある黒いバインダークリップの簡易表現。
 */
function BinderClip({
  position,
}: {
  position: [number, number, number];
}) {
  return (
    <group position={position}>
      {/* クリップ本体 */}
      <mesh>
        <boxGeometry args={[0.3, 0.12, 0.02]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.5} metalness={0.3} />
      </mesh>
      {/* 上部の金属リング部分 */}
      <mesh position={[0, 0.04, 0.02]}>
        <torusGeometry args={[0.03, 0.008, 8, 16]} />
        <meshStandardMaterial color="#888" roughness={0.3} metalness={0.8} />
      </mesh>
    </group>
  );
}
