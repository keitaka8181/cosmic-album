"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSelectionStore } from "@/lib/store";
import { createPhotoCardTexture } from "./createPhotoCardTexture";
import type { SlotTransform } from "./useAlbumSlots";
import type { Camp } from "@/lib/data/camps";

type PhotoCardProps = {
  camp: Camp;
  slot: SlotTransform;
  seed: number;
};

/**
 * 単体の写真カード。
 * - 見た目: ポラロイド風（縦長、白フチ、キャプション）
 * - 挙動:
 *   - ホバー: 少し浮き上がり、明るくなる
 *   - 選択: さらに大きく、最前面に
 *   - マーカーがホバー/選択されても同様にハイライト（連動）
 */
export function PhotoCard({ camp, slot, seed }: PhotoCardProps) {
  const groupRef = useRef<THREE.Group>(null);

  // キャンバステクスチャを1度だけ生成
  const texture = useMemo(
    () =>
      createPhotoCardTexture({
        caption: camp.name,
        date: camp.date,
        seed,
      }),
    [camp.name, camp.date, seed],
  );

  const hoveredId = useSelectionStore((s) => s.hoveredId);
  const selectedId = useSelectionStore((s) => s.selectedId);
  const setHoveredId = useSelectionStore((s) => s.setHoveredId);
  const setSelectedId = useSelectionStore((s) => s.setSelectedId);

  const isHovered = hoveredId === camp.id;
  const isSelected = selectedId === camp.id;
  const isActive = isHovered || isSelected;

  // 目標 transform（選択・ホバー時に手前に浮き上がる）
  const basePos = useMemo(
    () => new THREE.Vector3(...slot.position),
    [slot.position],
  );
  const targetPos = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    if (!groupRef.current) return;

    // アクティブ時の浮き上がり
    const lift = isActive ? 0.12 : 0;
    const extraScale = isSelected ? 1.15 : isHovered ? 1.06 : 1;

    targetPos.set(basePos.x, basePos.y, basePos.z + lift);
    groupRef.current.position.lerp(targetPos, 0.15);

    const targetScale = slot.scale * extraScale;
    const current = groupRef.current.scale.x;
    const next = THREE.MathUtils.lerp(current, targetScale, 0.15);
    groupRef.current.scale.setScalar(next);
  });

  return (
    <group
      ref={groupRef}
      position={slot.position}
      rotation={slot.rotation}
      scale={slot.scale}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHoveredId(camp.id);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHoveredId(null);
        document.body.style.cursor = "";
      }}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedId(isSelected ? null : camp.id);
      }}
    >
      {/* ポラロイド本体 */}
      <mesh>
        <planeGeometry args={[0.75, 0.95]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.85}
          metalness={0}
          emissive={isActive ? "#fff5c8" : "#000000"}
          emissiveIntensity={isActive ? 0.15 : 0}
        />
      </mesh>

      {/* 裏面（薄いクリーム色、紙の質感） */}
      <mesh position={[0, 0, -0.001]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[0.75, 0.95]} />
        <meshStandardMaterial color="#f0e8d0" roughness={0.9} />
      </mesh>
    </group>
  );
}
