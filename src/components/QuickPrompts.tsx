import React, { useState } from 'react';
import { Sparkles, Clock, MapPin, Award, HelpCircle, School } from 'lucide-react';
import { ThemeMode } from '../types.ts';

interface QuickPromptsProps {
  onSelectPrompt: (text: string) => void;
  theme: ThemeMode;
}

const PROMPT_TABS = [
  { id: 'all', label: 'All Questions' },
  { id: 'en', label: 'English' },
  { id: 'hi', label: 'हिंदी (Hindi)' },
  { id: 'hinglish', label: 'Hinglish' },
] as const;

const QUESTIONS = [
  {
    icon: Clock,
    text: 'What are the school timings for summer and winter?',
    lang: 'en',
    category: 'Timings',
  },
  {
    icon: MapPin,
    text: 'Where is Kanyakubja Public School located?',
    lang: 'en',
    category: 'Location',
  },
  {
    icon: Award,
    text: 'Which board is Kanyakubja Public School affiliated with?',
    lang: 'en',
    category: 'Affiliation',
  },
  {
    icon: Clock,
    text: 'स्कूल का समय क्या है? (गर्मी और सर्दी की टाइमिंग)',
    lang: 'hi',
    category: 'समय',
  },
  {
    icon: MapPin,
    text: 'कान्यकुब्ज पब्लिक स्कूल का पता क्या है?',
    lang: 'hi',
    category: 'स्थान',
  },
  {
    icon: Award,
    text: 'स्कूल कौन से बोर्ड से मान्यता प्राप्त है?',
    lang: 'hi',
    category: 'मान्यता',
  },
  {
    icon: Clock,
    text: 'School ki summer aur winter timing kya hai?',
    lang: 'hinglish',
    category: 'Timings',
  },
  {
    icon: MapPin,
    text: 'School Kanpur me kahan par hai?',
    lang: 'hinglish',
    category: 'Address',
  },
  {
    icon: HelpCircle,
    text: 'School me admission kab start honge?',
    lang: 'hinglish',
    category: 'Admissions',
  },
  {
    icon: HelpCircle,
    text: 'What is the fee structure for students?',
    lang: 'en',
    category: 'Fees',
  },
];

export const QuickPrompts: React.FC<QuickPromptsProps> = ({ onSelectPrompt, theme }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'en' | 'hi' | 'hinglish'>('all');
  const isDark = theme === 'dark';

  const filtered = activeTab === 'all' ? QUESTIONS : QUESTIONS.filter((q) => q.lang === activeTab);

  return (
    <div className="w-full my-auto py-4 px-2 animate-welcome">
      <div
        className={`rounded-3xl border p-5 sm:p-6 shadow-sm max-w-xl mx-auto transition-colors ${
          isDark
            ? 'bg-[#0E224D]/90 border-amber-400/25 text-slate-100 shadow-xl'
            : 'bg-white border-slate-200/90 text-slate-800 shadow-xs'
        }`}
      >
        {/* Card Header with Golden Glow School Logo */}
        <div className="text-center mb-4">
          <div className="w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center border golden-glow bg-gradient-to-br from-[#0B1B3D] to-[#051024] border-amber-400/60 shadow-md">
            <School className="w-6 h-6 text-amber-300" />
          </div>

          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-2 border ${
              isDark
                ? 'bg-amber-400/15 text-amber-300 border-amber-400/30'
                : 'bg-blue-50 text-[#0B1B3D] border-blue-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Welcome to KKPS AI Assistant</span>
          </div>

          <h2
            className={`text-lg sm:text-xl font-bold tracking-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            How can I help you today?
          </h2>
          <p
            className={`text-xs mt-1 max-w-sm mx-auto leading-relaxed ${
              isDark ? 'text-slate-300' : 'text-slate-500'
            }`}
          >
            Ask about school timings, CBSE affiliation, campus address. Answers are in English or simple Hinglish (using English letters).
          </p>
        </div>

        {/* Language Filter Tabs */}
        <div
          className={`flex items-center justify-center gap-1 p-1 rounded-xl mb-4 overflow-x-auto ${
            isDark ? 'bg-[#071329] border border-blue-900/60' : 'bg-slate-100'
          }`}
        >
          {PROMPT_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 min-h-[32px] ${
                activeTab === tab.id
                  ? isDark
                    ? 'bg-[#152e68] text-amber-300 shadow-xs border border-amber-400/40'
                    : 'bg-white text-[#0B1B3D] shadow-xs'
                  : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Question Chips Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {filtered.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <button
                key={index}
                type="button"
                onClick={() => onSelectPrompt(item.text)}
                className={`flex items-start gap-2.5 p-3 text-left rounded-xl border transition-all text-xs active:scale-[0.98] group card-hover-gold ${
                  isDark
                    ? 'bg-[#0A1838] hover:bg-[#122858] border-blue-900/50 hover:border-amber-400/50 text-slate-200 hover:text-white'
                    : 'bg-slate-50/80 hover:bg-blue-50/70 border-slate-200 hover:border-amber-400/50 text-slate-700 hover:text-[#0B1B3D]'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 transition-colors mt-0.5 ${
                    isDark
                      ? 'bg-[#071329] border-blue-800 text-amber-300 group-hover:border-amber-400'
                      : 'bg-white border-slate-200 text-slate-500 group-hover:text-[#0B1B3D] group-hover:border-amber-300'
                  }`}
                >
                  <IconComponent className="w-3.5 h-3.5" />
                </div>
                <span className="leading-snug font-medium flex-1">{item.text}</span>
              </button>
            );
          })}
        </div>

        {/* School Note */}
        <div
          className={`mt-4 pt-3 border-t text-center ${
            isDark ? 'border-blue-900/50 text-slate-400' : 'border-slate-100 text-slate-400'
          }`}
        >
          <p className="text-[11px]">
            For unconfirmed policies or admissions, please verify directly with the school office.
          </p>
        </div>
      </div>
    </div>
  );
};
