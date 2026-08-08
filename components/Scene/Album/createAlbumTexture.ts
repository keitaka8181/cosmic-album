import * as THREE from "three";

/**
 * 見開きアルバムの台紙テクスチャを手続き的に生成する。
 * 参考画像の「手描き風ノート」の雰囲気を目指す:
 * - 紙色のベース（アイボリー）
 * - 波線・太陽・雲などのシンプルな落書き
 * - 黒いクリップのアクセント（ここでは描画のみ、3Dで重ねてもよい）
 */
export function createAlbumTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 1280;
  const ctx = canvas.getContext("2d")!;

  const W = canvas.width;
  const H = canvas.height;

  // --- 紙のベース ---
  const paperGrad = ctx.createLinearGradient(0, 0, 0, H);
  paperGrad.addColorStop(0, "#f4ecd8");
  paperGrad.addColorStop(0.5, "#ede3c7");
  paperGrad.addColorStop(1, "#e8dcbc");
  ctx.fillStyle = paperGrad;
  ctx.fillRect(0, 0, W, H);

  // --- 紙のテクスチャ（粒子ノイズ） ---
  ctx.globalAlpha = 0.06;
  for (let i = 0; i < 4000; i++) {
    const x = Math.random() * W;
    const y = Math.random() * H;
    const r = Math.random() * 1.5;
    ctx.fillStyle = Math.random() > 0.5 ? "#5a4a2a" : "#8a7a5a";
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // --- 中央の綴じ目の影 ---
  const bindGrad = ctx.createLinearGradient(W / 2 - 40, 0, W / 2 + 40, 0);
  bindGrad.addColorStop(0, "rgba(0,0,0,0)");
  bindGrad.addColorStop(0.3, "rgba(60,40,20,0.15)");
  bindGrad.addColorStop(0.5, "rgba(40,25,10,0.3)");
  bindGrad.addColorStop(0.7, "rgba(60,40,20,0.15)");
  bindGrad.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = bindGrad;
  ctx.fillRect(W / 2 - 40, 0, 80, H);

  // --- 端のエイジング ---
  const edgeGrad = ctx.createLinearGradient(0, 0, 0, H);
  edgeGrad.addColorStop(0, "rgba(120, 90, 50, 0.2)");
  edgeGrad.addColorStop(0.1, "rgba(0,0,0,0)");
  edgeGrad.addColorStop(0.9, "rgba(0,0,0,0)");
  edgeGrad.addColorStop(1, "rgba(120, 90, 50, 0.2)");
  ctx.fillStyle = edgeGrad;
  ctx.fillRect(0, 0, W, H);

  // --- 落書き: 手書きタイトル "HELL HOUNDS" 風 ---
  ctx.strokeStyle = "#2a1f0a";
  ctx.fillStyle = "#2a1f0a";
  ctx.lineWidth = 4;

  // 右ページ上部のタイトルバナー
  ctx.font = "bold 60px Georgia, serif";
  ctx.textAlign = "center";
  ctx.fillText("HELL HOUNDS", W * 0.75, 130);

  // タイトル下の装飾線
  ctx.beginPath();
  ctx.moveTo(W * 0.6, 150);
  ctx.lineTo(W * 0.9, 150);
  ctx.stroke();

  // --- 太陽の落書き（右ページ上） ---
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(W * 0.92, 130, 35, 0, Math.PI * 2);
  ctx.stroke();
  // 太陽の光線
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const x1 = W * 0.92 + Math.cos(angle) * 45;
    const y1 = 130 + Math.sin(angle) * 45;
    const x2 = W * 0.92 + Math.cos(angle) * 60;
    const y2 = 130 + Math.sin(angle) * 60;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  // --- 雲の落書き（左ページ上） ---
  const drawCloud = (cx: number, cy: number, s: number) => {
    ctx.beginPath();
    ctx.arc(cx, cy, s, Math.PI, 0);
    ctx.arc(cx + s * 1.4, cy, s * 1.2, Math.PI, 0);
    ctx.arc(cx + s * 2.8, cy, s, Math.PI, 0);
    ctx.lineTo(cx + s * 3.8, cy);
    ctx.lineTo(cx - s, cy);
    ctx.closePath();
    ctx.stroke();
  };
  drawCloud(W * 0.1, 180, 20);
  drawCloud(W * 0.3, 150, 18);

  // --- 波線の落書き（下部） ---
  ctx.lineWidth = 3;
  ctx.beginPath();
  let waveY = H * 0.78;
  for (let x = 0; x <= W; x += 10) {
    const y = waveY + Math.sin(x * 0.02) * 12;
    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // 波線の下にもう一本
  ctx.beginPath();
  waveY = H * 0.82;
  for (let x = 0; x <= W; x += 10) {
    const y = waveY + Math.sin(x * 0.025 + 1) * 8;
    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // --- 小さな星/装飾 ---
  const drawStar = (cx: number, cy: number, s: number) => {
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const r = i % 2 === 0 ? s : s * 0.4;
      const angle = (i / 10) * Math.PI * 2 - Math.PI / 2;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
  };
  drawStar(W * 0.45, 100, 12);
  drawStar(W * 0.82, 700, 10);

  // --- テープ（写真下の白いマスキングテープ風のライン） ---
  ctx.fillStyle = "rgba(255, 250, 230, 0.6)";
  ctx.strokeStyle = "rgba(120, 100, 60, 0.3)";
  ctx.lineWidth = 1;
  const tapes: Array<[number, number, number, number, number]> = [
    // x, y, w, h, rotation(rad)
    [W * 0.18, H * 0.93, 200, 30, -0.02],
    [W * 0.5, H * 0.93, 220, 30, 0.015],
    [W * 0.82, H * 0.93, 200, 30, -0.01],
  ];
  for (const [x, y, w, h, rot] of tapes) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.fillRect(-w / 2, -h / 2, w, h);
    ctx.strokeRect(-w / 2, -h / 2, w, h);
    // テープ上のテキスト風
    ctx.fillStyle = "rgba(60,40,20,0.5)";
    ctx.font = "italic 18px Georgia";
    ctx.textAlign = "center";
    ctx.fillText("Best Clan ~ Hell Hounds", 0, 5);
    ctx.fillStyle = "rgba(255, 250, 230, 0.6)";
    ctx.restore();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}
