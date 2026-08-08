import * as THREE from "three";

/**
 * Canvas API を使って地球テクスチャを手続き的に生成する。
 * 参考画像の「ぼんやりした青い地球」の雰囲気を再現。
 *
 * 本番環境では public/textures/earth_day.jpg を配置し、
 * useLoader(TextureLoader, '/textures/earth_day.jpg') に差し替えるのが望ましい。
 * NASA Blue Marble (https://visibleearth.nasa.gov/) が推奨。
 */
export function createProceduralEarthTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d")!;

  // --- 海 ---
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  oceanGrad.addColorStop(0, "#1a3a5c");
  oceanGrad.addColorStop(0.5, "#2a5a8c");
  oceanGrad.addColorStop(1, "#1a3a5c");
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // --- 大陸をランダムな斑点として配置 ---
  // 本物の大陸ではないが、地球らしい雰囲気は出る
  const landmasses = [
    // 北米
    { cx: 0.2, cy: 0.3, rx: 0.12, ry: 0.15 },
    { cx: 0.22, cy: 0.45, rx: 0.08, ry: 0.1 },
    // 南米
    { cx: 0.3, cy: 0.65, rx: 0.05, ry: 0.12 },
    // ヨーロッパ・アフリカ
    { cx: 0.52, cy: 0.3, rx: 0.04, ry: 0.05 },
    { cx: 0.55, cy: 0.55, rx: 0.08, ry: 0.18 },
    // アジア
    { cx: 0.7, cy: 0.3, rx: 0.15, ry: 0.15 },
    { cx: 0.8, cy: 0.4, rx: 0.06, ry: 0.08 },
    // オーストラリア
    { cx: 0.85, cy: 0.65, rx: 0.06, ry: 0.05 },
  ];

  ctx.fillStyle = "#4a6b3a";
  for (const land of landmasses) {
    const cx = land.cx * canvas.width;
    const cy = land.cy * canvas.height;
    const rx = land.rx * canvas.width;
    const ry = land.ry * canvas.height;

    // 有機的な形にするため、複数の楕円を重ねて描画
    for (let i = 0; i < 12; i++) {
      const offsetX = (Math.random() - 0.5) * rx * 0.8;
      const offsetY = (Math.random() - 0.5) * ry * 0.8;
      const sizeX = rx * (0.4 + Math.random() * 0.6);
      const sizeY = ry * (0.4 + Math.random() * 0.6);

      ctx.beginPath();
      ctx.ellipse(cx + offsetX, cy + offsetY, sizeX, sizeY, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // --- 極地の氷冠 ---
  ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
  ctx.fillRect(0, 0, canvas.width, canvas.height * 0.08);
  ctx.fillRect(0, canvas.height * 0.92, canvas.width, canvas.height * 0.08);

  // --- 雲のような白いノイズを薄く重ねる ---
  ctx.globalAlpha = 0.15;
  ctx.fillStyle = "#ffffff";
  for (let i = 0; i < 300; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const r = 20 + Math.random() * 60;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}
