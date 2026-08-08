import * as THREE from "three";

/**
 * 参考画像のポラロイド風写真カードを生成する。
 * - 白いフチ
 * - 中央に写真エリア（ここでは illustration を描画）
 * - 下部に手書き風キャプション
 *
 * 本番では photoUrl からテクスチャを読み込む形に拡張するが、
 * 仮モデル段階ではデータに応じてバリエーションを持たせた画像を手続き生成する。
 */
export function createPhotoCardTexture(options: {
  caption: string;
  date?: string;
  seed: number; // 同じidなら同じ画像が出るようにするためのシード
}): THREE.CanvasTexture {
  const { caption, date, seed } = options;

  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 640;
  const ctx = canvas.getContext("2d")!;

  const W = canvas.width;
  const H = canvas.height;

  // --- 白フチ ---
  ctx.fillStyle = "#fbf7ec";
  ctx.fillRect(0, 0, W, H);

  // --- 影（微妙なエッジ） ---
  const edgeGrad = ctx.createLinearGradient(0, 0, 0, H);
  edgeGrad.addColorStop(0, "rgba(0,0,0,0.05)");
  edgeGrad.addColorStop(0.05, "rgba(0,0,0,0)");
  edgeGrad.addColorStop(0.95, "rgba(0,0,0,0)");
  edgeGrad.addColorStop(1, "rgba(0,0,0,0.1)");
  ctx.fillStyle = edgeGrad;
  ctx.fillRect(0, 0, W, H);

  // --- 写真エリア ---
  const px = 30;
  const py = 30;
  const pw = W - px * 2;
  const ph = 440;

  // 写真背景: シードに応じた色のグラデーション
  const hue = (seed * 47) % 360;
  const photoGrad = ctx.createLinearGradient(px, py, px, py + ph);
  photoGrad.addColorStop(0, `hsl(${hue}, 55%, 65%)`);
  photoGrad.addColorStop(0.6, `hsl(${(hue + 30) % 360}, 50%, 50%)`);
  photoGrad.addColorStop(1, `hsl(${(hue + 60) % 360}, 45%, 35%)`);
  ctx.fillStyle = photoGrad;
  ctx.fillRect(px, py, pw, ph);

  // 風景風の要素: 山・地平線・太陽
  // 太陽
  ctx.fillStyle = `hsla(${(hue + 40) % 360}, 90%, 80%, 0.9)`;
  ctx.beginPath();
  ctx.arc(px + pw * (0.3 + ((seed * 0.1) % 0.4)), py + ph * 0.3, 45, 0, Math.PI * 2);
  ctx.fill();

  // 山のシルエット
  ctx.fillStyle = `hsla(${(hue + 180) % 360}, 40%, 25%, 0.85)`;
  ctx.beginPath();
  ctx.moveTo(px, py + ph * 0.65);
  const peaks = 5;
  for (let i = 0; i <= peaks; i++) {
    const x = px + (pw * i) / peaks;
    const h = 0.35 + Math.sin(seed + i * 1.3) * 0.15;
    ctx.lineTo(x, py + ph * (0.65 - h));
    if (i < peaks) {
      const midX = px + (pw * (i + 0.5)) / peaks;
      const midH = 0.15 + Math.sin(seed + i * 2) * 0.1;
      ctx.lineTo(midX, py + ph * (0.65 - midH));
    }
  }
  ctx.lineTo(px + pw, py + ph);
  ctx.lineTo(px, py + ph);
  ctx.closePath();
  ctx.fill();

  // 手前の木々/草
  ctx.fillStyle = `hsla(${(hue + 200) % 360}, 30%, 15%, 0.9)`;
  for (let i = 0; i < 8; i++) {
    const tx = px + ((seed * 31 + i * 67) % 100) * (pw / 100);
    const ty = py + ph * 0.8;
    // 簡易的な三角形の木
    ctx.beginPath();
    ctx.moveTo(tx, ty);
    ctx.lineTo(tx - 18, ty + 50);
    ctx.lineTo(tx + 18, ty + 50);
    ctx.closePath();
    ctx.fill();
  }

  // 写真エリア内の軽いグレイン
  ctx.globalAlpha = 0.08;
  for (let i = 0; i < 500; i++) {
    const x = px + Math.random() * pw;
    const y = py + Math.random() * ph;
    ctx.fillStyle = Math.random() > 0.5 ? "#fff" : "#000";
    ctx.fillRect(x, y, 1, 1);
  }
  ctx.globalAlpha = 1;

  // --- キャプション ---
  ctx.fillStyle = "#2a1f0a";
  ctx.textAlign = "center";
  ctx.font = "26px Georgia, serif";
  ctx.fillText(caption, W / 2, H - 110);

  // 手書き風の下線とキャプションサブ
  ctx.strokeStyle = "#2a1f0a";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(W * 0.2, H - 90);
  ctx.lineTo(W * 0.8, H - 88);
  ctx.stroke();

  if (date) {
    ctx.font = "italic 18px Georgia, serif";
    ctx.fillStyle = "#6a5a3a";
    ctx.fillText(`Hopes, Plans, Cares — ${date}`, W / 2, H - 55);
  } else {
    ctx.font = "italic 18px Georgia, serif";
    ctx.fillStyle = "#6a5a3a";
    ctx.fillText("Hopes, Plans, Cares", W / 2, H - 55);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}
