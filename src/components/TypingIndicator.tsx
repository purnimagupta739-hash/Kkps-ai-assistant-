import React from 'react';
import { School } from 'lucide-react';
import { ThemeMode } from '../types.ts';

interface TypingIndicatorProps {
  theme?: ThemeMode;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ theme = 'light' }) => {
  const isDark = theme === 'dark';

  return (
    <div className="flex items-start gap-2.5 max-w-[85%] sm:max-w-[75%] my-2 animate-message-slide">
      {/* School Avatar with Subtle Golden Glow */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border golden-glow transition-all ${
          isDark
            ? 'bg-[#0B1B3D] text-amber-300 border-amber-400'
            : 'bg-[#0B1B3D] text-amber-300 border-amber-400/60 shadow-sm'
        }`}
        aria-hidden="true"
      >
        <School className="w-4 h-4" />
      </div>

      <div
        className={`border rounded-2xl rounded-tl-xs px-4 py-3 shadow-xs transition-colors ${
          isDark
            ? 'bg-[#0E224D] border-amber-400/25 text-white'
            : 'bg-white border-slate-200/90 text-slate-800'
        }`}
      >
        <div className="flex items-center gap-1.5 h-5">
          <span
            className={`text-xs font-semibold mr-1.5 ${
              isDark ? 'text-amber-300' : 'text-[#0B1B3D]'
            }`}
          >
            KKPS Assistant
          </span>
          {/* Three Animated Typing Dots */}
          <span
            className={`w-2 h-2 rounded-full typing-dot-1 ${
              isDark ? 'bg-amber-400' : 'bg-[#0B1B3D]'
            }`}
          />
          <span
            className={`w-2 h-2 rounded-full typing-dot-2 ${
              isDark ? 'bg-amber-300' : 'bg-[#1E3A8A]'
            }`}
          />
          <span
            className={`w-2 h-2 rounded-full typing-dot-3 ${
              isDark ? 'bg-blue-400' : 'bg-[#3B82F6]'
            }`}
          />
        </div>
      </div>
    </div>
  );
};
