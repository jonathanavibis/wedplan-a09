import React from 'react';
import { Sparkles } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export default function EmptyState({
  title,
  description,
  actionText,
  onAction,
  icon,
}: EmptyStateProps) {
  return (
    <div className="bg-white rounded-3xl p-10 text-center border border-rose-100 max-w-md mx-auto my-8 shadow-xs">
      <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4">
        {icon || <Sparkles className="w-7 h-7" />}
      </div>
      <h3 className="text-lg font-bold font-serif text-stone-900 mb-1.5">{title}</h3>
      <p className="text-xs text-stone-500 mb-5 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition shadow-xs"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
