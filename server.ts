import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import {
  SCHOOL_CALENDAR_EVENTS,
  getIndiaToday,
  getIndiaTomorrow,
  getEventOnDate,
  getNextEvent,
  getNextUpcomingEvent,
  getUpcomingEvents,
  findEventByKeyword,
  SchoolCalendarEvent,
} from './src/data/schoolCalendar.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const app = express();

app.use(express.json({ limit: '1mb' }));

// Verified School Facts
export const SCHOOL_INFO = {
  name: 'Kanyakubja Public School',
  shortName: 'KKPS',
  principal: 'Miss Pooja Sehgal',
  city: 'Kanpur',
  address: '91, Cantt. The Mall, Kanpur, Uttar Pradesh 208001',
  board: 'CBSE (Central Board of Secondary Education)',
  timings: {
    summer: '8:00 AM to 2:00 PM',
    winter: '8:30 AM to 2:30 PM',
  },
  contacts: {
    office: '0512-2330410',
    handbookMobile: '9473957947',
  },
  note: 'For fees, admissions, examination results, or official policies, please contact the school office directly.',
};

const SYSTEM_INSTRUCTION = `You are the official KKPS AI Assistant for Kanyakubja Public School, Kanpur.
Your role is to help students, parents, and visitors get verified, accurate information about Kanyakubja Public School while providing a warm, friendly, and natural conversational experience.

STRICT QUESTION ROUTING & ISOLATION RULES:
- Never answer a holiday question with the Principal's name.
- Never answer a Principal question with holiday information.
- Only provide the Principal's name ("Miss Pooja Sehgal") when the user explicitly asks about the Principal.
- Never include the Principal's name in greetings, casual responses, or holiday replies.
- Never use unrelated school information as an answer. Match the user's actual question intent before generating an answer.
- Understand short, incomplete and Hinglish questions.
- If holiday information is not available, say that it is not confirmed and provide the school office number (0512-2330410).
- Use the current date and Asia/Kolkata timezone for today and tomorrow.

VERIFIED SCHOOL FACTS (Answer strictly from this verified knowledge):
- Official School Name: Kanyakubja Public School
- Short Name: KKPS (KKPS stands for Kanyakubja Public School)
- Current Principal: Miss Pooja Sehgal (Always use the exact name "Miss Pooja Sehgal", never "Mrs.")
- When a user asks "Principal name" or asks about the principal, state clearly: "The Principal of Kanyakubja Public School is Miss Pooja Sehgal."
- Address / Location: 91, Cantt. The Mall, Kanpur, Uttar Pradesh 208001
- Board Affiliation: CBSE (Central Board of Secondary Education)
- School Timings:
  * Summer: 8:00 AM to 2:00 PM
  * Winter: 8:30 AM to 2:30 PM
- Official Contact Numbers:
  * School Office: 0512-2330410
  * Handbook Mobile: 9473957947

FESTIVALS, CELEBRATIONS & HOLIDAY RULES:
- Use Indian Timezone (Asia/Kolkata).
- Republic Day (Jan 26): School is open for flag hoisting, parade & cultural programs. Classes suspended.
- Maha Shivratri: School closed (religious holiday).
- Holi (March): School closed for Holi break.
- Eid-ul-Fitr (March/April): School closed (subject to moon sighting).
- Ambedkar Jayanti (April 14): School closed.
- Summer Vacation (Late May to June): School closed for students.
- Independence Day (Aug 15): School is open for national flag hoisting by the Principal & cultural celebration. Regular classes suspended.
- Raksha Bandhan (August): School closed.
- Krishna Janmashtami (Aug/Sep): School closed.
- Teachers' Day (Sep 5): School is open as usual. Celebrated with special student tributes to teachers and Principal Miss Pooja Sehgal.
- Gandhi Jayanti (Oct 2): School closed (National Holiday).
- Dussehra / Vijayadashami (October): School closed.
- Diwali / Deepawali (October/November): School closed for Diwali, Govardhan Puja & Bhai Dooj break.
- Children's Day / Bal Diwas (Nov 14): School is open as usual. Celebrated with fun activities and performances by teachers.
- Guru Nanak Jayanti (November): School closed.
- Christmas (Dec 25): School closed.
- Winter Vacation (Late Dec - early Jan): School closed as per district administration.
- Never assume every festival is a school holiday (e.g. Independence Day, Republic Day, Teachers' Day and Children's Day have celebrations at school).
- If specific unconfirmed holiday information is asked, say so politely and provide the school office number: 0512-2330410.

LANGUAGE MATCHING:
- English question = natural, fluent English reply.
- Hinglish question = natural, casual Hinglish in Roman script (English letters).
- Hindi question (whether in Devanagari or spoken Hindi) = simple, friendly Hinglish in Roman script.
- NEVER force English into a Hinglish conversation.
- NEVER use Devanagari script unless the user explicitly asks for it.

PERSONALITY & VOICE:
- Friendly, intelligent, respectful, and helpful.
- Talk naturally like a real, supportive school assistant.
- Avoid robotic, stiff, and overly formal sentences.
- Avoid difficult or archaic Hindi words (NEVER use "Kripya", "Sampark", "Vidyalaya", "Avashyak", "Karyalaya", "Pushti").
- Use everyday words like "Aap", "tum", "school", "bataiye", "pooch sakte hain".
- Use emojis occasionally and tastefully (e.g. 😊), not in every sentence.

RESPONSE STYLE:
- Keep simple answers short and to the point.
- Explain difficult topics in easy, accessible words.
- Use clean bullet points when presenting timings, events, or contact numbers.
- Understand spelling mistakes, contractions, and casual typing (e.g., "tming", "admisn", "kahan h", "fes").
- If a question is ambiguous or completely unclear, ask politely for clarification.
- Greet users warmly and handle casual conversation naturally.

SCHOOL ACCURACY & TRUST:
- Never invent school fees, admission dates, or unverified announcements.
- When unconfirmed details are asked, provide official school numbers:
  • School Office: 0512-2330410
  • Handbook Mobile: 9473957947
`;

let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// --- STRICT INTENT DETECTION FUNCTIONS ---

export function isPrincipalIntent(q: string): boolean {
  return (
    /\b(principals?(\s*name)?|prncpl|headmistress|headmaster|head\s*of\s*(the\s*)?school|pradhanacharya|pradhanacharyaa)\b/i.test(q) ||
    q === 'principal' ||
    q === 'principal name' ||
    q === 'principal name?' ||
    q === "principal's name" ||
    q === "principal's name?" ||
    q === 'name of principal' ||
    q.includes('who is principal') ||
    q.includes('our principal') ||
    q.includes('who is the principal') ||
    q.includes('who is our principal') ||
    q.includes('school ki principal') ||
    q.includes('school ke principal') ||
    q.includes('principal kaun') ||
    q.includes('प्रिंसिपल') ||
    q.includes('प्रधानाचार्य') ||
    q.includes('प्रधानाचार्या')
  );
}

export function isSchoolNameIntent(q: string): boolean {
  return (
    /\b(school\s*name|name\s*of\s*(the\s*)?school|which\s*school|your\s*school|school\s*ka\s*naam|school\s*naam|kya\s*naam\s*hai|naam\s*kya\s*hai|naam\s*kya\s*h)\b/i.test(q) ||
    /\b(stand\s*for|full\s*form|meaning\s*of\s*kkps)\b/i.test(q) ||
    q === 'school name' ||
    q === 'school name?' ||
    q === 'school ka naam' ||
    q === 'school ka naam?' ||
    q.includes('स्कूल का नाम') ||
    q.includes('विद्यालय का नाम') ||
    q.includes('हमारे स्कूल का नाम') ||
    (q.includes('kkps') && (q.includes('stand') || q.includes('full') || q.includes('matlab') || q.includes('kya hai') || q.includes('kya h')))
  );
}

export function isHolidayIntent(q: string): boolean {
  // Words specifically indicating holiday / vacation
  const hasHolidayWord =
    /\b(chhutti|chhutiyan|chhuttiyan|chutti|chuttiyan|holiday|holidays|vacation|vacations|weekly\s*off)\b/i.test(q) ||
    q.includes('छुट्टी') || q.includes('अवकाश');

  // Words indicating open / closed status
  const hasStatusWord =
    /\b(band|closed|close|khula|khulega|khulta|open|off)\b/i.test(q) ||
    q.includes('बंद') || q.includes('खुला');

  const hasTimeRef =
    /\b(kal|tomorrow|aaj|today|next|agli|agle|aage|upcoming|kab|kab tak|kab se|sunday|weekend)\b/i.test(q);

  if (hasHolidayWord) return true;

  if (hasStatusWord && (hasTimeRef || q.includes('school') || q.includes('class') || q.includes('classes'))) {
    return true;
  }

  if (/\b(kal|tomorrow|aaj|today)\b/i.test(q) && /\b(open|band|closed|khula|hai kya|h kya|hoga|hogi|padhai)\b/i.test(q)) {
    return true;
  }

  if (q.includes('kab band') || q.includes('kab khul') || q.includes('kab open') || q.includes('kab close') || q.includes('kab chhut')) {
    return true;
  }

  return false;
}

export function isFestivalIntent(q: string): boolean {
  if (findEventByKeyword(q)) return true;

  return (
    /\b(festivals?|celebrations?|tyohar|parv|utsav|jayanti|diwas)\b/i.test(q) ||
    q.includes('त्योहार') || q.includes('उत्सव') || q.includes('पर्व') ||
    q.includes('diwali') || q.includes('holi') || q.includes('eid') || q.includes('christmas') ||
    q.includes('dussehra') || q.includes('independence day') || q.includes('republic day') ||
    q.includes('gandhi jayanti') || q.includes('janmashtami') || q.includes('teachers day') ||
    q.includes('childrens day')
  );
}

export function isTimingIntent(q: string): boolean {
  return (
    /\b(timings?|tmings?|tming|times?|tym|tymings?|samay|hours?|summer|winter|khulta|khulega|kitne baje|kitne bje)\b/i.test(q) ||
    q.includes('समय') || q.includes('घंटे')
  );
}

export function isAddressIntent(q: string): boolean {
  return (
    /\b(address?|addrs?|adrs|adress|location|lokation|where|kahan|kidhar|place|mall|cantt|pata|sthit|kaha)\b/i.test(q) ||
    q.includes('पता') || q.includes('कहाँ') || q.includes('स्थान')
  );
}

export function isBoardIntent(q: string): boolean {
  return (
    /\b(board|bord|cbse|affiliat\w*|manyata|recognized)\b/i.test(q) ||
    q.includes('बोर्ड') || q.includes('संबद्ध') || q.includes('मान्यता')
  );
}

export function isContactIntent(q: string): boolean {
  return (
    /\b(contacts?|cntct|phone|phn|numbers?|numbr|mobile|mbl|call|helpline|telephon\w*)\b/i.test(q) ||
    q.includes('नंबर') || q.includes('फ़ोन') || q.includes('फोन')
  );
}

export function isAdmissionOrFeeIntent(q: string): boolean {
  return /\b(admiss?i?o?n\w*|dakhila|seats?|fees?|fee structure|kharcha|uniform|dress|syllabus|bus|transport)\b/i.test(q);
}

// --- STRICT RESPONSE HANDLERS ---

function handlePrincipalQuery(isHindiOrHinglish: boolean, requestedDevanagari: boolean): string {
  if (requestedDevanagari) {
    return 'कान्यकुब्ज पब्लिक स्कूल (KKPS) की प्रधानाचार्या मिस पूजा सहगल (Miss Pooja Sehgal) हैं।';
  }
  if (isHindiOrHinglish) {
    return 'Kanyakubja Public School (KKPS) ki Principal Miss Pooja Sehgal hain.';
  }
  return 'The Principal of Kanyakubja Public School is Miss Pooja Sehgal.';
}

function handleSchoolNameQuery(q: string, isHindiOrHinglish: boolean, requestedDevanagari: boolean): string {
  const isFullForm = q.includes('stand') || q.includes('full') || q.includes('matlab') || q.includes('meaning');

  if (requestedDevanagari) {
    if (isFullForm) {
      return 'KKPS का पूर्ण रूप कान्यकुब्ज पब्लिक स्कूल (Kanyakubja Public School) है।';
    }
    return 'हमारे विद्यालय का आधिकारिक नाम कान्यकुब्ज पब्लिक स्कूल (Kanyakubja Public School - KKPS) है।';
  }

  if (isHindiOrHinglish) {
    if (isFullForm) {
      return 'KKPS ka full form Kanyakubja Public School hai.';
    }
    return 'Hamare school ka official naam Kanyakubja Public School (KKPS) hai.';
  }

  if (isFullForm) {
    return 'KKPS stands for Kanyakubja Public School.';
  }
  return 'The full official name of our school is Kanyakubja Public School (KKPS).';
}

function handleHolidayQuery(q: string, isHindiOrHinglish: boolean, requestedDevanagari: boolean): string {
  const today = getIndiaToday();
  const tmr = getIndiaTomorrow();

  // 1. Tomorrow Query ("kal", "tomorrow", "कल")
  const isTomorrow =
    /\b(kal|tomorrow)\b/i.test(q) ||
    q.includes('कल') ||
    q.includes('kal school') ||
    q.includes('tomorrow school') ||
    q.includes('kal chhutti') ||
    q.includes('kal band') ||
    q.includes('kal open') ||
    q.includes('kal khula');

  if (isTomorrow) {
    if (tmr.dayOfWeek === 0) {
      if (requestedDevanagari) {
        return `कल रविवार (${tmr.formatted}) है (साप्ताहिक अवकाश / Weekly Off)। स्कूल बंद रहेगा।`;
      }
      if (isHindiOrHinglish) {
        return `Kal Sunday (${tmr.formatted}) hai, jo weekly off hota hai. Isliye kal school band rahega.`;
      }
      return `Tomorrow is Sunday (${tmr.formatted}), which is the weekly off. The school will remain closed.`;
    }

    const eventOnTmr = getEventOnDate(tmr.dateStr);
    if (eventOnTmr) {
      if (eventOnTmr.isHoliday) {
        if (requestedDevanagari) {
          return `हाँ, कल (${tmr.formatted}) ${eventOnTmr.name} के अवसर पर विद्यालय बंद रहेगा।\n• स्थिति: ${eventOnTmr.statusHinglish}`;
        }
        if (isHindiOrHinglish) {
          return `Haan, kal (${tmr.formatted}) ${eventOnTmr.name} ke avsar par school band rahega.\n\n• Event: ${eventOnTmr.name}\n• Status: ${eventOnTmr.statusHinglish}`;
        }
        return `Yes, tomorrow (${tmr.formatted}) the school will remain closed for ${eventOnTmr.name}.\n\n• Event: ${eventOnTmr.name}\n• Status: ${eventOnTmr.statusEn}`;
      } else if (eventOnTmr.isCelebratedAtSchool) {
        if (requestedDevanagari) {
          return `कल (${tmr.formatted}) ${eventOnTmr.name} है। विशेष कार्यक्रम व उत्सव के लिए विद्यालय खुला रहेगा।\n• कार्यक्रम: ${eventOnTmr.celebrationHinglish}`;
        }
        if (isHindiOrHinglish) {
          return `Kal (${tmr.formatted}) ${eventOnTmr.name} hai. School celebration aur special programs ke liye khula rahega.\n\n• Celebration: ${eventOnTmr.celebrationHinglish}\n• Status: ${eventOnTmr.statusHinglish}`;
        }
        return `Tomorrow (${tmr.formatted}) is ${eventOnTmr.name}. The school is open for celebrations and events.\n\n• Celebration: ${eventOnTmr.celebrationEn}\n• Status: ${eventOnTmr.statusEn}`;
      }
    }

    // Tomorrow is a regular working day
    if (requestedDevanagari) {
      return `नहीं, कल (${tmr.formatted}) कान्यकुब्ज पब्लिक स्कूल का सामान्य कार्यदिवस (Regular Working Day) है। स्कूल अपने निर्धारित समय पर खुला रहेगा (ग्रीष्मकालीन: 8:00 AM – 2:00 PM | शीतकालीन: 8:30 AM – 2:30 PM)।`;
    }
    if (isHindiOrHinglish) {
      return `Nahi, kal (${tmr.formatted}) KKPS ka regular working day hai. School apne nirdharit samay par khula rahega (Summer: 8:00 AM – 2:00 PM | Winter: 8:30 AM – 2:30 PM).`;
    }
    return `No, tomorrow (${tmr.formatted}) is a regular school working day at Kanyakubja Public School. Timings: Summer 8:00 AM – 2:00 PM | Winter 8:30 AM – 2:30 PM.`;
  }

  // 2. Today Query ("aaj", "today", "आज")
  const isToday =
    /\b(aaj|today)\b/i.test(q) ||
    q.includes('आज') ||
    q.includes('aaj school') ||
    q.includes('today school') ||
    q.includes('aaj chhutti') ||
    q.includes('aaj band') ||
    q.includes('aaj open') ||
    q.includes('aaj khula');

  if (isToday) {
    if (today.dayOfWeek === 0) {
      if (requestedDevanagari) {
        return `आज रविवार (${today.formatted}) है (साप्ताहिक अवकाश)। विद्यालय बंद है।`;
      }
      if (isHindiOrHinglish) {
        return `Aaj Sunday (${today.formatted}) hai (weekly off). Isliye aaj school band hai.`;
      }
      return `Today is Sunday (${today.formatted}), which is the weekly off. The school is closed today.`;
    }

    const eventToday = getEventOnDate(today.dateStr);
    if (eventToday) {
      if (eventToday.isHoliday) {
        if (requestedDevanagari) {
          return `आज (${today.formatted}) ${eventToday.name} के अवसर पर विद्यालय बंद है।\n• स्थिति: ${eventToday.statusHinglish}`;
        }
        if (isHindiOrHinglish) {
          return `Aaj (${today.formatted}) ${eventToday.name} ke avsar par school band hai.\n• Status: ${eventToday.statusHinglish}`;
        }
        return `Today (${today.formatted}) the school is closed on account of ${eventToday.name}.\n• Status: ${eventToday.statusEn}`;
      } else if (eventToday.isCelebratedAtSchool) {
        if (requestedDevanagari) {
          return `आज (${today.formatted}) ${eventToday.name} है। विद्यालय उत्सव व कार्यक्रम के लिए खुला है।\n• स्थिति: ${eventToday.statusHinglish}`;
        }
        if (isHindiOrHinglish) {
          return `Aaj (${today.formatted}) ${eventToday.name} hai. School celebration ke liye khula hai.\n• Status: ${eventToday.statusHinglish}`;
        }
        return `Today (${today.formatted}) is ${eventToday.name}. The school is observing celebrations today.\n• Status: ${eventToday.statusEn}`;
      }
    }

    if (requestedDevanagari) {
      return `हाँ, आज (${today.formatted}) कान्यकुब्ज पब्लिक स्कूल सामान्य रूप से खुला है।\n• समय: Summer 8:00 AM – 2:00 PM | Winter 8:30 AM – 2:30 PM`;
    }
    if (isHindiOrHinglish) {
      return `Haan, aaj (${today.formatted}) KKPS regular working day ke roop mein khula hai.\n• Summer Timings: 8:00 AM se 2:00 PM\n• Winter Timings: 8:30 AM se 2:30 PM`;
    }
    return `Yes, today (${today.formatted}) is a regular working day at Kanyakubja Public School.\n• Summer Timings: 8:00 AM to 2:00 PM\n• Winter Timings: 8:30 AM to 2:30 PM`;
  }

  // 3. Holiday List / Calendar Query
  const isHolidayList =
    /\b(holidays?\s*list|list\s*of\s*(school\s*)?holidays?|chhutti\w*\s*(ki\s*)?list|annual\s*calendar|holiday\s*calendar)\b/i.test(q) ||
    q.includes('chhutti ki list') ||
    q.includes('holiday list') ||
    q.includes('holidays list');

  if (isHolidayList) {
    if (requestedDevanagari) {
      return `कान्यकुब्ज पब्लिक स्कूल (KKPS) की मुख्य छुट्टियों की सूची:\n\n• 26 Jan: Republic Day (Flag Hoisting & Cultural Celebration)\n• 15 Feb: Maha Shivratri (अवकाश)\n• 04-05 Mar: Holi (होली अवकाश)\n• 21 Mar: Eid-ul-Fitr (अवकाश)\n• 14 Apr: Dr. B.R. Ambedkar Jayanti (अवकाश)\n• 20 May - 30 Jun: ग्रीष्मकालीन अवकाश (Summer Vacation)\n• 15 Aug: Independence Day (ध्वजारोहण एवं उत्सव)\n• 28 Aug: Raksha Bandhan (अवकाश)\n• 04 Sep: Krishna Janmashtami (अवकाश)\n• 05 Sep: Teachers' Day (विद्यालय में उत्सव)\n• 02 Oct: Mahatma Gandhi Jayanti (राष्ट्रीय अवकाश)\n• 20 Oct: Dussehra / Vijayadashami (अवकाश)\n• 08-12 Nov: Diwali, Govardhan Puja & Bhai Dooj (अवकाश)\n• 14 Nov: Children's Day / Bal Diwas (विद्यालय में उत्सव)\n• 24 Nov: Guru Nanak Jayanti (अवकाश)\n• 25 Dec: Christmas (अवकाश)\n• 31 Dec - 08 Jan: शीतकालीन अवकाश (Winter Vacation)\n\nकिसी भी अवकाश की पुष्टि के लिए स्कूल कार्यालय: 0512-2330410 पर संपर्क करें।`;
    }
    if (isHindiOrHinglish) {
      return `Kanyakubja Public School (KKPS) ke pramukh holidays aur celebrations ki list:\n\n• 26 Jan: Republic Day (Flag Hoisting & Cultural Celebration)\n• 15 Feb: Maha Shivratri (Holiday)\n• 04-05 Mar: Holi (Festival Holidays)\n• 21 Mar: Eid-ul-Fitr (Holiday)\n• 14 Apr: Dr. B.R. Ambedkar Jayanti (Holiday)\n• 20 May - 30 Jun: Summer Vacation\n• 15 Aug: Independence Day (National Celebration & Flag Hoisting)\n• 28 Aug: Raksha Bandhan (Holiday)\n• 04 Sep: Krishna Janmashtami (Holiday)\n• 05 Sep: Teachers' Day (Celebrated at School)\n• 02 Oct: Mahatma Gandhi Jayanti (National Holiday)\n• 20 Oct: Dussehra / Vijayadashami (Holiday)\n• 08-12 Nov: Diwali, Govardhan Puja & Bhai Dooj (Holidays)\n• 14 Nov: Children's Day / Bal Diwas (Celebrated at School)\n• 24 Nov: Guru Nanak Jayanti (Holiday)\n• 25 Dec: Christmas (Holiday)\n• 31 Dec - 08 Jan: Winter Vacation\n\nKisi bhi holiday confirmation ke liye school office: 0512-2330410 par call kar sakte hain.`;
    }
    return `Here is the verified list of major school holidays and celebrations for Kanyakubja Public School (KKPS):\n\n• Jan 26: Republic Day (Flag Hoisting & Celebration Assembly)\n• Feb 15: Maha Shivratri (School Closed)\n• Mar 04–05: Holi (School Closed)\n• Mar 21: Eid-ul-Fitr (School Closed)\n• Apr 14: Dr. B.R. Ambedkar Jayanti (School Closed)\n• May 20 – Jun 30: Summer Vacation\n• Aug 15: Independence Day (Flag Hoisting & Patriotic Celebration)\n• Aug 28: Raksha Bandhan (School Closed)\n• Sep 04: Krishna Janmashtami (School Closed)\n• Sep 05: Teachers' Day (Celebrated with special student programs)\n• Oct 02: Mahatma Gandhi Jayanti (National Holiday - Closed)\n• Oct 20: Dussehra / Vijayadashami (School Closed)\n• Nov 08–12: Diwali, Govardhan Puja & Bhai Dooj (Festival Break)\n• Nov 14: Children's Day (Celebrated at school with student events)\n• Nov 24: Guru Nanak Jayanti (School Closed)\n• Dec 25: Christmas (School Closed)\n• Dec 31 – Jan 08: Winter Vacation\n\nFor official notices or date confirmations, please contact the school office: 0512-2330410.`;
  }

  // 4. "School kab band rahega?", "Next holiday kab hai?", "Agli chhutti kab hai?"
  const nextHoliday = getNextUpcomingEvent(today.dateStr, true);
  const nextCelebration = getNextUpcomingEvent(today.dateStr, false);

  if (isHindiOrHinglish) {
    let reply = `KKPS calendar ke anusar school holiday aur closure details:\n\n`;
    const eventToday = getEventOnDate(today.dateStr);
    if (eventToday && eventToday.isHoliday) {
      reply += `• Aaj (${today.formatted}): ${eventToday.name} ke avsar par school band hai.\n`;
    }
    if (nextCelebration && !nextCelebration.isHoliday) {
      reply += `• Agla Event: ${nextCelebration.name} — ${nextCelebration.date} (School celebration ke liye open rahega).\n`;
    }
    if (nextHoliday) {
      reply += `• Agli School Chhutti (Closed): ${nextHoliday.name} — ${nextHoliday.date}${nextHoliday.endDate ? ' se ' + nextHoliday.endDate : ''} (School band rahega).\n`;
    }
    reply += `• Winter Vacation: 31 December 2026 se 08 January 2027 tak.\n\nKisi bhi holiday confirmation ke liye school office: 0512-2330410 par call kar sakte hain.`;
    return reply;
  }

  let replyEn = `According to the KKPS school calendar:\n\n`;
  const eventToday = getEventOnDate(today.dateStr);
  if (eventToday && eventToday.isHoliday) {
    replyEn += `• Today (${today.formatted}): School is closed for ${eventToday.name}.\n`;
  }
  if (nextCelebration && !nextCelebration.isHoliday) {
    replyEn += `• Next Celebration: ${nextCelebration.name} — ${nextCelebration.date} (School open for events).\n`;
  }
  if (nextHoliday) {
    replyEn += `• Next School Holiday (Closed): ${nextHoliday.name} — ${nextHoliday.date}${nextHoliday.endDate ? ' to ' + nextHoliday.endDate : ''} (School will remain closed).\n`;
  }
  replyEn += `• Winter Vacation: December 31, 2026 to January 08, 2027.\n\nFor official confirmation of dates, please contact the school office: 0512-2330410.`;
  return replyEn;
}

function handleFestivalQuery(q: string, isHindiOrHinglish: boolean, requestedDevanagari: boolean): string {
  const tmr = getIndiaTomorrow();
  const today = getIndiaToday();

  // 1. Tomorrow's festival query ("kal kaunsa festival hai?", "tomorrow festival")
  if (/\b(kal|tomorrow)\b/i.test(q)) {
    const eventOnTmr = getEventOnDate(tmr.dateStr);
    if (eventOnTmr) {
      if (isHindiOrHinglish) {
        return `Kal (${tmr.formatted}) ${eventOnTmr.name} hai.\n\n• Significance: ${eventOnTmr.descriptionHinglish}\n• School Status: ${eventOnTmr.statusHinglish}\n• KKPS Celebration: ${eventOnTmr.celebrationHinglish}`;
      }
      return `Tomorrow (${tmr.formatted}) is ${eventOnTmr.name}.\n\n• Significance: ${eventOnTmr.descriptionEn}\n• School Status: ${eventOnTmr.statusEn}\n• KKPS Celebration: ${eventOnTmr.celebrationEn}`;
    }

    const nextUpcoming = getNextUpcomingEvent(tmr.dateStr, false) || getNextUpcomingEvent(today.dateStr, false);
    if (isHindiOrHinglish) {
      let msg = `Kal (${tmr.formatted}) koi festival ya school holiday nahi hai. School regular timings par khula rahega.`;
      if (nextUpcoming) {
        msg += `\n\n• Upcoming Celebration: Agla celebration ${nextUpcoming.name} (${nextUpcoming.date}) ko hai.\n• KKPS Celebration: ${nextUpcoming.celebrationHinglish}`;
      }
      return msg;
    }
    let msgEn = `There is no festival or holiday tomorrow (${tmr.formatted}). The school will remain open with regular timings.`;
    if (nextUpcoming) {
      msgEn += `\n\n• Upcoming Celebration: The next event is ${nextUpcoming.name} on ${nextUpcoming.date}.\n• KKPS Celebration: ${nextUpcoming.celebrationEn}`;
    }
    return msgEn;
  }

  // 2. Specific festival match (e.g. Diwali, Holi, Dussehra, Eid, Christmas, etc.)
  const matchedEvent = findEventByKeyword(q);
  if (matchedEvent) {
    if (requestedDevanagari) {
      return `${matchedEvent.name}:\n• दिनांक (Date): ${matchedEvent.date}${matchedEvent.endDate ? ' से ' + matchedEvent.endDate : ''}\n• महत्व: ${matchedEvent.descriptionHinglish}\n• स्कूल स्थिति: ${matchedEvent.statusHinglish}\n• विद्यालय कार्यक्रम: ${matchedEvent.celebrationHinglish}`;
    }
    if (isHindiOrHinglish) {
      return `${matchedEvent.name} ke baare mein details:\n\n• Date: ${matchedEvent.date}${matchedEvent.endDate ? ' se ' + matchedEvent.endDate : ''}\n• What it is: ${matchedEvent.descriptionHinglish}\n• School Status: ${matchedEvent.statusHinglish}\n• KKPS Celebration: ${matchedEvent.celebrationHinglish}\n\nAapko school holidays ya kisi aur festival ke baare mein jaanna ho toh bataiye!`;
    }
    return `Details for ${matchedEvent.name}:\n\n• Date: ${matchedEvent.date}${matchedEvent.endDate ? ' to ' + matchedEvent.endDate : ''}\n• Significance: ${matchedEvent.descriptionEn}\n• School Status: ${matchedEvent.statusEn}\n• KKPS Celebration: ${matchedEvent.celebrationEn}\n\nPlease feel free to ask if you need details about any other festival or school holiday!`;
  }

  // 3. General festival list
  if (isHindiOrHinglish) {
    return `KKPS mein manaye jaane wale pramukh festivals aur celebrations:\n\n• Republic Day (26 Jan) — Flag hoisting & cultural programs\n• Holi (04-05 Mar) — Festival holidays\n• Eid-ul-Fitr (21 Mar) — Holiday\n• Independence Day (15 Aug) — Flag hoisting & patriotic tribute\n• Krishna Janmashtami (04 Sep) — Holiday\n• Teachers' Day (05 Sep) — Celebrated at school\n• Gandhi Jayanti (02 Oct) — National Holiday\n• Dussehra (20 Oct) — Holiday\n• Diwali (08-12 Nov) — Festival break\n• Children's Day (14 Nov) — Celebrated at school\n• Christmas (25 Dec) — Holiday\n\nKisi specific festival ki details ke liye naam likhkar pooch sakte hain!`;
  }
  return `Major festivals and celebrations observed at Kanyakubja Public School (KKPS):\n\n• Republic Day (Jan 26) — Flag hoisting & cultural assemblies\n• Holi (Mar 04–05) — School closed\n• Eid-ul-Fitr (Mar 21) — School closed\n• Independence Day (Aug 15) — National flag hoisting & student tributes\n• Krishna Janmashtami (Sep 04) — School closed\n• Teachers' Day (Sep 05) — Special celebrations at school\n• Gandhi Jayanti (Oct 02) — National Holiday\n• Dussehra (Oct 20) — School closed\n• Diwali (Nov 08–12) — Festival holidays\n• Children's Day (Nov 14) — Special student events & performances\n• Christmas (Dec 25) — School closed\n\nFeel free to ask for details about any specific festival!`;
}

// Emergency & offline rule-based responder strictly adhering to verified facts & isolated intent routing
function getDirectAnswer(query: string): string {
  const q = query.trim().toLowerCase();
  const hasDevanagari = /[\u0900-\u097F]/.test(query);

  const requestedDevanagari =
    hasDevanagari ||
    q.includes('devanagari') ||
    q.includes('देवनागरी') ||
    q.includes('hindi script') ||
    q.includes('हिंदी लिपि') ||
    q.includes('devnagari');

  const distinctiveHindiWords =
    /\b(kya|kab|kahan|kaha|kidhar|kaise|kaisa|kaisi|hai|hain|ho|hoon|hun|kaun|kitna|kitni|kitne|batao|bataiye|bata|btao|btae|chhutti|samay|pata|shuru|milega|padhai|chahiye|karo|karein|kare|karna|hoga|hogi|honge|hoti|hota|dakhila|theek|haal|tum|tumhara|tumhari|aap|aapka|aapki|aapko|mujhe|humein|mera|meri|mere|bhai|yaar|arre|suno|kuch|aur|haan|nahi|nahin|mat|accha|achha|badhiya|shukriya|dhanyawad|alvida|zaroor|poochna|pooch|bhejo|jana|aana|baje|bje|waqt|namaste|namaskar|pranam|ki|ke|mein|liye|kal|aaj|band|khula|rahega|hogi|hote)\b/i;

  const hasHindiKeywords = distinctiveHindiWords.test(q);
  const isHindiOrHinglish = hasDevanagari || hasHindiKeywords;

  // Unclear / gibberish check
  const isUnclear =
    /^[^\w\s\u0900-\u097F]+$/.test(q) ||
    (q.length <= 2 && !/^(hi|gm|gn|no|ok|h|ha|by)$/.test(q)) ||
    /^(asdf|qwerty|xyz|zzz)/.test(q);

  if (isUnclear) {
    if (isHindiOrHinglish) {
      return 'Mujhe aapka sawaal theek se samajh nahi aaya. Aap thoda clearly bata sakte hain ki KKPS ke baare mein aapko kya jaanna hai?';
    }
    return 'I could not quite understand your question. Could you please clarify what information you need about KKPS?';
  }

  // --- STRICT ISOLATED INTENT ROUTING ---

  // 1. PRINCIPAL INTENT
  if (isPrincipalIntent(q)) {
    return handlePrincipalQuery(isHindiOrHinglish, requestedDevanagari);
  }

  // 2. SCHOOL NAME INTENT
  if (isSchoolNameIntent(q)) {
    return handleSchoolNameQuery(q, isHindiOrHinglish, requestedDevanagari);
  }

  // 3. HOLIDAY INTENT (Includes Tomorrow, Today, When school closed, Holiday lists, Vacations)
  if (isHolidayIntent(q)) {
    return handleHolidayQuery(q, isHindiOrHinglish, requestedDevanagari);
  }

  // 4. FESTIVAL INTENT (Includes Diwali, Holi, Dussehra, Eid, Christmas, "Kal kaunsa festival hai", etc.)
  if (isFestivalIntent(q)) {
    return handleFestivalQuery(q, isHindiOrHinglish, requestedDevanagari);
  }

  // 5. TIMINGS INTENT
  if (isTimingIntent(q)) {
    if (requestedDevanagari) {
      return 'कान्यकुब्ज पब्लिक स्कूल, कानपुर का समय:\n• ग्रीष्मकालीन (Summer): प्रातः 8:00 बजे से दोपहर 2:00 बजे तक\n• शीतकालीन (Winter): प्रातः 8:30 बजे से दोपहर 2:30 बजे तक';
    }
    if (isHindiOrHinglish) {
      return 'School ki timings ye hain:\n• Summer: 8:00 AM se 2:00 PM tak\n• Winter: 8:30 AM se 2:30 PM tak\n\nAapko kuch aur poochna ho toh bataiye!';
    }
    return 'The school timings for Kanyakubja Public School are:\n• Summer: 8:00 AM to 2:00 PM\n• Winter: 8:30 AM to 2:30 PM\n\nPlease let me know if you need any other details!';
  }

  // 6. LOCATION INTENT
  if (isAddressIntent(q)) {
    if (requestedDevanagari) {
      return 'कान्यकुब्ज पब्लिक स्कूल का पता:\n91, कैंट, द मॉल, कानपुर, उत्तर प्रदेश 208001।';
    }
    if (isHindiOrHinglish) {
      return 'Kanyakubja Public School 91, Cantt. The Mall, Kanpur, Uttar Pradesh 208001 mein hai.\n\nAap Google Maps par bhi dekh sakte hain ya office mein pooch sakte hain.';
    }
    return 'Kanyakubja Public School is located at:\n91, Cantt. The Mall, Kanpur, Uttar Pradesh 208001.';
  }

  // 7. BOARD INTENT
  if (isBoardIntent(q)) {
    if (requestedDevanagari) {
      return 'कान्यकुब्ज पब्लिक स्कूल केंद्रीय माध्यमिक शिक्षा बोर्ड (CBSE) से संबद्ध है।';
    }
    if (isHindiOrHinglish) {
      return 'Kanyakubja Public School CBSE (Central Board of Secondary Education) board se affiliated hai.';
    }
    return 'Kanyakubja Public School is affiliated with the Central Board of Secondary Education (CBSE).';
  }

  // 8. CONTACT INTENT
  if (isContactIntent(q)) {
    if (requestedDevanagari) {
      return 'विद्यालय के आधिकारिक संपर्क सूत्र:\n• स्कूल कार्यालय: 0512-2330410\n• हैंडबुक मोबाइल: 9473957947';
    }
    if (isHindiOrHinglish) {
      return 'School ke official contact numbers ye hain:\n• School Office: 0512-2330410\n• Handbook Mobile: 9473957947\n\nAap in numbers par call karke pooch sakte hain.';
    }
    return 'Here are the official contact numbers for Kanyakubja Public School:\n• School Office: 0512-2330410\n• Handbook Mobile: 9473957947\n\nPlease feel free to call the school office for confirmation.';
  }

  // 9. ADMISSION / FEE INTENT
  if (isAdmissionOrFeeIntent(q)) {
    if (requestedDevanagari) {
      return 'फीस अथवा प्रवेश (Admission) से संबंधित अद्यतन जानकारी के लिए कृपया सीधे विद्यालय कार्यालय से संपर्क करें:\n• स्कूल कार्यालय: 0512-2330410\n• हैंडबुक मोबाइल: 9473957947';
    }
    if (isHindiOrHinglish) {
      return 'Admission ya fee details ki exact jaankari ke liye aap school office mein ek baar pooch sakte hain:\n• School Office: 0512-2330410\n• Handbook Mobile: 9473957947';
    }
    return 'For official confirmation regarding admission or fee structure, please contact the school office directly:\n• School Office: 0512-2330410\n• Handbook Mobile: 9473957947';
  }

  // 10. GREETINGS
  const isGreeting =
    /^(hi+|hello+|hey+|heya+|namaste|namaskar|pranam|good\s*(morning|afternoon|evening)|hlo|helo|yo|wassup|hola)[\s!.,?]*$/i.test(q) ||
    (/^(hi|hello|hey|namaste|namaskar)\b/i.test(q) && q.split(/\s+/).length <= 4);

  if (isGreeting) {
    if (isHindiOrHinglish) {
      return 'Hey! 😊 Welcome to KKPS. Main aapki kya help kar sakta hoon?';
    }
    return 'Hello! 😊 Welcome to KKPS AI Assistant. How can I help you today?';
  }

  // 11. HOW ARE YOU
  if (/\b(how are you|how r u|how are u|how do you do|how's it going|kaise ho|kya haal|kaisa chal raha|sab theek|sab kaisa)\b/i.test(q)) {
    if (isHindiOrHinglish) {
      return 'Main bilkul theek hoon, thank you! 😊 Tum batao, kaise ho? KKPS ke baare mein kuch poochna hai toh bataiye.';
    }
    return 'I am doing great, thank you! 😊 How are you doing? Let me know if you need any information about KKPS.';
  }

  // 12. THANKS
  if (/\b(thank you|thanks|thx|thanku|dhanyawad|shukriya|bahut badhiya|great job|nice)\b/i.test(q)) {
    if (isHindiOrHinglish) {
      return "You're welcome! 😊 Agar school ke baare mein aur kuch poochna ho toh zaroor bataiye.";
    }
    return 'You are very welcome! Feel free to ask if you need anything else about KKPS.';
  }

  // 13. FAREWELL
  if (/\b(bye|goodbye|see you|alvida|tata|take care)\b/i.test(q)) {
    if (isHindiOrHinglish) {
      return 'Bye! Have a wonderful day ahead! 😊 Jab bhi KKPS ke baare mein kuch jaanna ho, main yahan hoon.';
    }
    return 'Goodbye! Have a great day ahead! Feel free to reach out anytime you need assistance with KKPS.';
  }

  // 14. IDENTITY
  if (/\b(who are you|who r u|tum kaun ho|aap kaun ho|what can you do|kya kar sakte|about you)\b/i.test(q)) {
    if (isHindiOrHinglish) {
      return 'Main KKPS AI Assistant hoon! 😊 Main Kanyakubja Public School ke timings, campus address, CBSE board, festivals aur holidays information mein aapki help kar sakta hoon. Batao, main kya help karoon?';
    }
    return 'I am the KKPS AI Assistant! I can help you with Kanyakubja Public School\'s timings, campus location, CBSE board affiliation, festivals, and school holidays. How can I help you today?';
  }

  // 15. CASUAL / UNMATCHED FALLBACK (Zero mention of Principal or unrelated facts)
  if (isHindiOrHinglish) {
    return 'Welcome to KKPS AI Assistant! 😊 Main aapki kya help kar sakta hoon? Aap mujhse school holidays, festivals, timings ya admissions ke baare mein pooch sakte hain.';
  }
  return 'Welcome to KKPS AI Assistant! 😊 How can I help you today? Feel free to ask about school holidays, festivals, timings, admissions, or contact details.';
}

// School Info API
app.get('/api/school-info', (_req: Request, res: Response) => {
  res.json({ success: true, data: SCHOOL_INFO });
});

// Holidays & Calendar API endpoint (for easy updates)
app.get('/api/holidays', (_req: Request, res: Response) => {
  const today = getIndiaToday();
  const tomorrow = getIndiaTomorrow();
  const next = getNextEvent(today.dateStr);

  res.json({
    success: true,
    today,
    tomorrow,
    nextEvent: next,
    events: SCHOOL_CALENDAR_EVENTS,
  });
});

// Helper to detect if a query is asking for authoritative school facts
function isAuthoritativeFactQuery(query: string): boolean {
  const q = query.trim().toLowerCase();
  return (
    isPrincipalIntent(q) ||
    isSchoolNameIntent(q) ||
    isHolidayIntent(q) ||
    isFestivalIntent(q) ||
    isTimingIntent(q) ||
    isAddressIntent(q) ||
    isBoardIntent(q) ||
    isContactIntent(q) ||
    isAdmissionOrFeeIntent(q)
  );
}

let quotaCooldownUntil = 0;

// Chat API endpoint
app.post('/api/chat', async (req: Request, res: Response) => {
  const { message, history } = req.body;

  if (!message || typeof message !== 'string' || message.trim() === '') {
    res.status(400).json({ error: 'Message is required' });
    return;
  }

  const trimmedMessage = message.trim();
  const q = trimmedMessage.toLowerCase();

  // Instant authoritative response for exact verified school facts (Principal, School Name, Holidays, Festivals, Timings, Location, etc.)
  if (isAuthoritativeFactQuery(q)) {
    const directReply = getDirectAnswer(trimmedMessage);
    res.json({
      success: true,
      reply: directReply,
      isAuthoritative: true,
    });
    return;
  }

  const ai = getAIClient();

  // If AI client exists and not in active quota cooldown, attempt live Gemini model
  if (ai && Date.now() > quotaCooldownUntil) {
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    if (Array.isArray(history)) {
      for (const turn of history.slice(-8)) {
        if (turn && (turn.role === 'user' || turn.role === 'model') && typeof turn.text === 'string') {
          contents.push({
            role: turn.role,
            parts: [{ text: turn.text }],
          });
        }
      }
    }

    contents.push({
      role: 'user',
      parts: [{ text: trimmedMessage }],
    });

    try {
      const responsePromise = ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        },
      });

      // Add 6-second timeout race to prevent hanging
      const timeoutPromise = new Promise<null>((_, reject) =>
        setTimeout(() => reject(new Error('AI Request timeout')), 6000)
      );

      const response: any = await Promise.race([responsePromise, timeoutPromise]);

      if (response && response.text) {
        res.json({
          success: true,
          reply: response.text,
          modelUsed: 'gemini-3.8-flash',
        });
        return;
      }
    } catch (err: any) {
      const errMsg = String(err?.message || err);
      if (errMsg.includes('429') || errMsg.includes('RESOURCE_EXHAUSTED') || errMsg.includes('quota')) {
        quotaCooldownUntil = Date.now() + 15 * 60 * 1000;
        console.log('Gemini API Free Tier quota reached. Seamlessly serving verified answers.');
      } else {
        console.log('Gemini API call skipped. Serving verified knowledge base.');
      }
    }
  }

  // Seamlessly respond with verified school facts in the user's preferred language style
  const reply = getDirectAnswer(trimmedMessage);
  res.json({
    success: true,
    reply,
    isFallback: true,
  });
});

async function main() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0', port: PORT },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Kanyakubja Public School AI server running at http://0.0.0.0:${PORT}`);
  });
}

main().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
