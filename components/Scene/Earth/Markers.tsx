"use client";

import { camps } from "@/lib/data/camps";
import { Marker } from "./Marker";

type MarkersProps = {
  radius: number;
};

/**
 * 全キャンプのマーカーをまとめて描画するコンポーネント。
 * <Earth> の子要素として配置することで、地球の自転に追従する。
 */
export function Markers({ radius }: MarkersProps) {
  return (
    <>
      {camps.map((camp) => (
        <Marker
          key={camp.id}
          id={camp.id}
          lat={camp.lat}
          lng={camp.lng}
          radius={radius}
        />
      ))}
    </>
  );
}
