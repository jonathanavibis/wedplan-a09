import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  breadcrumbs?: { label: string; href?: string }[];
  action?: React.ReactNode;
}

export default function PageHeader({
  title,
  subtitle,
  badge,
  breadcrumbs,
  action,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1.5 text-xs text-stone-400 mb-2">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-rose-600 transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-stone-600 font-medium">{crumb.label}</span>
                )}
                {idx < breadcrumbs.length - 1 && <ChevronRight className="w-3 h-3 text-stone-300" />}
              </React.Fragment>
            ))}
          </nav>
        )}

        {badge && (
          <span className="text-[10px] uppercase font-bold tracking-wider text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-100">
            {badge}
          </span>
        )}

        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-1">{title}</h1>
        {subtitle && <p className="text-xs text-stone-500 mt-1">{subtitle}</p>}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
