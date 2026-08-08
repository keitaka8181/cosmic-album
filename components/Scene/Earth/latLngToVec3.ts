import * as THREE from "three";

/**
 * 緯度経度を球面上の3D座標に変換する。
 * Three.js の Sphere のデフォルト UV にマッチするよう、経度は -Z を基準に反時計回りで計算。
 *
 * @param lat 緯度（度数法、-90 〜 90）
 * @param lng 経度（度数法、-180 〜 180）
 * @param radius 球の半径
 */
export function latLngToVec3(
  lat: number,
  lng: number,
  radius: number,
): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180); // 極角
  const theta = (lng + 180) * (Math.PI / 180); // 方位角

  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);

  return new THREE.Vector3(x, y, z);
}
