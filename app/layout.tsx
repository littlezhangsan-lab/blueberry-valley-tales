import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "蓝莓谷异闻录｜第一季",
  description: "十二则发生在蓝莓谷的东方民俗异闻。全十二话，完整在线阅读。",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
