'use client';

/**
 * React ECharts 封装 — LIFEOS-005
 *
 * 替代 Iran 原 `vue-echarts`，用于迁入中东模块的图表 Widget。
 * 采用动态导入：未安装 echarts 时不阻塞构建；安装后自动生效。
 *
 * 启用前置：在 China 项目执行  npm install echarts
 */

import { useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';

interface EChartProps {
  /** ECharts option 对象（可直接复用 Iran 的图表配置） */
  option: Record<string, unknown>;
  className?: string;
  style?: CSSProperties;
  /** 主题，默认暗色 */
  theme?: string;
}

// 最小化的实例形状，避免对 echarts 类型的硬依赖
interface EChartsInstanceLike {
  setOption: (option: unknown) => void;
  resize: () => void;
  dispose: () => void;
}

export function EChart({
  option,
  className = '',
  style,
  theme = 'dark',
}: EChartProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let chart: EChartsInstanceLike | null = null;
    let disposed = false;

    // echarts 已安装：静态动态导入，确保被打包并加载
    import('echarts')
      .then((echarts) => {
        if (disposed || !ref.current) return;
        chart = echarts.init(
          ref.current,
          theme,
        ) as unknown as EChartsInstanceLike;
        chart.setOption(option);
      })
      .catch(() => {
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.warn('[EChart] echarts 加载失败');
        }
      });

    const onResize = () => chart?.resize();
    window.addEventListener('resize', onResize);

    return () => {
      disposed = true;
      window.removeEventListener('resize', onResize);
      chart?.dispose();
    };
  }, [option, theme]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ width: '100%', height: '100%', ...style }}
    />
  );
}
