import type { Metadata } from 'next';
import 'maplibre-gl/dist/maplibre-gl.css';
import '@/app/globals.css';

import { BRAND } from '@/lib/brand';

export const metadata: Metadata = {
  title: `${BRAND.full} · 全球态势感知`,
  description: `${BRAND.description}。${BRAND.authorship}。`,
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
