import { Student } from '../models/Student';

export const COURSES = ['Matematik', 'Fizik', 'Programlama', 'Biyoloji', 'Kimya', 'Tarih'];

const STUDENT_NAMES = [
  'Ahmet Yılmaz', 'Ayşe Demir', 'Mehmet Kaya', 'Zeynep Çelik', 'Mustafa Aydın', 
  'Fatma Şahin', 'Ali Öztürk', 'Seda Arslan', 'Can Aksoy', 'Ece Kılıç',
  'Burak Yıldız', 'Deniz Aslan', 'Elif Çetin', 'Eren Özkan', 'Gamze Koç',
  'Hasan Güneş', 'İrem Polat', 'Kemal Doğan', 'Leyla Yalçın', 'Murat Şen'
];

/**
 * Generate a mock student
 */
const generateMockStudent = (id: number): Student => {
  const name = STUDENT_NAMES[Math.floor(Math.random() * STUDENT_NAMES.length)];
  const course = COURSES[Math.floor(Math.random() * COURSES.length)];
  const nameParts = name.toLowerCase().split(' ');
  const email = `${nameParts[0]}.${nameParts[1]}@edu.com`;
  
  return {
    id: `student_${id}`,
    name,
    email,
    course,
    grade: Math.floor(Math.random() * 51) + 50, // 50-100
    attendance: Math.floor(Math.random() * 31) + 70, // 70-100%
    createdAt: Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000) // Random date within last 30 days
  };
};

/**
 * Generate an array of mock students
 */
export const generateMockStudents = (count: number): Student[] => {
  return Array.from({ length: count }, (_, index) => generateMockStudent(index + 1));
}; 