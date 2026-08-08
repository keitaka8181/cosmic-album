"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * 宇宙背景。
 * - 大量の星（Points）
 * - 遠景の紫〜青のネビュラ風グラデーション（大きな球の内側）
 *
 * 参考画像のような「紫がかった星雲」の雰囲気を再現する。
 */
export function Starfield() {
  const starsRef = useRef<THREE.Points>(null);

  // 星の配置を生成（球面上にランダム分布）
  const { positions, colors, sizes } = useMemo(() => {
    const count = 3000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // 球座標でランダム配置
      const radius = 40 + Math.random() * 20;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // 星の色: 白・青白・薄紫のバリエーション
      const colorChoice = Math.random();
      if (colorChoice < 0.7) {
        // 白系
        const b = 0.9 + Math.random() * 0.1;
        colors[i * 3] = b;
        colors[i * 3 + 1] = b;
        colors[i * 3 + 2] = b;
      } else if (colorChoice < 0.9) {
        // 青白
        colors[i * 3] = 0.7;
        colors[i * 3 + 1] = 0.8;
        colors[i * 3 + 2] = 1.0;
      } else {
        // 薄紫
        colors[i * 3] = 0.9;
        colors[i * 3 + 1] = 0.7;
        colors[i * 3 + 2] = 1.0;
      }

      // サイズにばらつき
      sizes[i] = Math.random() * 2 + 0.3;
    }

    return { positions, colors, sizes };
  }, []);

  // 星のゆっくりした回転
  useFrame((_, delta) => {
    if (starsRef.current) {
      starsRef.current.rotation.y += delta * 0.005;
    }
  });

  return (
    <>
      {/* ネビュラ風背景（巨大な球の内側にグラデーション） */}
      <mesh>
        <sphereGeometry args={[80, 32, 32]} />
        <shaderMaterial
          side={THREE.BackSide}
          uniforms={{
            topColor: { value: new THREE.Color("#1a0b3d") },
            midColor: { value: new THREE.Color("#3d1a6b") },
            bottomColor: { value: new THREE.Color("#0a0521") },
          }}
          vertexShader={`
            varying vec3 vWorldPos;
            void main() {
              vWorldPos = position;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            uniform vec3 topColor;
            uniform vec3 midColor;
            uniform vec3 bottomColor;
            varying vec3 vWorldPos;

            // 安価な疑似ノイズ
            float hash(vec3 p) {
              p = fract(p * 0.3183099 + 0.1);
              p *= 17.0;
              return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
            }

            void main() {
              vec3 dir = normalize(vWorldPos);
              float h = dir.y * 0.5 + 0.5;

              vec3 color = mix(bottomColor, midColor, smoothstep(0.0, 0.6, h));
              color = mix(color, topColor, smoothstep(0.5, 1.0, h));

              // ネビュラ風のムラ
              float n = hash(floor(vWorldPos * 0.05));
              color += vec3(0.08, 0.04, 0.15) * n;

              gl_FragColor = vec4(color, 1.0);
            }
          `}
        />
      </mesh>

      {/* 星々 */}
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
          <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
        </bufferGeometry>
        <shaderMaterial
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          vertexShader={`
            attribute float size;
            varying vec3 vColor;
            void main() {
              vColor = color;
              vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
              gl_PointSize = size * (300.0 / -mvPosition.z);
              gl_Position = projectionMatrix * mvPosition;
            }
          `}
          fragmentShader={`
            varying vec3 vColor;
            void main() {
              // 点を丸く（中心から離れるほど透明に）
              vec2 uv = gl_PointCoord - 0.5;
              float dist = length(uv);
              if (dist > 0.5) discard;
              float alpha = smoothstep(0.5, 0.0, dist);
              gl_FragColor = vec4(vColor, alpha);
            }
          `}
          vertexColors
        />
      </points>
    </>
  );
}
