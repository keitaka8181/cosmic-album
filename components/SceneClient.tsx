"use client";

import dynamic from "next/dynamic";
import { Loader } from "./UI/Loader";
import { HUD } from "./UI/HUD";

// Three.js は SSR と相性が悪いので、クライアントのみで読み込む
const Scene = dynamic(() => import("./Scene").then((m) => m.Scene), {
  ssr: false,
  loading: () => <Loader />,
});

export function SceneClient() {
  return (
    <>
      <div className="fixed inset-0">
        <Scene />
      </div>
      <HUD />
    </>
  );
}
