export interface Student {
  id: string;
  name: string;
  email: string;
  course: string;
  grade: number;
  attendance: number; // percentage of attendance
  photo?: string; // optional URL for student photo
  createdAt: number; // timestamp
  
  // Additional fields for extended student data
  assignments?: Assignment[];
  schedule?: ScheduleItem[];
  performance?: number[]; // performance data points
}

export interface Assignment {
  id: string;
  title: string;
  dueDate: string;
  status: 'Tamamlandı' | 'Devam Ediyor' | 'Planlandı';
  grade: number | null;
}

export interface ScheduleItem {
  day: string;
  time: string;
  course: string;
  room: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  createdAt: number;
}

export type StudentFilter = {
  search?: string;
  course?: string;
  minGrade?: number;
  maxGrade?: number;
}

export type SortOption = 'name' | 'grade' | 'course' | 'createdAt';
export type SortDirection = 'asc' | 'desc';

export type StudentSort = {
  by: SortOption;
  direction: SortDirection;
} 