"use client";

import { camps } from "@/lib/data/camps";
import { useAlbumSlots } from "./useAlbumSlots";
import { PhotoCard } from "./PhotoCard";

/**
 * camps データと useAlbumSlots の transform を index で突き合わせてカードを生成。
 *
 * 前提: camps.length === slots.length
 * ずれると最小数だけが表示される（安全側の挙動）。
 */
export function PhotoCards() {
  const slots = useAlbumSlots();
  const count = Math.min(camps.length, slots.length);

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <PhotoCard
          key={camps[i].id}
          camp={camps[i]}
          slot={slots[i]}
          seed={i + 1}
        />
      ))}
    </>
  );
}
