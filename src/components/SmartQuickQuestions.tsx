import React from 'react';
import {
  GraduationCap,
  Clock,
  Banknote,
  FileCheck2,
  BookOpenCheck,
  PhoneCall,
  Sparkles,
  CalendarDays,
  UserCheck,
} from 'lucide-react';
import { ThemeMode } from '../types.ts';

interface SmartQuickQuestionsProps {
  onSelectQuestion: (question: string) => void;
  theme: ThemeMode;
}

export interface QuestionCardItem {
  id: string;
  category: string;
  question: string;
  shortTeaser: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeText: string;
}

export const SMART_QUESTIONS: QuestionCardItem[] = [
  {
    id: 'holidays',
    category: 'Holidays & Festivals',
    question: 'School ki next chhutti kab hai aur holidays list batao',
    shortTeaser: 'Next holiday & annual calendar',
    icon: CalendarDays,
    badgeText: 'Holidays',
  },
  {
    id: 'principal',
    category: 'School Principal',
    question: 'Who is the Principal of Kanyakubja Public School?',
    shortTeaser: 'Miss Pooja Sehgal',
    icon: UserCheck,
    badgeText: 'Principal',
  },
  {
    id: 'timings',
    category: 'School Timings',
    question: 'What are the school timings for summer and winter?',
    shortTeaser: 'Summer & Winter hours',
    icon: Clock,
    badgeText: 'Timings',
  },
  {
    id: 'admissions',
    category: 'Admissions',
    question: 'School mein admission kab start hote hain aur process kya hai?',
    shortTeaser: 'Admission dates & procedure',
    icon: GraduationCap,
    badgeText: 'New Session',
  },
  {
    id: 'fees',
    category: 'Fee Details',
    question: 'What is the fee structure for students?',
    shortTeaser: 'Fee structure & office confirmation',
    icon: Banknote,
    badgeText: 'Fees',
  },
  {
    id: 'exams',
    category: 'Exams & Results',
    question: 'School exams aur CBSE board results kab aayenge?',
    shortTeaser: 'CBSE exams & session schedules',
    icon: FileCheck2,
    badgeText: 'CBSE',
  },
  {
    id: 'rules',
    category: 'School Rules',
    question: 'School uniform aur discipline rules kya hain?',
    shortTeaser: 'Uniform, attendance & rules',
    icon: BookOpenCheck,
    badgeText: 'Rules',
  },
  {
    id: 'contact',
    category: 'Contact Office',
    question: 'School office ka contact number aur campus address kya hai?',
    shortTeaser: '0512-2330410 · 9473957947',
    icon: PhoneCall,
    badgeText: 'Helpline',
  },
];

export const SmartQuickQuestions: React.FC<SmartQuickQuestionsProps> = ({
  onSelectQuestion,
  theme,
}) => {
  const isDark = theme === 'dark';

  return (
    <div className="w-full">
      {/* Compact Header Label */}
      <div className="flex items-center justify-between mb-1.5 px-0.5">
        <div className="flex items-center gap-1.5 text-[11px] font-bold">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className={isDark ? 'text-amber-300' : 'text-[#0B1B3D]'}>
            Smart Quick Questions
          </span>
          <span className="text-[10px] font-normal text-slate-400">
            · Tap to ask instantly:
          </span>
        </div>
        <span
          className={`text-[9.5px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider shrink-0 ${
            isDark ? 'bg-amber-400/15 text-amber-300 border border-amber-400/30' : 'bg-blue-50 text-blue-900 border border-blue-200'
          }`}
        >
          Quick Topics
        </span>
      </div>

      {/* Compact Horizontal Swipeable Card Strip (Does not eat up screen height) */}
      <div className="flex items-stretch gap-2 overflow-x-auto pb-1 pt-0.5 no-scrollbar scroll-smooth -mx-1 px-1">
        {SMART_QUESTIONS.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectQuestion(item.question)}
              className={`p-2 sm:p-2.5 rounded-xl text-left border transition-all active:scale-95 group shrink-0 flex items-center gap-2.5 min-w-[210px] sm:min-w-[230px] max-w-[250px] shadow-xs cursor-pointer ${
                isDark
                  ? 'bg-[#0E224D]/90 hover:bg-[#132d66] border-amber-400/25 hover:border-amber-400/60 text-slate-100'
                  : 'bg-white hover:bg-blue-50/80 border-slate-200/90 hover:border-amber-400/60 text-slate-800'
              }`}
              title={`Ask: "${item.question}"`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border transition-transform group-hover:scale-105 ${
                  isDark
                    ? 'bg-[#071329] border-amber-400/30 text-amber-300'
                    : 'bg-blue-50 border-blue-200 text-[#0B1B3D]'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <span
                    className={`text-xs font-bold truncate ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {item.category}
                  </span>
                  <span
                    className={`text-[9px] font-semibold px-1.5 py-0.2 rounded shrink-0 ${
                      isDark ? 'text-amber-300 bg-amber-400/10' : 'text-amber-800 bg-amber-100/70'
                    }`}
                  >
                    {item.badgeText}
                  </span>
                </div>
                <p
                  className={`text-[11px] font-medium leading-tight truncate ${
                    isDark
                      ? 'text-slate-300 group-hover:text-amber-200'
                      : 'text-slate-500 group-hover:text-[#0B1B3D]'
                  }`}
                >
                  {item.shortTeaser}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
