import type { Metadata } from 'next';
import { MotionConfig } from 'framer-motion';
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
      {/*
        MotionConfig reducedMotion="user"：全局让所有 framer-motion 动画（23+ 组件的
        弹窗入场/面板滑入/列表过渡）自动响应用户系统的「减弱动态效果」设置——启用时
        跳过 transform/opacity 动画，仅保留布局变化。配合 globals.css 的
        prefers-reduced-motion 兜底，达成 PRD「reduced-motion 全覆盖」P0 要求。
      */}
      <body className="antialiased min-h-screen">
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </body>
    </html>
  );
}
