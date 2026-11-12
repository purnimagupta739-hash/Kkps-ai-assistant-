import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Mic, MicOff, Globe2, AlertCircle } from 'lucide-react';
import { ThemeMode } from '../types.ts';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  theme?: ThemeMode;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  theme = 'light',
}) => {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechLang, setSpeechLang] = useState<'en-IN' | 'hi-IN'>('en-IN');
  const [speechError, setSpeechError] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);
  const baseTextRef = useRef<string>('');

  const isDark = theme === 'dark';

  // Check Web Speech Recognition support
  const isSpeechSupported =
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  // Auto-resize textarea height smoothly
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      // Cap at 120px max height
      textareaRef.current.style.height = `${Math.min(scrollHeight, 120)}px`;
    }
  }, [text]);

  // Clean up speech recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // Ignore
        }
      }
    };
  }, []);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isListening) {
      stopListening();
    }
    if (!text.trim() || isLoading) return;

    onSendMessage(text.trim());
    setText('');

    // Reset height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const setSuggestedText = (val: string) => {
    setText(val);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const startListening = () => {
    setSpeechError(null);

    if (!isSpeechSupported) {
      setSpeechError('Voice input is not supported in this browser. Please use Chrome on Android.');
      setTimeout(() => setSpeechError(null), 4500);
      return;
    }

    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = speechLang;

      baseTextRef.current = text.trim();

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError(null);
      };

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        const speechOutput = (finalTranscript || interimTranscript).trim();
        if (speechOutput) {
          const prefix = baseTextRef.current ? `${baseTextRef.current} ` : '';
          setText(`${prefix}${speechOutput}`);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition event:', event.error);
        if (event.error === 'not-allowed') {
          setSpeechError('Microphone permission was denied. Please allow microphone access in your browser settings.');
        } else if (event.error === 'no-speech') {
          // No speech detected, quietly continue or handle
        } else if (event.error !== 'aborted') {
          setSpeechError(`Voice input issue: ${event.error}. You can still type your question.`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.warn('Speech recognition start failed:', err);
      setIsListening(false);
      setSpeechError('Could not start voice recognition. Please try typing your question.');
      setTimeout(() => setSpeechError(null), 4000);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignore
      }
    }
    setIsListening(false);
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const switchLanguage = (lang: 'en-IN' | 'hi-IN') => {
    setSpeechLang(lang);
    if (isListening) {
      stopListening();
      setTimeout(() => {
        // Restart with new language
        const SpeechRecognition =
          (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
          const rec = new SpeechRecognition();
          rec.continuous = true;
          rec.interimResults = true;
          rec.lang = lang;
          baseTextRef.current = text.trim();
          rec.onstart = () => setIsListening(true);
          rec.onresult = (event: any) => {
            let output = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
              output += event.results[i][0].transcript;
            }
            if (output.trim()) {
              const prefix = baseTextRef.current ? `${baseTextRef.current} ` : '';
              setText(`${prefix}${output.trim()}`);
            }
          };
          rec.onerror = () => setIsListening(false);
          rec.onend = () => setIsListening(false);
          recognitionRef.current = rec;
          rec.start();
        }
      }, 200);
    }
  };

  return (
    <div
      className={`shrink-0 p-3 sm:p-4 shadow-lg transition-colors duration-300 border-t ${
        isDark
          ? 'bg-[#071329]/95 backdrop-blur-sm border-blue-900/60'
          : 'bg-white/95 backdrop-blur-sm border-slate-200/90'
      }`}
    >
      <div className="max-w-4xl mx-auto">
        {/* Active Recording Banner Indicator */}
        {isListening && (
          <div
            className={`flex items-center justify-between px-3 py-2 rounded-xl mb-2 text-xs transition-all border animate-welcome ${
              isDark
                ? 'bg-red-950/40 border-red-800 text-red-200'
                : 'bg-red-50 border-red-200 text-red-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse inline-block" />
              <div className="flex items-center gap-0.5">
                <span className="w-1 h-3 bg-red-500 rounded-full inline-block voice-wave-1" />
                <span className="w-1 h-4 bg-red-500 rounded-full inline-block voice-wave-2" />
                <span className="w-1 h-2 bg-red-500 rounded-full inline-block voice-wave-3" />
                <span className="w-1 h-3.5 bg-red-500 rounded-full inline-block voice-wave-4" />
              </div>
              <span className="font-semibold">
                Listening... Speak in {speechLang === 'en-IN' ? 'English or Hinglish' : 'हिंदी (Hindi)'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Language Switcher while listening */}
              <button
                type="button"
                onClick={() => switchLanguage(speechLang === 'en-IN' ? 'hi-IN' : 'en-IN')}
                className={`px-2 py-0.5 rounded-md font-bold text-[10.5px] border transition-colors flex items-center gap-1 ${
                  isDark
                    ? 'bg-red-900/60 border-red-700 text-white hover:bg-red-800'
                    : 'bg-white border-red-300 text-red-900 hover:bg-red-100'
                }`}
              >
                <Globe2 className="w-3 h-3" />
                <span>{speechLang === 'en-IN' ? 'Switch to Hindi' : 'Switch to EN/Hinglish'}</span>
              </button>

              <button
                type="button"
                onClick={stopListening}
                className="px-2.5 py-0.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-md text-[10.5px] transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        )}

        {/* Error notification if voice issue occurs */}
        {speechError && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl mb-2 text-xs bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
            <span className="flex-1">{speechError}</span>
            <button
              type="button"
              onClick={() => setSpeechError(null)}
              className="text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Quick Micro-chips for fast input */}
        <div className="flex items-center gap-1.5 mb-2 overflow-x-auto pb-1 text-[11px] no-scrollbar">
          <span
            className={`text-[10.5px] font-medium shrink-0 mr-1 ${
              isDark ? 'text-amber-300/80' : 'text-slate-400'
            }`}
          >
            Try:
          </span>
          <button
            type="button"
            onClick={() => setSuggestedText('What are the school timings?')}
            className={`px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap shrink-0 border ${
              isDark
                ? 'bg-[#0E224D] hover:bg-blue-900 text-slate-200 border-blue-800'
                : 'bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-900 border-slate-200/80'
            }`}
          >
            School timings?
          </button>
          <button
            type="button"
            onClick={() => setSuggestedText('स्कूल का पता क्या है?')}
            className={`px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap shrink-0 border ${
              isDark
                ? 'bg-[#0E224D] hover:bg-blue-900 text-slate-200 border-blue-800'
                : 'bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-900 border-slate-200/80'
            }`}
          >
            स्कूल का पता? (Hindi)
          </button>
          <button
            type="button"
            onClick={() => setSuggestedText('School kaun se board se affiliated hai?')}
            className={`px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap shrink-0 border ${
              isDark
                ? 'bg-[#0E224D] hover:bg-blue-900 text-slate-200 border-blue-800'
                : 'bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-900 border-slate-200/80'
            }`}
          >
            CBSE Board? (Hinglish)
          </button>

          {/* Quick Voice Language Switcher when not recording */}
          {!isListening && (
            <button
              type="button"
              onClick={() => setSpeechLang((prev) => (prev === 'en-IN' ? 'hi-IN' : 'en-IN'))}
              className={`ml-auto px-2 py-0.5 rounded-lg border text-[10px] font-bold transition-colors shrink-0 flex items-center gap-1 ${
                isDark
                  ? 'bg-blue-950/70 border-blue-800 text-amber-300 hover:bg-blue-900'
                  : 'bg-white border-slate-200 text-[#0B1B3D] hover:bg-blue-50'
              }`}
              title="Click to toggle speech recognition language"
            >
              <Globe2 className="w-3 h-3 text-amber-400" />
              <span>Voice: {speechLang === 'en-IN' ? 'EN / Hinglish' : 'हिंदी (Hindi)'}</span>
            </button>
          )}
        </div>

        {/* Input Form with Voice Input Microphone Button and EXACT Send Button */}
        <form onSubmit={handleSubmit} className="relative flex items-end gap-2">
          {/* Text Area Input */}
          <div
            className={`relative flex-1 rounded-2xl transition-all shadow-xs border ${
              isListening
                ? 'ring-2 ring-red-500/30 border-red-400'
                : isDark
                ? 'bg-[#0B1B3D] border-blue-800 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-400/20'
                : 'bg-slate-50 hover:bg-slate-100/70 focus-within:bg-white border-slate-300 focus-within:border-[#0B1B3D] focus-within:ring-2 focus-within:ring-[#0B1B3D]/10'
            }`}
          >
            <textarea
              ref={textareaRef}
              rows={1}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              placeholder={isListening ? 'Listening to your speech...' : 'Ask in English, Hindi, or Hinglish...'}
              className={`w-full bg-transparent px-4 py-3 text-sm focus:outline-hidden resize-none max-h-32 leading-relaxed ${
                isDark
                  ? 'text-white placeholder:text-slate-400'
                  : 'text-slate-900 placeholder:text-slate-400'
              }`}
              aria-label="Ask a question about Kanyakubja Public School"
            />

            {/* Clear button if text entered */}
            {text.length > 0 && !isListening && (
              <button
                type="button"
                onClick={() => setText('')}
                className={`absolute right-3 top-3 p-1 rounded-full transition-colors ${
                  isDark
                    ? 'text-slate-400 hover:text-white hover:bg-blue-900'
                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-200'
                }`}
                title="Clear input"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Microphone Voice Input Button */}
          <button
            type="button"
            onClick={toggleListening}
            disabled={isLoading}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all border shadow-xs active:scale-95 ${
              isListening
                ? 'bg-red-600 text-white border-red-500 animate-mic-pulse shadow-red-500/30'
                : isDark
                ? 'bg-[#0E224D] hover:bg-[#152e68] border-amber-400/30 text-amber-300 hover:border-amber-400'
                : 'bg-white hover:bg-blue-50 border-slate-300 text-[#0B1B3D] hover:border-blue-400'
            }`}
            title={
              isListening
                ? 'Stop recording'
                : `Click to speak (${speechLang === 'en-IN' ? 'English / Hinglish' : 'Hindi'})`
            }
            aria-label={isListening ? 'Stop recording' : 'Speak question'}
          >
            {isListening ? (
              <MicOff className="w-5 h-5 text-white" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </button>

          {/* Send Button: Exactly as required with no modification to colour, shape, size, position or functionality */}
          <button
            type="submit"
            disabled={!text.trim() || isLoading}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all shadow-sm ${
              !text.trim() || isLoading
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-[#0B1B3D] hover:bg-[#1E3A8A] active:scale-95 text-white shadow-blue-900/20'
            }`}
            title="Send message"
            aria-label="Send message"
          >
            <Send className="w-5 h-5 ml-0.5" />
          </button>
        </form>

        {/* Quiet disclaimer */}
        <div
          className={`flex items-center justify-between mt-1.5 px-1 text-[10.5px] ${
            isDark ? 'text-slate-400' : 'text-slate-400'
          }`}
        >
          <span>KKPS AI Assistant · Kanyakubja Public School</span>
          <span>Voice & Text Supported · CBSE Kanpur</span>
        </div>
      </div>
    </div>
  );
};
