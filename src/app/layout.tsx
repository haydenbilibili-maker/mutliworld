import type { Metadata } from 'next';
import 'maplibre-gl/dist/maplibre-gl.css';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: '寰宇态势感知平台',
  description: '中国视角的全球地缘政治、经济、安全与自然灾害态势实时可视化',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
