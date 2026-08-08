"use client";

import { useSelectionStore } from "@/lib/store";
import { camps } from "@/lib/data/camps";

/**
 * 画面上に重ねる2D UI 層。
 * Canvas とは別レイヤーで、Tailwind でスタイリングする。
 *
 * - 左上: サイトタイトル
 * - 右上: インデックス番号 (参考画像の RB アイコン風)
 * - 右下: 操作ヒント
 * - 左下: 選択中のキャンプ情報（選択時のみ）
 */
export function HUD() {
  const selectedId = useSelectionStore((s) => s.selectedId);
  const hoveredId = useSelectionStore((s) => s.hoveredId);
  const activeId = selectedId || hoveredId;
  const activeCamp = activeId ? camps.find((c) => c.id === activeId) : null;
  const activeIndex = activeId ? camps.findIndex((c) => c.id === activeId) : -1;

  return (
    <>
      {/* 左上: タイトル */}
      <div className="fixed top-8 left-8 z-10 pointer-events-none select-none">
        <div className="flex items-baseline gap-3">
          <span className="text-[#a8ff6a] text-[10px] tracking-[0.4em] uppercase">
            Archive
          </span>
          <span className="w-8 h-px bg-white/30" />
        </div>
        <h1
          className="font-serif text-white/95 tracking-wider mt-2"
          style={{ fontSize: "2.25rem", letterSpacing: "0.08em" }}
        >
          HELL HOUNDS
        </h1>
        <p className="text-white/40 text-xs tracking-[0.25em] uppercase mt-1">
          Camp Chronicles · 2025
        </p>
      </div>

      {/* 右上: ページ/インデックス */}
      <div className="fixed top-8 right-8 z-10 pointer-events-none select-none text-right">
        <p className="text-white/40 text-[10px] tracking-[0.4em] uppercase">
          Index
        </p>
        <p className="font-serif text-white/90 text-3xl mt-1">
          {activeIndex >= 0
            ? String(activeIndex + 1).padStart(2, "0")
            : "00"}
          <span className="text-white/30 text-lg">
            {" / "}
            {String(camps.length).padStart(2, "0")}
          </span>
        </p>
      </div>

      {/* 右下: 操作ヒント */}
      <div className="fixed bottom-8 right-8 z-10 pointer-events-none select-none">
        <div className="flex items-center gap-3 text-white/35 text-[10px] tracking-[0.3em] uppercase">
          <span className="w-6 h-px bg-white/20" />
          <span>Move · Hover · Click</span>
        </div>
      </div>

      {/* 左下: 選択/ホバー中のキャンプ情報 */}
      <div
        className={`fixed bottom-8 left-8 z-10 pointer-events-none transition-all duration-500 ${
          activeCamp
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4"
        }`}
      >
        {activeCamp && (
          <div className="backdrop-blur-md bg-white/[0.04] border border-white/10 rounded-sm px-6 py-5 max-w-xs">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#a8ff6a] shadow-[0_0_8px_#a8ff6a]" />
              <p className="text-[#a8ff6a] text-[10px] tracking-[0.3em] uppercase">
                {selectedId ? "Selected" : "Hovering"}
              </p>
            </div>
            <p className="text-white text-xl font-serif tracking-wide">
              {activeCamp.name}
            </p>
            <div className="h-px w-8 bg-white/20 my-2" />
            <div className="flex justify-between text-xs text-white/50">
              <span>
                {activeCamp.lat.toFixed(2)}°, {activeCamp.lng.toFixed(2)}°
              </span>
              {activeCamp.date && <span>{activeCamp.date}</span>}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
