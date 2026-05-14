import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <>
      <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-5" />
      <div className="ig-page-header flex items-start justify-between">
        <div className="flex items-stretch gap-3">
          <span aria-hidden="true" className="w-1 rounded-full bg-primary self-stretch shrink-0" />
          <div>
            <h2 className="ig-page-title">{title}</h2>
            {subtitle && <p className="ig-page-subtitle">{subtitle}</p>}
          </div>
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </>
  );
}
