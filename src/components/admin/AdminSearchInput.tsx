'use client';

import { useState } from 'react';

interface AdminSearchInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

/** 管理后台表格搜索框 */
export function AdminSearchInput({
  placeholder = '搜索…',
  value: controlled,
  onChange,
  className = '',
}: AdminSearchInputProps) {
  const [internal, setInternal] = useState('');
  const value = controlled ?? internal;

  const handleChange = (next: string) => {
    setInternal(next);
    onChange?.(next);
  };

  return (
    <input
      type="search"
      value={value}
      onChange={(e) => handleChange(e.target.value)}
      placeholder={placeholder}
      className={[
        'w-full max-w-xs rounded-lg border border-dashboard-neutral/20 bg-black/30 px-3 py-2',
        'text-sm text-white placeholder:text-dashboard-neutral/40',
        'focus:border-dashboard-military/50 focus:outline-none focus:ring-1 focus:ring-dashboard-military/30',
        className,
      ].join(' ')}
    />
  );
}

/** 客户端表格行过滤 */
export function filterTableRows<T>(
  rows: T[],
  query: string,
  pickText: (row: T) => string,
): T[] {
  const q = query.trim().toLowerCase();
  if (!q) return rows;
  return rows.filter((row) => pickText(row).toLowerCase().includes(q));
}
