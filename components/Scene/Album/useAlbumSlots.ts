import { useMemo } from "react";

export type SlotTransform = {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
};

/**
 * アルバム内の写真スロットの transform を返す。
 *
 * 現在は仮モデル用のハードコード実装。
 * 本番 .glb 読み込み時は、以下のように差し替え予定:
 *
 *   const { scene } = useGLTF('/models/album.glb');
 *   const slots: SlotTransform[] = [];
 *   scene.traverse((obj) => {
 *     if (obj.name.startsWith('PhotoSlot_')) {
 *       slots.push({
 *         position: obj.position.toArray(),
 *         rotation: obj.rotation.toArray().slice(0, 3),
 *         scale: obj.scale.x,
 *       });
 *     }
 *   });
 *
 * Album 座標系での位置（Album 自体の transform は Album.tsx で適用）:
 * - X: -0.9 〜 +0.9（見開きの左右ページ）
 * - Y: 0.5（上段）, -0.2（下段）
 * - Z: 0.01（台紙よりほんの少し手前に浮かせる）
 *
 * 写真カードは参考画像のようにランダムに傾けて貼られた雰囲気を出すため、
 * 各スロットに少しずつ異なる回転を与える。
 */
export function useAlbumSlots(): SlotTransform[] {
  return useMemo<SlotTransform[]>(
    () => [
      // 上段 3枚（見開き左ページ寄りから右ページへ）
      {
        position: [-0.55, 0.32, 0.015],
        rotation: [0, 0, 0.08],
        scale: 0.35,
      },
      {
        position: [-0.15, 0.35, 0.02],
        rotation: [0, 0, -0.05],
        scale: 0.35,
      },
      {
        position: [0.25, 0.3, 0.015],
        rotation: [0, 0, 0.1],
        scale: 0.35,
      },
      // 下段 2枚 + 右上 1枚
      {
        position: [-0.35, -0.2, 0.02],
        rotation: [0, 0, -0.09],
        scale: 0.35,
      },
      {
        position: [0.05, -0.18, 0.015],
        rotation: [0, 0, 0.12],
        scale: 0.35,
      },
      {
        position: [0.7, 0.3, 0.02],
        rotation: [0, 0, -0.04],
        scale: 0.35,
      },
    ],
    [],
  );
}
