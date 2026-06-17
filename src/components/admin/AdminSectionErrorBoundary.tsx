'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  title: string;
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

/** 管理后台区块级错误边界 */
export class AdminSectionErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`[admin:${this.props.title}]`, error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-xl border border-red-500/25 bg-red-500/5 p-4">
          <h3 className="text-sm font-medium text-red-300">{this.props.title} 加载失败</h3>
          <p className="mt-1 text-xs text-red-200/70">{this.state.message || '未知错误'}</p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false, message: '' })}
            className="mt-3 rounded border border-red-400/30 px-2 py-1 text-xs text-red-200 hover:bg-red-500/10"
          >
            重试
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
