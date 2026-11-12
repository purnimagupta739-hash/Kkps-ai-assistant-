import React from 'react';
import { School, Info, RotateCcw, History, Sun, Moon } from 'lucide-react';
import { ThemeMode } from '../types.ts';

interface HeaderProps {
  onOpenInfo: () => void;
  onClearChat: () => void;
  onOpenHistory: () => void;
  onToggleTheme: () => void;
  theme: ThemeMode;
  messageCount: number;
  savedChatCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenInfo,
  onClearChat,
  onOpenHistory,
  onToggleTheme,
  theme,
  messageCount,
  savedChatCount,
}) => {
  const isDark = theme === 'dark';

  return (
    <header
      className={`shrink-0 z-30 transition-colors duration-300 border-b ${
        isDark
          ? 'bg-[#071329] text-white border-blue-900/60 shadow-lg'
          : 'bg-white text-[#0B1B3D] border-slate-200/90 shadow-xs'
      }`}
    >
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-3">
        {/* Left: School Crest with Subtle Golden Glow & Title */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border golden-glow transition-transform active:scale-95 ${
              isDark
                ? 'bg-gradient-to-br from-[#0B1B3D] to-[#040a16] border-amber-400/60'
                : 'bg-gradient-to-br from-[#0B1B3D] to-[#122b5e] border-amber-400/70 shadow-sm'
            }`}
            title="Kanyakubja Public School Crest"
          >
            <School className="w-5 h-5 text-amber-300" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <h1
                className={`text-sm sm:text-base font-bold tracking-tight truncate ${
                  isDark ? 'text-white' : 'text-[#0B1B3D]'
                }`}
              >
                Kanyakubja Public School
              </h1>
              <span
                className={`px-2 py-0.5 text-[9.5px] sm:text-[10px] font-bold rounded-full tracking-wide uppercase shrink-0 border ${
                  isDark
                    ? 'bg-amber-400/15 text-amber-300 border-amber-400/40'
                    : 'bg-amber-100/80 text-amber-900 border-amber-300'
                }`}
              >
                KKPS AI Assistant
              </span>
            </div>
            <p
              className={`text-[11px] sm:text-xs truncate ${
                isDark ? 'text-blue-200/80' : 'text-slate-500'
              }`}
            >
              CBSE Affiliated · Cantt, The Mall, Kanpur
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Theme Toggle (Dark / Light) */}
          <button
            type="button"
            onClick={onToggleTheme}
            className={`p-2 rounded-xl transition-all min-h-[38px] min-w-[38px] flex items-center justify-center border active:scale-95 ${
              isDark
                ? 'bg-blue-950/70 border-amber-400/30 text-amber-300 hover:bg-blue-900'
                : 'bg-slate-100 border-slate-200 text-[#0B1B3D] hover:bg-amber-50 hover:border-amber-300'
            }`}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-300 animate-spin-slow" />
            ) : (
              <Moon className="w-4 h-4 text-[#0B1B3D]" />
            )}
          </button>

          {/* Chat History Button */}
          <button
            type="button"
            onClick={onOpenHistory}
            className={`relative p-2 rounded-xl transition-all min-h-[38px] min-w-[38px] flex items-center justify-center border active:scale-95 ${
              isDark
                ? 'bg-blue-950/70 border-blue-800 text-blue-200 hover:text-white hover:bg-blue-900'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:text-[#0B1B3D] hover:bg-slate-200'
            }`}
            title="View saved chat history"
            aria-label="Chat history"
          >
            <History className="w-4 h-4" />
            {savedChatCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-slate-900 text-[9.5px] font-extrabold rounded-full flex items-center justify-center shadow-xs">
                {savedChatCount}
              </span>
            )}
          </button>

          {/* School Info Trigger */}
          <button
            type="button"
            onClick={onOpenInfo}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-xs font-semibold rounded-xl transition-all border active:scale-95 min-h-[38px] ${
              isDark
                ? 'bg-[#0B1B3D] border-amber-400/40 text-amber-300 hover:bg-blue-900'
                : 'bg-blue-50/80 border-blue-200 text-[#0B1B3D] hover:bg-blue-100'
            }`}
            title="View Verified School Information"
          >
            <Info className="w-4 h-4 text-amber-400" />
            <span className="hidden xs:inline">Info</span>
          </button>

          {/* Clear / Reset Active Chat */}
          {messageCount > 1 && (
            <button
              type="button"
              onClick={onClearChat}
              className={`p-2 rounded-xl transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center ${
                isDark
                  ? 'text-slate-400 hover:text-white hover:bg-blue-900/60'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="Reset current conversation"
              aria-label="Reset chat"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Multilingual Support Banner */}
      <div
        className={`px-3 py-1.5 text-center border-t transition-colors text-[11px] font-medium ${
          isDark
            ? 'bg-[#050e1f] border-blue-950 text-blue-200/90'
            : 'bg-slate-50 border-slate-200/70 text-slate-600'
        }`}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>
            <strong className={isDark ? 'text-emerald-400' : 'text-emerald-700'}>Voice & Text</strong> · Ask in <strong className={isDark ? 'text-amber-300' : 'text-[#0B1B3D]'}>English</strong>,{' '}
            <strong className={isDark ? 'text-amber-300' : 'text-[#0B1B3D]'}>Hindi</strong>, or{' '}
            <strong className={isDark ? 'text-amber-300' : 'text-[#0B1B3D]'}>Hinglish</strong>
          </span>
        </div>
      </div>
    </header>
  );
};
