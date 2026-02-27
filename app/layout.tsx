import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "万物见我 · 一期一会",
  description: "此时此刻的相遇，一生仅有一次，绝不重来。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
