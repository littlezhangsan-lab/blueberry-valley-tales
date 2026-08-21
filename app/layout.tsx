import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://blueberry-valley-tales.littlezhangsan.workers.dev"),
  title: "蓝莓谷异闻录｜第一季",
  description: "十二则发生在蓝莓谷的东方民俗异闻。全十二话，完整在线阅读。",
  icons: { icon: "/favicon.png", shortcut: "/favicon.png" },
  openGraph: {
    title: "蓝莓谷异闻录｜第一季",
    description: "十二则发生在蓝莓谷的东方民俗异闻。全十二话，完整在线阅读。",
    url: "/",
    siteName: "蓝莓谷异闻录",
    type: "website",
    images: [{ url: "/og.png", width: 1672, height: 941, alt: "蓝莓谷异闻录 第一季 · 全十二话" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "蓝莓谷异闻录｜第一季",
    description: "十二则发生在蓝莓谷的东方民俗异闻。全十二话，完整在线阅读。",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
