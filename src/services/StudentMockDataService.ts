import { Student, Assignment, ScheduleItem, Announcement } from '../models/Student';

export const COURSES = ['Matematik', 'Fizik', 'Programlama', 'Biyoloji', 'Kimya', 'Tarih'];

export const STUDENTS: Student[] = [
  {
    id: 'student_1',
    name: 'Ahmet Yılmaz',
    email: 'ahmet.yilmaz@edu.com',
    course: 'Matematik',
    grade: 85,
    attendance: 92,
    createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 gün önce
    assignments: [
      { id: 'a1', title: 'Matematik Sınav 1', dueDate: '10 Mayıs', status: 'Tamamlandı' as const, grade: 85 },
      { id: 'a2', title: 'Fizik Proje', dueDate: '15 Mayıs', status: 'Devam Ediyor' as const, grade: null },
      { id: 'a3', title: 'Programlama Ödevi', dueDate: '20 Mayıs', status: 'Tamamlandı' as const, grade: 92 },
      { id: 'a4', title: 'Matematik Sınav 2', dueDate: '25 Mayıs', status: 'Planlandı' as const, grade: null },
    ],
    schedule: [
      { day: 'Pazartesi', time: '09:00', course: 'Matematik', room: '101' },
      { day: 'Pazartesi', time: '11:00', course: 'Fizik', room: '203' },
      { day: 'Salı', time: '10:00', course: 'Kimya', room: '105' },
      { day: 'Çarşamba', time: '09:00', course: 'Programlama', room: 'Lab-1' },
      { day: 'Perşembe', time: '13:00', course: 'Matematik', room: '101' },
      { day: 'Cuma', time: '14:00', course: 'Fizik', room: '203' },
    ],
    performance: [65, 70, 85, 75, 90], // Son 5 haftalık performans
  },
  {
    id: 'student_2',
    name: 'Ayşe Demir',
    email: 'ayse.demir@edu.com',
    course: 'Fizik',
    grade: 92,
    attendance: 95,
    createdAt: Date.now() - 45 * 24 * 60 * 60 * 1000, // 45 gün önce
    assignments: [
      { id: 'a1', title: 'Fizik Sınav 1', dueDate: '12 Mayıs', status: 'Tamamlandı' as const, grade: 95 },
      { id: 'a2', title: 'Kimya Proje', dueDate: '18 Mayıs', status: 'Devam Ediyor' as const, grade: null },
      { id: 'a3', title: 'Fizik Laboratuvar', dueDate: '22 Mayıs', status: 'Tamamlandı' as const, grade: 90 },
    ],
    schedule: [
      { day: 'Pazartesi', time: '09:00', course: 'Fizik', room: '203' },
      { day: 'Salı', time: '11:00', course: 'Matematik', room: '101' },
      { day: 'Çarşamba', time: '10:00', course: 'Biyoloji', room: '105' },
      { day: 'Perşembe', time: '09:00', course: 'Fizik Lab', room: 'Lab-2' },
      { day: 'Cuma', time: '13:00', course: 'Kimya', room: '104' },
    ],
    performance: [75, 82, 88, 90, 92], // Son 5 haftalık performans
  },
  {
    id: 'student_3',
    name: 'Mehmet Kaya',
    email: 'mehmet.kaya@edu.com',
    course: 'Programlama',
    grade: 78,
    attendance: 85,
    createdAt: Date.now() - 60 * 24 * 60 * 60 * 1000, // 60 gün önce
    assignments: [
      { id: 'a1', title: 'Programlama Sınav 1', dueDate: '8 Mayıs', status: 'Tamamlandı' as const, grade: 75 },
      { id: 'a2', title: 'Web Projesi', dueDate: '20 Mayıs', status: 'Devam Ediyor' as const, grade: null },
      { id: 'a3', title: 'Algoritma Ödevi', dueDate: '15 Mayıs', status: 'Tamamlandı' as const, grade: 80 },
    ],
    schedule: [
      { day: 'Pazartesi', time: '10:00', course: 'Algoritma', room: 'Lab-3' },
      { day: 'Salı', time: '13:00', course: 'Programlama', room: 'Lab-1' },
      { day: 'Çarşamba', time: '09:00', course: 'Matematik', room: '101' },
      { day: 'Perşembe', time: '14:00', course: 'Veri Yapıları', room: 'Lab-2' },
      { day: 'Cuma', time: '11:00', course: 'Web Geliştirme', room: 'Lab-4' },
    ],
    performance: [60, 68, 75, 78, 82], // Son 5 haftalık performans
  }
];

export const ANNOUNCEMENTS: Announcement[] = [
  { 
    id: 'ann_1',
    title: 'Online Ders', 
    content: 'Yarınki Matematik dersi online yapılacaktır.', 
    date: '5 Mayıs',
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000 // 2 gün önce
  },
  { 
    id: 'ann_2',
    title: 'Proje Teslimi', 
    content: 'Programlama projesi son teslim tarihi uzatılmıştır.', 
    date: '3 Mayıs',
    createdAt: Date.now() - 4 * 24 * 60 * 60 * 1000 // 4 gün önce
  },
  { 
    id: 'ann_3',
    title: 'Sınav Duyurusu', 
    content: 'Fizik sınavı 15 Mayıs tarihinde yapılacaktır. Tüm konular dahildir.', 
    date: '1 Mayıs',
    createdAt: Date.now() - 6 * 24 * 60 * 60 * 1000 // 6 gün önce
  },
  { 
    id: 'ann_4',
    title: 'Okul Gezisi', 
    content: 'Bilim Müzesi gezisi 20 Mayıs tarihinde gerçekleştirilecektir.', 
    date: '29 Nisan',
    createdAt: Date.now() - 8 * 24 * 60 * 60 * 1000 // 8 gün önce
  }
];

/**
 * Find a student by email
 */
export const findStudentByEmail = (email: string): Student | undefined => {
  return STUDENTS.find(student => student.email.toLowerCase() === email.toLowerCase());
};

/**
 * Get all students
 */
export const getAllStudents = (): Student[] => {
  return [...STUDENTS];
};

/**
 * Get all announcements
 */
export const getAllAnnouncements = () => {
  return [...ANNOUNCEMENTS];
}; 