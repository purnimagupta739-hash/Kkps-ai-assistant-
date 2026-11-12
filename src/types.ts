export interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isError?: boolean;
}

export interface SchoolInfoData {
  name: string;
  shortName: string;
  principal: string;
  city: string;
  address: string;
  board: string;
  timings: {
    summer: string;
    winter: string;
  };
  contacts: {
    office: string;
    handbookMobile: string;
  };
  note: string;
}

export interface QuickPrompt {
  id: string;
  text: string;
  lang: 'en' | 'hi' | 'hinglish';
  label: string;
}

export type ThemeMode = 'dark' | 'light';

export interface SavedConversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
}
