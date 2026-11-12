/**
 * KKPS School Calendar, Holidays & Celebrations Dataset
 * Kanyakubja Public School, Kanpur
 * 
 * Can be updated easily without altering the rest of the application.
 */

export interface SchoolCalendarEvent {
  id: string;
  name: string;
  keywords: string[];
  date: string; // YYYY-MM-DD
  endDate?: string;
  isHoliday: boolean; // true = school closed for classes
  isCelebratedAtSchool: boolean; // true = special celebration at school
  descriptionEn: string;
  descriptionHinglish: string;
  statusEn: string;
  statusHinglish: string;
  celebrationEn: string;
  celebrationHinglish: string;
}

export const SCHOOL_CALENDAR_EVENTS: SchoolCalendarEvent[] = [
  {
    id: 'republic-day',
    name: 'Republic Day',
    keywords: ['republic day', 'republic', '26 january', '26 jan', 'gantantra diwas', 'gantantra'],
    date: '2026-01-26',
    isHoliday: false, // Students attend for flag hoisting
    isCelebratedAtSchool: true,
    descriptionEn: 'Republic Day commemorates the enactment of the Constitution of India on January 26, 1950.',
    descriptionHinglish: 'Republic Day par 26 January 1950 ko Bharat ka Samvidhan lagu hua tha.',
    statusEn: 'School is open for the Republic Day celebration and flag hoisting ceremony. Regular academic classes remain suspended.',
    statusHinglish: 'Republic Day par school flag hoisting aur cultural program ke liye khula rehta hai. Regular classes suspend rehti hain.',
    celebrationEn: 'KKPS celebrates Republic Day with national flag hoisting, parade, patriotic songs, and student speeches.',
    celebrationHinglish: 'KKPS mein Republic Day par tiranga hoisting, march-past, deshbhatti geet aur student speeches hoti hain.',
  },
  {
    id: 'maha-shivratri',
    name: 'Maha Shivratri',
    keywords: ['shivratri', 'maha shivratri', 'shiva', 'shiv'],
    date: '2026-02-15',
    isHoliday: true,
    isCelebratedAtSchool: false,
    descriptionEn: 'Maha Shivratri is a revered Hindu festival dedicated to Lord Shiva.',
    descriptionHinglish: 'Maha Shivratri Bhagwan Shiva ki pooja aur bhakti ka pavitra parv hai.',
    statusEn: 'School will remain closed on account of Maha Shivratri.',
    statusHinglish: 'Maha Shivratri ke avsar par school band rahega.',
    celebrationEn: 'Observed as a religious holiday.',
    celebrationHinglish: 'Is din religious holiday ke roop mein school ki chhutti hoti hai.',
  },
  {
    id: 'holi',
    name: 'Holi',
    keywords: ['holi', 'dhulandi', 'holika', 'rang'],
    date: '2026-03-04',
    endDate: '2026-03-05',
    isHoliday: true,
    isCelebratedAtSchool: false,
    descriptionEn: 'Holi is the joyous festival of colors and the triumph of good over evil.',
    descriptionHinglish: 'Holi rango aur khushiyon ka tyohar hai jo burai par acchai ki jeet darshata hai.',
    statusEn: 'School will remain closed for the Holi festival break.',
    statusHinglish: 'Holi ke tyohar ke liye school mein chhutti rahegi.',
    celebrationEn: 'Before the holidays, students learn about eco-friendly celebrations during morning assembly.',
    celebrationHinglish: 'Holidays se pehle school assembly mein safe aur natural colors use karne ka sandesh diya jata hai.',
  },
  {
    id: 'eid-ul-fitr',
    name: 'Eid-ul-Fitr',
    keywords: ['eid', 'eid ul fitr', 'id', 'meethi eid', 'ramzan eid'],
    date: '2026-03-21',
    isHoliday: true,
    isCelebratedAtSchool: false,
    descriptionEn: 'Eid-ul-Fitr marks the conclusion of the holy month of Ramadan.',
    descriptionHinglish: 'Eid-ul-Fitr Ramadan ke pavitra mahine ke khatam hone par manaya jata hai.',
    statusEn: 'School will remain closed for Eid-ul-Fitr (subject to moon sighting confirmation).',
    statusHinglish: 'Eid-ul-Fitr ke mauke par school band rahega (chand dekhne ke confirmation ke anusar).',
    celebrationEn: 'Warm greetings are extended to all students and staff.',
    celebrationHinglish: 'Sabhi students aur teachers ko Eid ki badhai di jaati hai.',
  },
  {
    id: 'ambedkar-jayanti',
    name: 'Dr. B.R. Ambedkar Jayanti',
    keywords: ['ambedkar', 'ambedkar jayanti', 'bhimrao'],
    date: '2026-04-14',
    isHoliday: true,
    isCelebratedAtSchool: false,
    descriptionEn: 'Ambedkar Jayanti honors the father of the Indian Constitution, Dr. Bhimrao Ramji Ambedkar.',
    descriptionHinglish: 'Dr. B.R. Ambedkar Jayanti Bharat ke Samvidhan nirmata ki yaad mein manayi jaati hai.',
    statusEn: 'School will remain closed in honor of Dr. B.R. Ambedkar Jayanti.',
    statusHinglish: 'Ambedkar Jayanti ke avsar par school band rahega.',
    celebrationEn: 'Students discuss Dr. Ambedkar’s contributions in class before the holiday.',
    celebrationHinglish: 'School mein pehle din assembly mein Dr. Ambedkar ke yogdan ke baare mein bataya jata hai.',
  },
  {
    id: 'summer-vacation',
    name: 'Summer Vacation',
    keywords: ['summer vacation', 'garmi ki chhutti', 'summer holiday', 'summer holidays', 'vacation'],
    date: '2026-05-20',
    endDate: '2026-06-30',
    isHoliday: true,
    isCelebratedAtSchool: false,
    descriptionEn: 'Annual summer vacation for students as per CBSE and Uttar Pradesh state education guidelines.',
    descriptionHinglish: 'CBSE aur UP education guidelines ke tahat annual summer vacation.',
    statusEn: 'School will remain closed for students during the summer vacation break.',
    statusHinglish: 'Summer vacation ke dauraan students ke liye school band rehta hai. Office working hours ke liye 0512-2330410 par call kar sakte hain.',
    celebrationEn: 'Holiday homework, creative projects, and reading challenges are provided to students.',
    celebrationHinglish: 'Students ko holiday homework, reading challenges aur creative projects diye jaate hain.',
  },
  {
    id: 'independence-day',
    name: 'Independence Day',
    keywords: ['independence day', 'independence', '15 august', '15 aug', 'swatantrata diwas', 'azadi'],
    date: '2026-08-15',
    isHoliday: false, // Students attend for celebration
    isCelebratedAtSchool: true,
    descriptionEn: 'Independence Day celebrates India gaining freedom from British rule on August 15, 1947.',
    descriptionHinglish: '15 August 1947 ko Bharat ko aazadi mili thi, jise Independence Day ke roop mein manate hain.',
    statusEn: 'School is open for Independence Day celebrations and flag hoisting. Regular subject classes remain suspended.',
    statusHinglish: 'Independence Day par school flag hoisting aur patriotic cultural programs ke liye khula rehta hai. Regular padhai suspend rehti hai.',
    celebrationEn: 'Grand celebration at KKPS campus featuring National Flag hoisting by the Principal, march past, patriotic songs, and distribution of sweets.',
    celebrationHinglish: 'KKPS campus mein Principal dwara flag hoisting, march-past, patriotic dance, drama aur sweets distribution hota hai.',
  },
  {
    id: 'raksha-bandhan',
    name: 'Raksha Bandhan',
    keywords: ['raksha bandhan', 'rakhi'],
    date: '2026-08-28',
    isHoliday: true,
    isCelebratedAtSchool: false,
    descriptionEn: 'Raksha Bandhan celebrates the sacred bond of love and protection between brothers and sisters.',
    descriptionHinglish: 'Raksha Bandhan bhai-behan ke pavitra prem aur suraksha ka tyohar hai.',
    statusEn: 'School will remain closed on account of Raksha Bandhan.',
    statusHinglish: 'Raksha Bandhan ke din school band rahega.',
    celebrationEn: 'Primary students often participate in eco-friendly rakhi-making activities before the holiday.',
    celebrationHinglish: 'Chhutti se pehle primary classes mein rakhi-making activity conduct ki jaati hai.',
  },
  {
    id: 'janmashtami',
    name: 'Krishna Janmashtami',
    keywords: ['janmashtami', 'krishna janmashtami', 'krishna'],
    date: '2026-09-04',
    isHoliday: true,
    isCelebratedAtSchool: false,
    descriptionEn: 'Janmashtami marks the auspicious birth of Lord Krishna.',
    descriptionHinglish: 'Janmashtami Bhagwan Shri Krishna ke janmotsav ka tyohar hai.',
    statusEn: 'School will remain closed for Krishna Janmashtami.',
    statusHinglish: 'Krishna Janmashtami ke avsar par school band rahega.',
    celebrationEn: 'Primary wing hosts a colorful Radha-Krishna dress activity before the holiday.',
    celebrationHinglish: 'Chhutti se pehle primary wing mein Radha-Krishna dress-up aur bhajan celebration hoti hai.',
  },
  {
    id: 'teachers-day',
    name: "Teachers' Day",
    keywords: [
      'teachers day',
      "teachers' day",
      "teacher's day",
      'teacher day',
      'shikshak diwas',
      '5 september',
      '5th sep',
      'radhakrishnan'
    ],
    date: '2026-09-05',
    isHoliday: false, // School is open and celebrated
    isCelebratedAtSchool: true,
    descriptionEn: "Teachers' Day marks the birth anniversary of philosopher and former President of India, Dr. Sarvepalli Radhakrishnan.",
    descriptionHinglish: "Teachers' Day Dr. Sarvepalli Radhakrishnan ki birth anniversary ke samman mein manaya jata hai.",
    statusEn: "School is open as usual. Teachers' Day is celebrated with special assemblies and student activities.",
    statusHinglish: "School khula rahega. Teachers' Day par chhutti nahi hoti, balki teachers ke samman mein special programs hote hain.",
    celebrationEn: 'Senior students step into the roles of teachers, present cards, flowers, and organize a special cultural tribute for teachers and the Principal.',
    celebrationHinglish: 'Senior students ek din ke liye teacher bante hain aur sabhi teachers wa Principal Miss Pooja Sehgal ke liye special tribute program organise karte hain.',
  },
  {
    id: 'gandhi-jayanti',
    name: 'Mahatma Gandhi Jayanti',
    keywords: ['gandhi jayanti', 'gandhi', '2 october', '2 oct', 'bapu'],
    date: '2026-10-02',
    isHoliday: true,
    isCelebratedAtSchool: false,
    descriptionEn: 'Gandhi Jayanti celebrates the birth anniversary of the Father of the Nation, Mahatma Gandhi, observed as the International Day of Non-Violence.',
    descriptionHinglish: 'Mahatma Gandhi Jayanti Rashtrapita Bapu ki birth anniversary hai, jo non-violence ka sandesh deti hai.',
    statusEn: 'School will remain closed on account of Gandhi Jayanti (National Holiday).',
    statusHinglish: 'Gandhi Jayanti par national holiday hone ke karan school band rahega.',
    celebrationEn: 'Swachhata cleanliness drives and truth-themed assemblies are organized during the week.',
    celebrationHinglish: 'School mein Swachhata abhiyan aur truth-themed assembly conduct ki jaati hai.',
  },
  {
    id: 'dussehra',
    name: 'Dussehra (Vijayadashami)',
    keywords: ['dussehra', 'vijayadashami', 'vijayadashmi', 'dasara'],
    date: '2026-10-20',
    isHoliday: true,
    isCelebratedAtSchool: false,
    descriptionEn: 'Dussehra marks Lord Rama’s victory over Ravana and Goddess Durga’s victory over Mahishasura, symbolizing the triumph of good over evil.',
    descriptionHinglish: 'Dussehra burai par acchai aur adharm par dharm ki jeet ka prateek hai.',
    statusEn: 'School will remain closed for the Dussehra festival.',
    statusHinglish: 'Dussehra ke tyohar par school ki chhutti rahegi.',
    celebrationEn: 'Ramleela skits and moral storytelling are held in assemblies before the festival break.',
    celebrationHinglish: 'Tyohar se pehle assembly mein Ramleela skit aur moral storytelling sessions hote hain.',
  },
  {
    id: 'diwali',
    name: 'Diwali (Deepawali)',
    keywords: ['diwali', 'deepawali', 'deepavali', 'chhoti diwali', 'badi diwali', 'govardhan', 'bhai dooj', 'diya'],
    date: '2026-11-08',
    endDate: '2026-11-12',
    isHoliday: true,
    isCelebratedAtSchool: false,
    descriptionEn: 'Diwali is the festival of lights celebrating Lord Rama’s return to Ayodhya and the worship of Goddess Lakshmi.',
    descriptionHinglish: 'Diwali roshni aur khushiyon ka tyohar hai jo Bhagwan Shri Ram ke Ayodhya lautne ki khushi mein manaya jata hai.',
    statusEn: 'School will remain closed for the Diwali, Govardhan Puja, and Bhai Dooj festival break.',
    statusHinglish: 'Diwali, Govardhan Puja aur Bhai Dooj ke liye school mein festival holidays rahengi.',
    celebrationEn: 'Prior to the break, students engage in Diya decoration, rangoli contests, and green Diwali awareness pledges.',
    celebrationHinglish: 'Holidays se pehle school mein Diya decoration, rangoli competitions aur Green Diwali pledge li jaati hai.',
  },
  {
    id: 'childrens-day',
    name: "Children's Day (Bal Diwas)",
    keywords: [
      'childrens day',
      "children's day",
      'children day',
      "child's day",
      'bal diwas',
      '14 november',
      '14 nov',
      'nehru'
    ],
    date: '2026-11-14',
    isHoliday: false, // School is open and celebrated
    isCelebratedAtSchool: true,
    descriptionEn: "Children's Day commemorates the birth anniversary of India's first Prime Minister, Pandit Jawaharlal Nehru (Chacha Nehru).",
    descriptionHinglish: "Children's Day Pandit Jawaharlal Nehru (Chacha Nehru) ki birth anniversary ke roop mein manaya jata hai.",
    statusEn: "School is open as usual. Children's Day is celebrated with games, performances by teachers, and fun activities.",
    statusHinglish: "School khula rahega. Children's Day par chhutti nahi hoti, teachers students ke liye fun activities aur games organize karte hain.",
    celebrationEn: 'Teachers put on musical performances, skits, and games for students, with prizes and sweets distributed by the school.',
    celebrationHinglish: 'Teachers students ke liye special skits, songs aur games organize karte hain aur sweets distribute hoti hain.',
  },
  {
    id: 'guru-nanak-jayanti',
    name: 'Guru Nanak Jayanti (Gurpurab)',
    keywords: ['guru nanak', 'gurpurab', 'prakash parva'],
    date: '2026-11-24',
    isHoliday: true,
    isCelebratedAtSchool: false,
    descriptionEn: 'Guru Nanak Jayanti marks the birth anniversary of Guru Nanak Dev Ji, the first Sikh Guru and founder of Sikhism.',
    descriptionHinglish: 'Guru Nanak Jayanti Sikh dharm ke founder Guru Nanak Dev Ji ke janmotsav ke roop mein manayi jaati hai.',
    statusEn: 'School will remain closed for Guru Nanak Jayanti.',
    statusHinglish: 'Guru Nanak Jayanti (Gurpurab) ke avsar par school band rahega.',
    celebrationEn: 'Students learn about Guru Nanak Dev Ji’s teachings of equality, selfless service, and compassion.',
    celebrationHinglish: 'Assembly mein Guru Nanak Dev Ji ki sikhai hui equality aur seva ki shikshaon par charcha hoti hai.',
  },
  {
    id: 'christmas',
    name: 'Christmas',
    keywords: ['christmas', 'xmas', '25 december', '25 dec', 'bada din'],
    date: '2026-12-25',
    isHoliday: true,
    isCelebratedAtSchool: false,
    descriptionEn: 'Christmas celebrates the birth of Jesus Christ, symbolizing love, peace, and giving.',
    descriptionHinglish: 'Christmas Prabhu Jesus Christ ke janmotsav ka tyohar hai jo shanti aur prem ka sandesh deta hai.',
    statusEn: 'School will remain closed for Christmas Day.',
    statusHinglish: 'Christmas ke avsar par school band rahega.',
    celebrationEn: 'Before winter break, KKPS holds Christmas carols, Santa Claus visits, and classroom celebrations.',
    celebrationHinglish: 'Winter break se pehle school mein Christmas carols, Santa Claus visit aur festive activities hoti hain.',
  },
  {
    id: 'winter-break',
    name: 'Winter Vacation',
    keywords: ['winter break', 'winter vacation', 'sardi ki chhutti', 'winter holiday', 'winter holidays'],
    date: '2026-12-31',
    endDate: '2027-01-08',
    isHoliday: true,
    isCelebratedAtSchool: false,
    descriptionEn: 'Winter break as declared by the district administration and Uttar Pradesh state education department.',
    descriptionHinglish: 'District administration aur UP state education department ke nirdeshon par winter vacation.',
    statusEn: 'School will remain closed for students during the declared winter break dates.',
    statusHinglish: 'Winter break ke dauraan school band rehta hai. Confirmation ke liye school office mein 0512-2330410 par call kar sakte hain.',
    celebrationEn: 'Warm wishes for the New Year are shared with all families.',
    celebrationHinglish: 'Sabhi students aur families ko New Year ki shubhkaamnayein di jaati hain.',
  },
];

/**
 * Returns today's date in Asia/Kolkata timezone: YYYY-MM-DD
 */
export function getIndiaToday(): { dateStr: string; dayOfWeek: number; dayName: string; formatted: string } {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const dateStr = formatter.format(new Date()); // Returns YYYY-MM-DD

  const dayFormatter = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const formatted = dayFormatter.format(new Date());

  const dateObj = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  const dayOfWeek = dateObj.getDay(); // 0 = Sunday, 6 = Saturday
  const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });

  return { dateStr, dayOfWeek, dayName, formatted };
}

/**
 * Returns tomorrow's date in Asia/Kolkata timezone: YYYY-MM-DD
 */
export function getIndiaTomorrow(): { dateStr: string; dayOfWeek: number; dayName: string; formatted: string } {
  const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  now.setDate(now.getDate() + 1);

  const formatter = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const dateStr = formatter.format(now);

  const dayFormatter = new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const formatted = dayFormatter.format(now);

  const dayOfWeek = now.getDay();
  const dayName = now.toLocaleDateString('en-US', { weekday: 'long' });

  return { dateStr, dayOfWeek, dayName, formatted };
}

/**
 * Check if a date string falls within an event range
 */
function isDateMatch(targetDate: string, event: SchoolCalendarEvent): boolean {
  if (event.endDate) {
    return targetDate >= event.date && targetDate <= event.endDate;
  }
  return targetDate === event.date;
}

/**
 * Find calendar event matching target date (YYYY-MM-DD)
 */
export function getEventOnDate(dateStr: string): SchoolCalendarEvent | undefined {
  return SCHOOL_CALENDAR_EVENTS.find((e) => isDateMatch(dateStr, e));
}

/**
 * Find the next upcoming holiday or celebration from today (including ongoing if endDate >= today)
 */
export function getNextEvent(currentDateStr: string): SchoolCalendarEvent | undefined {
  const upcoming = SCHOOL_CALENDAR_EVENTS.filter((e) => (e.endDate || e.date) >= currentDateStr).sort(
    (a, b) => a.date.localeCompare(b.date)
  );
  return upcoming[0];
}

/**
 * Find the next upcoming event strictly AFTER today (date > currentDateStr)
 */
export function getNextUpcomingEvent(currentDateStr: string, onlyHolidays: boolean = false): SchoolCalendarEvent | undefined {
  const upcoming = SCHOOL_CALENDAR_EVENTS.filter((e) => {
    if (e.date <= currentDateStr) return false;
    if (onlyHolidays) return e.isHoliday;
    return true;
  }).sort((a, b) => a.date.localeCompare(b.date));
  return upcoming[0];
}

/**
 * Get upcoming events strictly after today
 */
export function getUpcomingEvents(currentDateStr: string, limit: number = 3): SchoolCalendarEvent[] {
  return SCHOOL_CALENDAR_EVENTS.filter((e) => (e.endDate || e.date) >= currentDateStr)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, limit);
}

/**
 * Find event by keyword (e.g. "diwali", "holi", "eid", "republic day", "teachers day", etc.)
 */
export function findEventByKeyword(query: string): SchoolCalendarEvent | undefined {
  const q = query.toLowerCase();
  const normalizedQ = q.replace(/['’]/g, '').trim();

  return SCHOOL_CALENDAR_EVENTS.find((event) => {
    // 1. Direct ID match
    if (q.includes(event.id) || normalizedQ.includes(event.id.replace(/-/g, ' '))) return true;

    // 2. Base name before parenthesis match (e.g. "Children's Day (Bal Diwas)" -> "childrens day")
    const baseName = event.name.split('(')[0].trim().toLowerCase().replace(/['’]/g, '');
    if (normalizedQ.includes(baseName)) return true;

    // 3. Clean full name match
    const fullNameClean = event.name.toLowerCase().replace(/['’]/g, '');
    if (normalizedQ.includes(fullNameClean)) return true;

    // 4. Keyword matches (both with original query and normalized query)
    return event.keywords.some((kw) => {
      const kwClean = kw.toLowerCase().replace(/['’]/g, '');
      return normalizedQ.includes(kwClean) || q.includes(kw.toLowerCase());
    });
  });
}
