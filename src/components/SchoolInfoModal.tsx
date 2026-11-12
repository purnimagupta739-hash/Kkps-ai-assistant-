import React from 'react';
import { X, MapPin, Clock, Award, ShieldCheck, ExternalLink, School, Phone, UserCheck, CalendarDays } from 'lucide-react';
import { ThemeMode } from '../types.ts';

interface SchoolInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAskQuestion: (query: string) => void;
  theme?: ThemeMode;
}

export const SchoolInfoModal: React.FC<SchoolInfoModalProps> = ({
  isOpen,
  onClose,
  onAskQuestion,
  theme = 'light',
}) => {
  if (!isOpen) return null;

  const isDark = theme === 'dark';

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    'Kanyakubja Public School, 91, Cantt. The Mall, Kanpur, Uttar Pradesh 208001'
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
      {/* Modal Dialog */}
      <div
        className={`w-full max-w-lg rounded-3xl shadow-2xl border overflow-hidden flex flex-col max-h-[90vh] transition-colors ${
          isDark
            ? 'bg-[#0A1838] border-amber-400/30 text-white'
            : 'bg-white border-slate-200 text-slate-800'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header with Navy Branding and Golden Glow Crest */}
        <div
          className={`p-4 sm:p-5 flex items-start justify-between relative border-b ${
            isDark
              ? 'bg-[#071329] border-blue-900/60 text-white'
              : 'bg-[#0B1B3D] border-blue-950 text-white'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-amber-400 golden-glow flex items-center justify-center shrink-0">
              <School className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                Official Information
              </span>
              <h2 id="modal-title" className="text-base sm:text-lg font-bold tracking-tight text-white">
                Kanyakubja Public School
              </h2>
              <p className="text-xs text-blue-200">कान्यकुब्ज पब्लिक स्कूल, कानपुर</p>
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

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5">
          {/* Card 1: Location & Address */}
          <div
            className={`p-4 rounded-2xl border flex flex-col gap-2 ${
              isDark
                ? 'bg-[#0E224D]/60 border-blue-900/50'
                : 'bg-slate-50 border-slate-200/90'
            }`}
          >
            <div className="flex items-center gap-2 text-xs font-bold">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
              <span className={isDark ? 'text-amber-300' : 'text-[#0B1B3D]'}>Campus Location</span>
            </div>
            <p className={`text-sm font-medium leading-snug ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
              91, Cantt. The Mall, Kanpur, Uttar Pradesh 208001
            </p>
            <div className="pt-1 flex items-center gap-2">
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors shadow-2xs ${
                  isDark
                    ? 'bg-[#071329] text-amber-300 border-amber-400/40 hover:bg-blue-900/60'
                    : 'bg-white text-blue-700 hover:text-blue-900 border-slate-200 hover:border-blue-300'
                }`}
              >
                <span>View on Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Card 2: Timings */}
          <div
            className={`p-4 rounded-2xl border flex flex-col gap-2.5 ${
              isDark
                ? 'bg-[#0E224D]/60 border-blue-900/50'
                : 'bg-slate-50 border-slate-200/90'
            }`}
          >
            <div className="flex items-center gap-2 text-xs font-bold">
              <Clock className="w-4 h-4 text-amber-500 shrink-0" />
              <span className={isDark ? 'text-amber-300' : 'text-[#0B1B3D]'}>School Timings</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div
                className={`p-3 rounded-xl border ${
                  isDark
                    ? 'bg-[#071329] border-blue-900/80 text-white'
                    : 'bg-white border-slate-200 text-slate-900 shadow-2xs'
                }`}
              >
                <span className="text-[11px] font-semibold text-amber-500 block mb-0.5">
                  Summer Timings
                </span>
                <span className="text-sm font-bold">8:00 AM – 2:00 PM</span>
              </div>
              <div
                className={`p-3 rounded-xl border ${
                  isDark
                    ? 'bg-[#071329] border-blue-900/80 text-white'
                    : 'bg-white border-slate-200 text-slate-900 shadow-2xs'
                }`}
              >
                <span className="text-[11px] font-semibold text-blue-400 block mb-0.5">
                  Winter Timings
                </span>
                <span className="text-sm font-bold">8:30 AM – 2:30 PM</span>
              </div>
            </div>
          </div>

          {/* Card 3: Principal */}
          <div
            className={`p-4 rounded-2xl border flex items-center justify-between ${
              isDark
                ? 'bg-[#0E224D]/60 border-blue-900/50'
                : 'bg-slate-50 border-slate-200/90'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
                <UserCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs text-slate-400 block">School Principal</span>
                <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Miss Pooja Sehgal
                </span>
              </div>
            </div>
            <span className="px-2.5 py-1 text-[11px] font-bold text-amber-400 bg-amber-500/10 rounded-full border border-amber-500/30">
              Principal
            </span>
          </div>

          {/* Card 4: Affiliation */}
          <div
            className={`p-4 rounded-2xl border flex items-center justify-between ${
              isDark
                ? 'bg-[#0E224D]/60 border-blue-900/50'
                : 'bg-slate-50 border-slate-200/90'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Board Affiliation</span>
                <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  CBSE (Central Board)
                </span>
              </div>
            </div>
            <span className="px-2.5 py-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 rounded-full border border-emerald-500/30">
              Verified
            </span>
          </div>

          {/* Card 4: Official Contact Numbers */}
          <div
            className={`p-4 rounded-2xl border flex flex-col gap-2.5 ${
              isDark
                ? 'bg-[#0E224D]/60 border-blue-900/50'
                : 'bg-slate-50 border-slate-200/90'
            }`}
          >
            <div className="flex items-center gap-2 text-xs font-bold">
              <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
              <span className={isDark ? 'text-amber-300' : 'text-[#0B1B3D]'}>
                Official School Contacts
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <a
                href="tel:05122330410"
                className={`flex items-center justify-between p-3 rounded-xl border transition-all card-hover-gold ${
                  isDark
                    ? 'bg-[#071329] border-blue-900/80 hover:border-amber-400/50 text-white'
                    : 'bg-white border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 text-slate-900 shadow-2xs'
                }`}
              >
                <div>
                  <span className="text-[11px] text-slate-400 block">School Office</span>
                  <span className="text-sm font-bold font-mono">0512-2330410</span>
                </div>
                <span className="text-[10.5px] font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-md border border-emerald-500/30">
                  Call
                </span>
              </a>
              <a
                href="tel:9473957947"
                className={`flex items-center justify-between p-3 rounded-xl border transition-all card-hover-gold ${
                  isDark
                    ? 'bg-[#071329] border-blue-900/80 hover:border-amber-400/50 text-white'
                    : 'bg-white border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 text-slate-900 shadow-2xs'
                }`}
              >
                <div>
                  <span className="text-[11px] text-slate-400 block">Handbook Mobile</span>
                  <span className="text-sm font-bold font-mono">9473957947</span>
                </div>
                <span className="text-[10.5px] font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-md border border-emerald-500/30">
                  Call
                </span>
              </a>
            </div>
          </div>

          {/* Card 5: Festivals & Holidays */}
          <div
            className={`p-4 rounded-2xl border flex flex-col gap-2.5 ${
              isDark
                ? 'bg-[#0E224D]/60 border-blue-900/50'
                : 'bg-slate-50 border-slate-200/90'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold">
                <CalendarDays className="w-4 h-4 text-amber-500 shrink-0" />
                <span className={isDark ? 'text-amber-300' : 'text-[#0B1B3D]'}>
                  Festivals & School Holidays
                </span>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-400 border border-amber-400/30">
                Official Calendar
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-300 leading-relaxed">
              Ask about Diwali, Holi, Eid, Christmas, Independence Day, Republic Day, Gandhi Jayanti, Teachers' Day, Children's Day, or today/tomorrow's holiday status.
            </p>
            <div className="flex items-center gap-2 pt-1 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onAskQuestion('School holidays list batao');
                }}
                className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all ${
                  isDark
                    ? 'bg-[#071329] text-amber-300 border-amber-400/30 hover:bg-blue-900'
                    : 'bg-white text-blue-800 border-slate-200 hover:bg-blue-50'
                }`}
              >
                📅 View Holiday List
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onAskQuestion('School ki next chhutti kab hai?');
                }}
                className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all ${
                  isDark
                    ? 'bg-[#071329] text-amber-300 border-amber-400/30 hover:bg-blue-900'
                    : 'bg-white text-blue-800 border-slate-200 hover:bg-blue-50'
                }`}
              >
                🔔 Next Upcoming Holiday
              </button>
            </div>
          </div>

          {/* Official Verification Notice */}
          <div
            className={`p-4 rounded-2xl border flex items-start gap-3 ${
              isDark
                ? 'bg-blue-950/40 border-blue-900/60 text-blue-200'
                : 'bg-blue-50/70 border-blue-200 text-blue-900'
            }`}
          >
            <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              <span className="font-bold block mb-1">Office Confirmation Policy:</span>
              <span>
                Fees, admission dates, examination results, and official policies are not published in KKPS AI Assistant. Please contact the school office directly for confirmation.
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div
          className={`p-4 border-t flex items-center justify-between gap-3 ${
            isDark ? 'bg-[#071329] border-blue-900/60' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <button
            type="button"
            onClick={() => {
              onClose();
              onAskQuestion('What are the school timings for summer and winter?');
            }}
            className={`text-xs font-bold underline px-1 ${
              isDark ? 'text-amber-300 hover:text-amber-200' : 'text-blue-800 hover:text-blue-950'
            }`}
          >
            Ask about timings
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-[#0B1B3D] hover:bg-blue-900 text-white rounded-xl text-xs font-bold transition-all border border-amber-400/40 shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
