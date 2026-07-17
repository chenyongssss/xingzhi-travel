import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const incomingHeaders = await headers();
  const host = incomingHeaders.get("host") ?? "localhost:3000";
  const protocol = incomingHeaders.get("x-forwarded-proto") ?? "http";
  const description = "AI 一键定制详细自由行：三档透明预算、同行房型联动、预约提醒与可调整的每日行程。";
  return { metadataBase: new URL(`${protocol}://${host}`), title: "行知旅行｜把每一笔旅行预算说清楚", description, openGraph: { title: "行知旅行｜把每一笔旅行预算说清楚", description, images: [{ url: "/og.png", width: 1768, height: 941 }] }, twitter: { card: "summary_large_image", title: "行知旅行｜把每一笔旅行预算说清楚", description, images: ["/og.png"] } };
}
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="zh-CN"><body>{children}</body></html>; }
