"use client";

/**
 * シーン初期化中に表示するローディング画面。
 * 宇宙らしい雰囲気を保ったシンプルなスピナー。
 */
export function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#0a0521] z-50">
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-[#3d1a6b]" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#6ab6ff] animate-spin" />
        </div>
        <p className="text-white/60 text-sm tracking-[0.3em] uppercase">
          Loading
        </p>
      </div>
    </div>
  );
}
