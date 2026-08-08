import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HELL HOUNDS — Camp Archive",
  description: "宇宙規模で記録される、キャンプの軌跡",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full antialiased">
      <body className="min-h-full bg-[#0a0521] text-white overflow-hidden">
        {children}
      </body>
    </html>
  );
}
