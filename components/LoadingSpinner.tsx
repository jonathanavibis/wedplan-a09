import React from 'react';
import { Heart } from 'lucide-react';

export default function LoadingSpinner({ text = 'Loading wedding details...' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 space-y-4">
      <div className="relative">
        <div className="w-14 h-14 rounded-full border-4 border-rose-100 border-t-rose-500 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Heart className="w-5 h-5 text-rose-500 animate-pulse fill-rose-500" />
        </div>
      </div>
      <p className="text-sm font-medium text-stone-600 animate-pulse">{text}</p>
    </div>
  );
}
