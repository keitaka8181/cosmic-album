"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * マウス位置に応じてカメラを微妙に動かし、立体感を強調する。
 * 動かしすぎるとレイアウトが崩れるので振幅は控えめ。
 */
export function CameraRig() {
  const { camera, pointer } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 0, 5));

  useFrame(() => {
    // pointer は -1 〜 1 の正規化座標
    targetPos.current.set(pointer.x * 0.3, pointer.y * 0.15, 5);
    camera.position.lerp(targetPos.current, 0.05);
    camera.lookAt(0, 0, 0);
  });

  return null;
}
