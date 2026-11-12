import React, { useState, useEffect, useRef } from 'react';
import { Message, SavedConversation, ThemeMode } from './types.ts';
import { Header } from './components/Header.tsx';
import { ChatMessage } from './components/ChatMessage.tsx';
import { TypingIndicator } from './components/TypingIndicator.tsx';
import { ChatInput } from './components/ChatInput.tsx';
import { SmartQuickQuestions } from './components/SmartQuickQuestions.tsx';
import { SchoolInfoModal } from './components/SchoolInfoModal.tsx';
import { ChatHistoryModal } from './components/ChatHistoryModal.tsx';

const INITIAL_WELCOME_MESSAGE: Message = {
  id: 'welcome-1',
  sender: 'assistant',
  text: `Namaste! Welcome to KKPS AI Assistant (Kanyakubja Public School).

I can help you with verified information about:
• Principal: Miss Pooja Sehgal
• School Timings (Summer: 8:00 AM - 2:00 PM | Winter: 8:30 AM - 2:30 PM)
• Festivals & School Holidays (Diwali, Holi, Republic Day, Independence Day, etc.)
• Campus Address in Cantt, The Mall, Kanpur & CBSE Board Affiliation

Voice & Text Features:
• Tap the microphone button (🎙️) to speak your question in English or Hindi/Hinglish.
• Tap "Listen" (🔊) on any answer to listen with pause and stop controls.

Language Rules:
• English questions will receive answers in English.
• Hindi & Hinglish questions will receive answers in natural Hinglish (using English letters).

How may I assist you today?`,
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
};

const THEME_STORAGE_KEY = 'kkps_theme_preference';
const CHAT_STORAGE_KEY = 'kkps_saved_chats';

export default function App() {
  // Theme state: dark / light
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored === 'dark' || stored === 'light') return stored;
    } catch {
      // Ignore storage errors
    }
    return 'light';
  });

  // Saved conversations
  const [savedChats, setSavedChats] = useState<SavedConversation[]>(() => {
    try {
      const stored = localStorage.getItem(CHAT_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Ignore parse errors
    }
    return [];
  });

  const [activeChatId, setActiveChatId] = useState<string>(() => `chat-${Date.now()}`);
  const [messages, setMessages] = useState<Message[]>([INITIAL_WELCOME_MESSAGE]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync theme with document & localStorage
  const handleToggleTheme = () => {
    const nextTheme: ThemeMode = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch {
      // Ignore storage quota
    }
  };

  // Auto-scroll to bottom of chat
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Sync current conversation with saved chats in localStorage
  useEffect(() => {
    const hasUserMessages = messages.some((m) => m.sender === 'user');
    if (!hasUserMessages) return;

    // Determine readable title from first user query
    const firstUserMsg = messages.find((m) => m.sender === 'user');
    let title = 'School Discussion';
    if (firstUserMsg && firstUserMsg.text) {
      const raw = firstUserMsg.text.replace(/\n+/g, ' ').trim();
      title = raw.length > 38 ? `${raw.slice(0, 38)}...` : raw;
    }

    const nowFormatted = new Date().toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    setSavedChats((prevChats) => {
      const existingIdx = prevChats.findIndex((c) => c.id === activeChatId);
      const updatedChat: SavedConversation = {
        id: activeChatId,
        title,
        createdAt: existingIdx >= 0 ? prevChats[existingIdx].createdAt : nowFormatted,
        updatedAt: nowFormatted,
        messages,
      };

      let newChats: SavedConversation[];
      if (existingIdx >= 0) {
        newChats = [...prevChats];
        newChats[existingIdx] = updatedChat;
      } else {
        newChats = [updatedChat, ...prevChats];
      }

      try {
        localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(newChats));
      } catch {
        // Storage quota protection
      }

      return newChats;
    });
  }, [messages, activeChatId]);

  // Start a fresh conversation
  const handleNewChat = () => {
    setActiveChatId(`chat-${Date.now()}`);
    setMessages([
      {
        ...INITIAL_WELCOME_MESSAGE,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  // Load a previously saved conversation
  const handleSelectChat = (id: string) => {
    const targetChat = savedChats.find((c) => c.id === id);
    if (targetChat && targetChat.messages) {
      setActiveChatId(targetChat.id);
      setMessages(targetChat.messages);
    }
  };

  // Delete an individual saved conversation
  const handleDeleteChat = (id: string) => {
    const nextChats = savedChats.filter((c) => c.id !== id);
    setSavedChats(nextChats);
    try {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(nextChats));
    } catch {
      // Ignore
    }

    // If currently viewing deleted chat, reset to new
    if (activeChatId === id) {
      handleNewChat();
    }
  };

  // Clear all saved conversations
  const handleClearAllChats = () => {
    setSavedChats([]);
    try {
      localStorage.removeItem(CHAT_STORAGE_KEY);
    } catch {
      // Ignore
    }
    handleNewChat();
  };

  // Send message handler
  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessageTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: userMessageTime,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const historyPayload = updatedMessages.slice(-8).map((msg) => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        text: msg.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text.trim(),
          history: historyPayload,
        }),
      });

      const data = await res.json();
      const assistantMessageTime = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });

      if (data && data.reply) {
        setMessages((prev) => [
          ...prev,
          {
            id: `assistant-${Date.now()}`,
            sender: 'assistant',
            text: data.reply,
            timestamp: assistantMessageTime,
            isError: false,
          },
        ]);
      } else {
        const hasHindiOrHinglish =
          /[\u0900-\u097F]/.test(text) ||
          /\b(kya|kab|kahan|kaise|hai|hain|kaun|kitna|kitni|batao|bataiye|samay|pata|shuru|honge|dakhila|poochna)\b/i.test(text);

        const friendlyFallback = hasHindiOrHinglish
          ? 'Iske baare mein details abhi confirm nahi hain. Confirmation ke liye aap school office mein ek baar pooch sakte hain:\n• School Office: 0512-2330410\n• Handbook Mobile: 9473957947'
          : 'This information is not confirmed yet. Please contact the school office for confirmation:\n• School Office: 0512-2330410\n• Handbook Mobile: 9473957947';

        setMessages((prev) => [
          ...prev,
          {
            id: `assistant-${Date.now()}`,
            sender: 'assistant',
            text: data?.fallbackReply || friendlyFallback,
            timestamp: assistantMessageTime,
            isError: false,
          },
        ]);
      }
    } catch (error) {
      console.error('Chat request failed:', error);
      const assistantMessageTime = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });

      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          sender: 'assistant',
          text: 'Unable to connect to the server. Please check your internet connection and try again.',
          timestamp: assistantMessageTime,
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const isDark = theme === 'dark';

  return (
    <div
      className={`flex flex-col h-[100dvh] w-full overflow-hidden transition-colors duration-300 font-sans ${
        isDark
          ? 'bg-[#071329] text-slate-100'
          : 'bg-white text-slate-800'
      }`}
    >
      {/* Top Header with Theme, History, & Golden Glow Crest */}
      <Header
        onOpenInfo={() => setIsInfoModalOpen(true)}
        onClearChat={handleNewChat}
        onOpenHistory={() => setIsHistoryModalOpen(true)}
        onToggleTheme={handleToggleTheme}
        theme={theme}
        messageCount={messages.length}
        savedChatCount={savedChats.length}
      />

      {/* Permanently Fixed Smart Quick Questions at the TOP of the Chat Area */}
      <div
        className={`shrink-0 z-20 border-b transition-colors duration-300 ${
          isDark
            ? 'bg-[#061124] border-blue-900/60 shadow-md'
            : 'bg-white/95 backdrop-blur-xs border-slate-200/90 shadow-2xs'
        }`}
      >
        <div className="max-w-4xl mx-auto px-3 sm:px-6 py-2">
          <SmartQuickQuestions
            onSelectQuestion={handleSendMessage}
            theme={theme}
          />
        </div>
      </div>

      {/* Main Chat Scroll Container - Messages appear BELOW the Quick Questions */}
      <main
        className={`flex-1 overflow-y-auto px-3 sm:px-6 py-3 sm:py-4 flex flex-col justify-between transition-colors duration-300 ${
          isDark ? 'bg-[#050e1f]' : 'bg-slate-50/60'
        }`}
      >
        <div className="max-w-4xl w-full mx-auto flex flex-col flex-1">
          {/* Messages Feed */}
          <div className="flex flex-col flex-1">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} theme={theme} />
            ))}

            {/* Typing Indicator with 3 animated dots */}
            {isLoading && <TypingIndicator theme={theme} />}

            <div ref={messagesEndRef} className="h-2" />
          </div>
        </div>
      </main>

      {/* Bottom Message Input Box with preserved Send Button */}
      <ChatInput
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        theme={theme}
      />

      {/* Verified School Information Modal */}
      <SchoolInfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        onAskQuestion={(query) => handleSendMessage(query)}
        theme={theme}
      />

      {/* Chat History Modal (Feature 3) */}
      <ChatHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        savedChats={savedChats}
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        onClearAllChats={handleClearAllChats}
        theme={theme}
      />
    </div>
  );
}
