/**
 * キャンプのマスターデータ
 * マーカー（地球上の位置）と写真カード（アルバム内）は共通の id で紐付けられる。
 * 写真枚数とマーカー数は常に一致している前提でアルバムのスロット設計を行う。
 */

export type Camp = {
  id: string;
  name: string;
  lat: number; // 緯度 (-90 〜 90)
  lng: number; // 経度 (-180 〜 180)
  photoUrl: string;
  caption?: string;
  date?: string;
};

/**
 * 参考画像に合わせた仮データ。
 * 実運用時はこの配列を差し替えるだけでマーカー・写真の両方が更新される。
 */
export const camps: Camp[] = [
  {
    id: "c01",
    name: "五本松キャンプ場",
    lat: 48.42,
    lng: -123.36, // バンクーバー付近
    photoUrl: "/textures/photos/placeholder_01.jpg",
    date: "2025.08",
  },
  {
    id: "c02",
    name: "五本松キャンプ場",
    lat: 45.52,
    lng: -122.68, // ポートランド付近
    photoUrl: "/textures/photos/placeholder_02.jpg",
    date: "2025.08",
  },
  {
    id: "c03",
    name: "五本松キャンプ場",
    lat: 51.05,
    lng: -114.07, // カルガリー付近
    photoUrl: "/textures/photos/placeholder_03.jpg",
    date: "2025.09",
  },
  {
    id: "c04",
    name: "五本松キャンプ場",
    lat: 55.33,
    lng: -131.64, // ケチカン付近
    photoUrl: "/textures/photos/placeholder_04.jpg",
    date: "2025.09",
  },
  {
    id: "c05",
    name: "五本松キャンプ場",
    lat: 37.77,
    lng: -122.42, // サンフランシスコ付近
    photoUrl: "/textures/photos/placeholder_05.jpg",
    date: "2025.10",
  },
  {
    id: "c06",
    name: "五本松キャンプ場",
    lat: 47.6,
    lng: -122.33, // シアトル付近
    photoUrl: "/textures/photos/placeholder_06.jpg",
    date: "2025.10",
  },
];
