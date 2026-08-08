import { create } from "zustand";

/**
 * マーカーと写真カードの双方向連動のための状態管理。
 * どちらのコンポーネントも同じストアを購読するので、
 * 一方をホバー/選択するともう一方がハイライトされる。
 */

type SelectionState = {
  hoveredId: string | null;
  selectedId: string | null;
  setHoveredId: (id: string | null) => void;
  setSelectedId: (id: string | null) => void;
};

export const useSelectionStore = create<SelectionState>((set) => ({
  hoveredId: null,
  selectedId: null,
  setHoveredId: (id) => set({ hoveredId: id }),
  setSelectedId: (id) => set({ selectedId: id }),
}));
