export interface KhatmahPlan {
  startDate: string;
  targetDays: number;
  pagesRead: number;
  history: { date: string; pages: number }[];
}

export interface Bookmark {
  id: string;
  page: number;
  ayahNumber: number;
  surahName: string;
  text: string;
  date: string;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'sepia';
  notificationsEnabled: boolean;
  notificationTimes: string[]; // e.g., ["05:30", "22:00"]
}

export interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  surah: {
    number: number;
    name: string;
  };
  juz: number;
  page: number;
}

export interface QuranPageData {
  number: number;
  ayahs: Ayah[];
}
