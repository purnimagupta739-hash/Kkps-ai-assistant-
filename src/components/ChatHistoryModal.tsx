import React from 'react';
import {
  X,
  History,
  Plus,
  Trash2,
  MessageSquare,
  Clock,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { SavedConversation, ThemeMode } from '../types.ts';

interface ChatHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedChats: SavedConversation[];
  activeChatId: string | null;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onDeleteChat: (id: string) => void;
  onClearAllChats: () => void;
  theme: ThemeMode;
}

export const ChatHistoryModal: React.FC<ChatHistoryModalProps> = ({
  isOpen,
  onClose,
  savedChats,
  activeChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onClearAllChats,
  theme,
}) => {
  if (!isOpen) return null;

  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
      {/* Modal Dialog */}
      <div
        className={`w-full max-w-lg rounded-3xl shadow-2xl border overflow-hidden flex flex-col max-h-[88vh] transition-colors ${
          isDark
            ? 'bg-[#0A1838] border-amber-400/30 text-white'
            : 'bg-white border-slate-200 text-slate-800'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="history-modal-title"
      >
        {/* Modal Header */}
        <div
          className={`p-4 sm:p-5 flex items-center justify-between border-b ${
            isDark
              ? 'bg-[#071329] border-blue-900/60'
              : 'bg-[#0B1B3D] text-white border-blue-950'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/15 border border-amber-400/40 flex items-center justify-center shrink-0">
              <History className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="history-modal-title" className="text-base font-bold text-white">
                  Chat History
                </h2>
                <span className="text-[10.5px] px-2 py-0.5 rounded-full font-semibold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  {savedChats.length} {savedChats.length === 1 ? 'Chat' : 'Chats'}
                </span>
              </div>
              <p className="text-xs text-blue-200/80">
                Saved privately on this device
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-blue-200 hover:text-white hover:bg-white/10 rounded-xl transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Bar: New Chat & Clear All */}
        <div
          className={`p-3 px-4 border-b flex items-center justify-between gap-2 ${
            isDark
              ? 'bg-[#091530] border-blue-900/40'
              : 'bg-slate-50 border-slate-200/90'
          }`}
        >
          <button
            type="button"
            onClick={() => {
              onNewChat();
              onClose();
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95 bg-[#0B1B3D] hover:bg-blue-900 text-amber-300 border border-amber-400/40"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Start New Chat</span>
          </button>

          {savedChats.length > 0 && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Are you sure you want to delete all saved conversations?')) {
                  onClearAllChats();
                }
              }}
              className={`text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                isDark
                  ? 'text-rose-300 hover:text-rose-200 hover:bg-rose-950/40'
                  : 'text-rose-600 hover:text-rose-800 hover:bg-rose-50'
              }`}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          )}
        </div>

        {/* Saved Chats List / Empty State */}
        <div className="p-3 sm:p-4 overflow-y-auto space-y-2.5 flex-1 min-h-[220px]">
          {savedChats.length === 0 ? (
            /* Friendly Empty State */
            <div className="flex flex-col items-center justify-center py-10 text-center px-4">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 border ${
                  isDark
                    ? 'bg-[#0E224D] border-amber-400/30 text-amber-300'
                    : 'bg-blue-50 border-blue-200 text-[#0B1B3D]'
                }`}
              >
                <MessageSquare className="w-7 h-7" />
              </div>
              <h3
                className={`text-sm font-bold mb-1 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                No Saved Chats Yet
              </h3>
              <p
                className={`text-xs max-w-xs mb-5 leading-relaxed ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                Your previous questions and conversations with KKPS AI Assistant will appear here so you can revisit them anytime.
              </p>
              <button
                type="button"
                onClick={() => {
                  onNewChat();
                  onClose();
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#0B1B3D] to-blue-900 text-white text-xs font-bold rounded-xl border border-amber-400/40 shadow-sm hover:brightness-110 active:scale-95 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Ask Your First Question</span>
              </button>
            </div>
          ) : (
            /* Saved Chats Cards */
            savedChats.map((chat) => {
              const isActive = chat.id === activeChatId;
              return (
                <div
                  key={chat.id}
                  className={`group relative p-3.5 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                    isActive
                      ? isDark
                        ? 'bg-[#122754] border-amber-400/60 shadow-md ring-1 ring-amber-400/30'
                        : 'bg-blue-50/80 border-[#0B1B3D]/40 shadow-xs ring-1 ring-[#0B1B3D]/20'
                      : isDark
                      ? 'bg-[#0E224D]/60 hover:bg-[#122754] border-blue-900/40 hover:border-amber-400/40'
                      : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-blue-300'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      onSelectChat(chat.id);
                      onClose();
                    }}
                    className="flex-1 text-left min-w-0"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-xs font-bold truncate ${
                          isDark ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        {chat.title}
                      </span>
                      {isActive && (
                        <span className="text-[9.5px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-400/30">
                          Active
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{chat.updatedAt}</span>
                      </span>
                      <span>·</span>
                      <span>{chat.messages.length} messages</span>
                    </div>
                  </button>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        onSelectChat(chat.id);
                        onClose();
                      }}
                      className={`p-1.5 rounded-lg transition-colors text-xs font-semibold flex items-center gap-1 ${
                        isDark
                          ? 'text-amber-300 hover:bg-amber-400/10'
                          : 'text-[#0B1B3D] hover:bg-blue-100'
                      }`}
                      title="Open chat"
                    >
                      <span className="hidden sm:inline">Open</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm('Delete this conversation?')) {
                          onDeleteChat(chat.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                      title="Delete conversation"
                      aria-label="Delete chat"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div
          className={`p-3 px-4 border-t flex items-center justify-between text-xs ${
            isDark
              ? 'bg-[#071329] border-blue-900/60 text-slate-400'
              : 'bg-slate-50 border-slate-200 text-slate-500'
          }`}
        >
          <span>Chat history is stored locally on this device.</span>
          <button
            type="button"
            onClick={onClose}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              isDark
                ? 'bg-blue-900/60 hover:bg-blue-800 text-white'
                : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
