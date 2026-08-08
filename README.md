# HELL HOUNDS — Cosmic Album

Next.js + Three.js (React Three Fiber) で作る、宇宙背景＋地球＋手前にアルバムの3Dビジュアルサイト。

## 構成

- **背景**: 紫がかった宇宙とネビュラ、3000個の星
- **左側**: 地球（手続き生成テクスチャ、自転、大気リムライト）と緑マーカー
- **右側 (手前)**: 見開きアルバム（仮モデル）と6枚の写真カード
- **連動**: マーカーと写真カードが共通の `id` で紐付いており、どちらをホバー/選択してももう一方がハイライトされる

## 起動

```bash
npm install
npm run dev
# → http://localhost:3000
```

## ディレクトリ構造

```
app/
  layout.tsx              ルートレイアウト
  page.tsx                トップページ（Server Component）
  globals.css             Tailwind + フォント
components/
  SceneClient.tsx         SSR 無効の3Dシーン読み込みラッパー
  Scene/
    index.tsx             Canvas ルート・ライティング
    CameraRig.tsx         マウス parallax
    Background/
      Starfield.tsx       宇宙 + 星
    Earth/
      Earth.tsx           地球本体 + 大気リム
      Markers.tsx         マーカー群
      Marker.tsx          単体マーカー
      latLngToVec3.ts     緯度経度→3D座標
      createEarthTexture.ts   仮地球テクスチャ生成
    Album/
      Album.tsx           見開きブック本体（仮モデル）
      PhotoCards.tsx      カード群
      PhotoCard.tsx       単体カード
      useAlbumSlots.ts    写真配置の transform
      createAlbumTexture.ts    台紙テクスチャ生成
      createPhotoCardTexture.ts 写真カードテクスチャ生成
  UI/
    Loader.tsx            ローディング画面
    HUD.tsx               画面上に重ねる2D UI
lib/
  store.ts                Zustand（選択/ホバー状態）
  data/camps.ts           キャンプデータ
```

## データ追加

`lib/data/camps.ts` の `camps` 配列を編集すれば、マーカーとカードが同時に更新されます。
写真枚数はスロット数と一致させる必要があるため、増減時は `useAlbumSlots.ts` の transform 配列も合わせて調整してください。

## 本番テクスチャへの差し替え

### 地球
`public/textures/earth_day.jpg` に NASA Blue Marble などを配置し、
`Earth.tsx` 内の `createProceduralEarthTexture()` を以下のように置き換えます:

```tsx
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";

const earthTexture = useLoader(TextureLoader, "/textures/earth_day.jpg");
```

### アルバム (.glb モデル)
`public/models/album.glb` を Blender 等で用意（`PhotoSlot_01` 〜 `PhotoSlot_06` という名前の Empty を配置しておく）。
`useAlbumSlots.ts` を以下のような実装に差し替えます:

```tsx
import { useGLTF } from "@react-three/drei";

export function useAlbumSlots() {
  const { scene } = useGLTF("/models/album.glb");
  return useMemo(() => {
    const slots: SlotTransform[] = [];
    scene.traverse((obj) => {
      if (obj.name.startsWith("PhotoSlot_")) {
        slots.push({
          position: obj.position.toArray() as [number, number, number],
          rotation: [obj.rotation.x, obj.rotation.y, obj.rotation.z],
          scale: obj.scale.x,
        });
      }
    });
    return slots.sort((a, b) => /* 名前順に並べ替え */ 0);
  }, [scene]);
}
```

## パフォーマンスメモ

- Three.js 本体は `dynamic(..., { ssr: false })` で遅延読み込み。初期 JS バンドルを軽量に保つ。
- テクスチャは Canvas で初回マウント時に生成、以降は `useMemo` でキャッシュ。
- 星は `Points` + shader で3000個まで60fps維持を確認。
- モバイル対応は未実装。`useThree().size` でアスペクト比を取ってレイアウトを切り替えるのが次の改善点。

## 使用技術

- Next.js 16 (App Router, Turbopack)
- React 19
- Three.js + @react-three/fiber + @react-three/drei
- Zustand (状態管理)
- Tailwind CSS v4
