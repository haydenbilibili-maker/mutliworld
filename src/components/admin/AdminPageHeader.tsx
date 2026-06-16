interface AdminPageHeaderProps {
  title: string;
  description?: string;
}

/** 管理后台页面标题区 */
export function AdminPageHeader({ title, description }: AdminPageHeaderProps) {
  return (
    <header className="mb-6 border-b border-dashboard-neutral/15 pb-4 sm:mb-8">
      <h1 className="text-xl font-semibold text-white sm:text-2xl">{title}</h1>
      {description && (
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-dashboard-neutral/70">
          {description}
        </p>
      )}
    </header>
  );
}
