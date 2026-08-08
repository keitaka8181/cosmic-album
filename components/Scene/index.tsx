"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { PerspectiveCamera } from "@react-three/drei";
import { Starfield } from "./Background/Starfield";
import { Earth } from "./Earth/Earth";
import { Album } from "./Album/Album";
import { CameraRig } from "./CameraRig";

/**
 * 3Dシーン全体のルート。
 * - 背景: 宇宙（Starfield）
 * - 左側: 地球 + マーカー
 * - 右側: アルバム + 写真カード
 *
 * ライティング戦略:
 * - ambient: 全体が真っ暗にならないための最小限の光
 * - key (太陽相当): 右上から暖色、アルバムと地球の両方に当たる
 * - rim: 左下から青、地球の夜側のエッジを光らせる
 * - album spot: アルバムに近い位置から強めの暖色、紙の質感を際立たせる
 */
export function Scene() {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: false }}
      camera={{ position: [0, 0, 5], fov: 45 }}
    >
      <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={45} />
      <CameraRig />

      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 3, 5]} intensity={1.2} color="#fff4e0" />
      <directionalLight
        position={[-5, -2, -3]}
        intensity={0.3}
        color="#6ab6ff"
      />
      {/* アルバム専用の暖色スポット（紙の温かみを強調） */}
      <pointLight
        position={[3, 1.5, 3]}
        intensity={2.2}
        color="#ffd9a8"
        distance={6}
        decay={2}
      />

      <Suspense fallback={null}>
        <Starfield />
        <Earth position={[-3, 0, -2]} radius={1.8} />
        <Album />
      </Suspense>
    </Canvas>
  );
}
