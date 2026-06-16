/** 管理后台是否可用（开发环境或显式开启） */
export function isAdminEnabled(): boolean {
  return (
    process.env.NODE_ENV === 'development' ||
    process.env.NEXT_PUBLIC_ADMIN_ENABLED === 'true'
  );
}
