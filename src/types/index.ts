export interface SubTopic {
  id: string;
  title: string;
  completed: boolean;
  scheduledDate: Date | null;
  subtopics: SubTopic[];
  url?: string;
}

export interface Topic {
  id: string;
  title: string;
  completed: boolean;
  subtopics: SubTopic[];
  scheduledDate: Date | null;
}

export interface Subject {
  id: string;
  title: string;
  icon: string;
  description: string;
  topics: Topic[];
  schedule: Schedule;
}

export interface Schedule {
  startDate: Date;
  totalDays: number;
  endDate: Date;
}

export interface AppState {
  subjects: Subject[];
  schedule: Schedule;
  lastUpdated: Date;
}

export interface DailyTopic {
  id: string;
  subjectId: string;
  subjectTitle: string;
  topicTitle: string;
  completed: boolean;
}

export type ThemeMode = 'light' | 'dark';

export interface ThemeState {
  mode: ThemeMode;
}