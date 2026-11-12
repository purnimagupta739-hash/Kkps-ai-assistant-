import React, { useState, useEffect, useRef } from 'react';
import { School, User, Copy, Check, Volume2, VolumeX, AlertCircle, Pause, Play } from 'lucide-react';
import { Message, ThemeMode } from '../types.ts';

interface ChatMessageProps {
  message: Message;
  theme: ThemeMode;
}

type SpeechState = 'idle' | 'playing' | 'paused';

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, theme }) => {
  const [copied, setCopied] = useState(false);
  const [speechState, setSpeechState] = useState<SpeechState>('idle');
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const isUser = message.sender === 'user';
  const isDark = theme === 'dark';

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (utteranceRef.current) {
        window.speechSynthesis?.cancel();
      }
    };
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  // Prepare sanitized text for natural speech synthesis (remove bullets, markdown asterisks)
  const getSpeakableText = (raw: string): string => {
    return raw
      .replace(/•/g, ', ')
      .replace(/\*/g, '')
      .replace(/·/g, ', ')
      .replace(/–/g, ' to ')
      .replace(/\n+/g, '. ')
      .trim();
  };

  const handlePlay = () => {
    if (!('speechSynthesis' in window)) return;

    // If currently paused, resume smoothly
    if (speechState === 'paused') {
      window.speechSynthesis.resume();
      setSpeechState('playing');
      return;
    }

    // Cancel any previous speaking
    window.speechSynthesis.cancel();

    const cleanText = getSpeakableText(message.text);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utteranceRef.current = utterance;

    const voices = window.speechSynthesis.getVoices();
    const isDevanagari = /[\u0900-\u097F]/.test(message.text);
    const hasHinglish = /\b(hai|hain|kya|kab|kahan|kaise|batao|bataiye|school|mein|aap|pooch|sakte|abhi|confirm|nahi|bhi|kar|rahe)\b/i.test(message.text);

    if (isDevanagari) {
      // Devanagari Hindi
      const hiVoice = voices.find((v) => v.lang.startsWith('hi'));
      if (hiVoice) utterance.voice = hiVoice;
      utterance.lang = 'hi-IN';
      utterance.rate = 0.92;
    } else if (hasHinglish) {
      // Hinglish (Roman script Hindi)
      // Indian English voice pronounces Romanized Indian words and school names naturally
      const inVoice =
        voices.find((v) => v.lang === 'en-IN' && !v.name.includes('Google')) ||
        voices.find((v) => v.lang === 'en-IN') ||
        voices.find((v) => v.lang.startsWith('en'));
      if (inVoice) utterance.voice = inVoice;
      utterance.lang = 'en-IN';
      utterance.rate = 0.9;
    } else {
      // Standard English
      const enVoice =
        voices.find((v) => v.lang === 'en-IN') ||
        voices.find((v) => v.lang.startsWith('en'));
      if (enVoice) utterance.voice = enVoice;
      utterance.lang = 'en-IN';
      utterance.rate = 0.94;
    }

    utterance.pitch = 1.0;

    utterance.onend = () => {
      setSpeechState('idle');
      utteranceRef.current = null;
    };

    utterance.onerror = () => {
      setSpeechState('idle');
      utteranceRef.current = null;
    };

    setSpeechState('playing');
    window.speechSynthesis.speak(utterance);
  };

  const handlePause = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.pause();
    setSpeechState('paused');
  };

  const handleStop = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    setSpeechState('idle');
    utteranceRef.current = null;
  };

  return (
    <div
      className={`flex items-start gap-2.5 my-3 animate-message-slide ${
        isUser
          ? 'flex-row-reverse self-end max-w-[85%] sm:max-w-[75%]'
          : 'self-start max-w-[92%] sm:max-w-[80%]'
      }`}
    >
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-xs transition-all ${
          isUser
            ? isDark
              ? 'bg-[#1E3A8A] text-amber-200 border border-blue-700'
              : 'bg-slate-200 text-slate-700'
            : isDark
            ? 'bg-[#0B1B3D] text-amber-300 border border-amber-400 golden-glow'
            : 'bg-[#0B1B3D] text-amber-300 border border-amber-400/60 golden-glow shadow-sm'
        }`}
        aria-hidden="true"
      >
        {isUser ? <User className="w-4 h-4" /> : <School className="w-4 h-4" />}
      </div>

      {/* Message Bubble Container */}
      <div className="flex flex-col gap-1 min-w-[120px]">
        {/* Sender Name & Meta */}
        <div
          className={`flex items-center gap-2 text-[11px] px-1 ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          } ${isUser ? 'justify-end' : 'justify-start'}`}
        >
          <span
            className={`font-semibold ${
              isDark ? (isUser ? 'text-blue-300' : 'text-amber-300') : 'text-slate-700'
            }`}
          >
            {isUser ? 'You' : 'KKPS Assistant'}
          </span>
          <span>·</span>
          <span>{message.timestamp}</span>
        </div>

        {/* Bubble */}
        <div
          className={`relative px-4 py-3 rounded-2xl text-[14.5px] leading-relaxed break-words shadow-xs transition-all ${
            isUser
              ? isDark
                ? 'bg-[#1E3A8A] text-white border border-blue-600/40 rounded-tr-xs'
                : 'bg-[#0B1B3D] text-white rounded-tr-xs'
              : message.isError
              ? isDark
                ? 'bg-rose-950/60 text-rose-200 border border-rose-800 rounded-tl-xs'
                : 'bg-rose-50 text-rose-900 border border-rose-200 rounded-tl-xs'
              : isDark
              ? 'bg-[#0E224D] text-slate-100 border border-amber-400/25 rounded-tl-xs shadow-md'
              : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-xs'
          }`}
        >
          {message.isError && (
            <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-medium mb-1 text-xs">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Connection Error</span>
            </div>
          )}

          <div className="whitespace-pre-wrap">{message.text}</div>

          {/* Action Row for Assistant Bubble */}
          {!isUser && (
            <div
              className={`flex items-center justify-between pt-2.5 mt-2 border-t text-xs transition-colors ${
                isDark ? 'border-blue-900/50 text-slate-400' : 'border-slate-100 text-slate-400'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span
                  className={`text-[10.5px] font-medium ${
                    isDark ? 'text-amber-300/80' : 'text-slate-500'
                  }`}
                >
                  Kanyakubja Public School
                </span>
                {speechState === 'playing' && (
                  <span className="flex items-center gap-0.5 text-amber-400 text-[10px] font-semibold animate-pulse">
                    <span className="w-1 h-3 bg-amber-400 rounded-full inline-block voice-wave-1" />
                    <span className="w-1 h-4 bg-amber-400 rounded-full inline-block voice-wave-2" />
                    <span className="w-1 h-2 bg-amber-400 rounded-full inline-block voice-wave-3" />
                  </span>
                )}
              </div>

              {/* Voice & Copy Controls */}
              <div className="flex items-center gap-1">
                {/* Voice Speaker Button with Pause & Stop */}
                {speechState === 'idle' ? (
                  <button
                    type="button"
                    onClick={handlePlay}
                    title="Listen to AI answer"
                    className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                      isDark
                        ? 'hover:text-amber-300 hover:bg-blue-900/60'
                        : 'hover:text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-[10.5px] font-medium">Listen</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-0.5 bg-amber-400/10 dark:bg-amber-400/20 px-1 py-0.5 rounded-lg border border-amber-400/30">
                    {speechState === 'playing' ? (
                      <button
                        type="button"
                        onClick={handlePause}
                        title="Pause speech"
                        className="p-1 hover:text-amber-500 rounded transition-colors"
                      >
                        <Pause className="w-3 h-3 text-amber-500" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handlePlay}
                        title="Resume speech"
                        className="p-1 hover:text-emerald-500 rounded transition-colors"
                      >
                        <Play className="w-3 h-3 text-emerald-500" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleStop}
                      title="Stop audio"
                      className="p-1 hover:text-rose-500 rounded transition-colors"
                    >
                      <VolumeX className="w-3 h-3 text-rose-500" />
                    </button>
                  </div>
                )}

                {/* Copy Button */}
                <button
                  type="button"
                  onClick={handleCopy}
                  title="Copy text"
                  className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                    isDark
                      ? 'hover:text-amber-300 hover:bg-blue-900/60'
                      : 'hover:text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-[10px] text-emerald-500 font-medium">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span className="text-[10px]">Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
