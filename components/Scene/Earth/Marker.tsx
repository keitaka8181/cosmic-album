"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSelectionStore } from "@/lib/store";
import { latLngToVec3 } from "./latLngToVec3";

type MarkerProps = {
  id: string;
  lat: number;
  lng: number;
  radius: number;
};

/**
 * 地球上の1点に配置される緑のマーカー。
 * ホバー/選択状態に応じてサイズと発光強度が変化する。
 *
 * 地球の子要素として配置することで、地球の自転に自動的に追従する。
 */
export function Marker({ id, lat, lng, radius }: MarkerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  // 地表から少し浮かせた位置に配置する（Z-fighting回避とマーカーらしい見た目のため）
  const position = useMemo(
    () => latLngToVec3(lat, lng, radius * 1.01),
    [lat, lng, radius],
  );

  const hoveredId = useSelectionStore((s) => s.hoveredId);
  const selectedId = useSelectionStore((s) => s.selectedId);
  const setHoveredId = useSelectionStore((s) => s.setHoveredId);
  const setSelectedId = useSelectionStore((s) => s.setSelectedId);

  const isHovered = hoveredId === id;
  const isSelected = selectedId === id;
  const isActive = isHovered || isSelected;

  // ホバー/選択時のパルスアニメーション
  useFrame(({ clock }) => {
    if (!groupRef.current || !glowRef.current) return;

    const targetScale = isActive ? 1.6 : 1;
    const currentScale = groupRef.current.scale.x;
    const newScale = THREE.MathUtils.lerp(currentScale, targetScale, 0.15);
    groupRef.current.scale.setScalar(newScale);

    // グロー（外側の光）の脈動
    const pulse = 1 + Math.sin(clock.elapsedTime * 3) * 0.2;
    glowRef.current.scale.setScalar(pulse);
  });

  return (
    <group ref={groupRef} position={position}>
      {/* コア: 明るい中心 */}
      <mesh
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredId(id);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHoveredId(null);
          document.body.style.cursor = "";
        }}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedId(isSelected ? null : id);
        }}
      >
        <sphereGeometry args={[0.025, 16, 16]} />
        <meshBasicMaterial
          color={isActive ? "#a8ff6a" : "#5fff3a"}
          toneMapped={false}
        />
      </mesh>

      {/* グロー: 外側の淡い光 */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial
          color="#5fff3a"
          transparent
          opacity={isActive ? 0.5 : 0.25}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
