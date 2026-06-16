'use client';

interface PanelCloseButtonProps {
  onClick: () => void;
  /** aria-label，默认「关闭」 */
  label?: string;
  /** 紧凑模式仅显示 ×（用于空间受限的标题栏） */
  compact?: boolean;
  className?: string;
}

const BASE =
  'shrink-0 rounded-md text-dashboard-neutral transition-colors hover:bg-white/5 hover:text-white';

/** 面板统一关闭按钮：× 关闭 + 一致 hover 与 aria-label */
export function PanelCloseButton({
  onClick,
  label = '关闭',
  compact = false,
  className = '',
}: PanelCloseButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={[BASE, compact ? 'px-1.5 py-0.5' : 'px-2 py-1', className].join(' ')}
    >
      {compact ? '×' : '× 关闭'}
    </button>
  );
}
