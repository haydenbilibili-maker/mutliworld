'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface NavItem {
  label: string;
  href: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: '概览',
    items: [{ label: '仪表盘', href: '/admin' }],
  },
  {
    title: '数据管理',
    items: [
      { label: '发射日志', href: '/admin/data/launch-log' },
      { label: '轨道 TLE', href: '/admin/data/orbital' },
      { label: 'Geodata 缓存', href: '/admin/data/geodata' },
    ],
  },
  {
    title: '功能配置',
    items: [
      { label: '图层与区域', href: '/admin/features/layers' },
      { label: '区域数据集', href: '/admin/features/regions' },
      { label: '战略研究', href: '/admin/features/strategic-research' },
      { label: '空间层', href: '/admin/features/tiers' },
    ],
  },
];

function isActive(pathname: string, href: string): boolean {
  if (href === '/admin') return pathname === '/admin';
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-5">
      {NAV_GROUPS.map((group) => (
        <div key={group.title}>
          <p className="mb-2 px-3 text-[10px] font-medium uppercase tracking-wider text-dashboard-neutral/45">
            {group.title}
          </p>
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    className={[
                      'block rounded-lg px-3 py-2 text-sm transition-colors',
                      active
                        ? 'bg-dashboard-military/20 font-medium text-white'
                        : 'text-dashboard-neutral hover:bg-white/5 hover:text-white',
                    ].join(' ')}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

/** 管理后台侧边栏导航 */
export function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between border-b border-dashboard-neutral/15 px-4 py-3 lg:hidden">
        <Link href="/admin" className="text-sm font-semibold text-white">
          管理后台
        </Link>
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
          className="rounded-lg border border-dashboard-neutral/25 px-3 py-1.5 text-xs text-dashboard-neutral hover:text-white"
        >
          {mobileOpen ? '收起' : '菜单'}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-b border-dashboard-neutral/15 px-3 py-4 lg:hidden">
          <NavLinks pathname={pathname} onNavigate={() => setMobileOpen(false)} />
        </div>
      )}

      <aside className="hidden w-56 shrink-0 flex-col border-r border-dashboard-neutral/15 bg-[#070a10] lg:flex">
        <div className="border-b border-dashboard-neutral/15 px-4 py-5">
          <Link href="/admin" className="block text-base font-semibold text-white">
            管理后台
          </Link>
          <p className="mt-1 text-xs text-dashboard-neutral/55">寰宇态势感知平台</p>
        </div>
        <div className="flex-1 overflow-y-auto px-2 py-4">
          <NavLinks pathname={pathname} />
        </div>
        <div className="border-t border-dashboard-neutral/15 px-4 py-3">
          <Link
            href="/"
            className="text-xs text-dashboard-neutral hover:text-dashboard-military"
          >
            ← 返回地图
          </Link>
        </div>
      </aside>
    </>
  );
}
