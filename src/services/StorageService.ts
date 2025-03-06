import AsyncStorage from '@react-native-async-storage/async-storage';
import { Student, StudentFilter, StudentSort } from '../models/Student';
import { generateMockStudents } from './MockDataService';

const STORAGE_KEYS = {
  STUDENTS: 'students',
  INITIALIZED: 'initialized'
};

/**
 * Initialize the application with mock data if first run
 */
export const initializeStorage = async (): Promise<void> => {
  const initialized = await AsyncStorage.getItem(STORAGE_KEYS.INITIALIZED);
  
  if (!initialized) {
    const mockStudents = generateMockStudents(15);
    await AsyncStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(mockStudents));
    await AsyncStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
  }
};

/**
 * Get all students from storage
 */
export const getAllStudents = async (): Promise<Student[]> => {
  const studentsJson = await AsyncStorage.getItem(STORAGE_KEYS.STUDENTS);
  return studentsJson ? JSON.parse(studentsJson) : [];
};

/**
 * Get a student by ID
 */
export const getStudentById = async (id: string): Promise<Student | null> => {
  const students = await getAllStudents();
  return students.find(student => student.id === id) || null;
};

/**
 * Add a new student
 */
export const addStudent = async (student: Omit<Student, 'id' | 'createdAt'>): Promise<Student> => {
  const students = await getAllStudents();
  
  const newStudent: Student = {
    ...student,
    id: Date.now().toString(),
    createdAt: Date.now()
  };
  
  students.push(newStudent);
  await AsyncStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  
  return newStudent;
};

/**
 * Update an existing student
 */
export const updateStudent = async (updatedStudent: Student): Promise<Student | null> => {
  const students = await getAllStudents();
  const index = students.findIndex(s => s.id === updatedStudent.id);
  
  if (index === -1) return null;
  
  students[index] = updatedStudent;
  await AsyncStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  
  return updatedStudent;
};

/**
 * Delete a student
 */
export const deleteStudent = async (id: string): Promise<boolean> => {
  const students = await getAllStudents();
  const filteredStudents = students.filter(student => student.id !== id);
  
  if (filteredStudents.length === students.length) {
    return false; // No student was removed
  }
  
  await AsyncStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(filteredStudents));
  return true;
};

/**
 * Filter and sort students
 */
export const filterAndSortStudents = async (
  filter?: StudentFilter,
  sort?: StudentSort
): Promise<Student[]> => {
  let students = await getAllStudents();
  
  // Apply filters
  if (filter) {
    if (filter.search) {
      const searchTerm = filter.search.toLowerCase();
      students = students.filter(student => 
        student.name.toLowerCase().includes(searchTerm) || 
        student.email.toLowerCase().includes(searchTerm)
      );
    }
    
    if (filter.course) {
      students = students.filter(student => 
        student.course.toLowerCase() === filter.course?.toLowerCase()
      );
    }
    
    if (filter.minGrade !== undefined) {
      students = students.filter(student => student.grade >= filter.minGrade!);
    }
    
    if (filter.maxGrade !== undefined) {
      students = students.filter(student => student.grade <= filter.maxGrade!);
    }
  }
  
  // Apply sorting
  if (sort) {
    students.sort((a, b) => {
      let comparison = 0;
      
      switch (sort.by) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'grade':
          comparison = a.grade - b.grade;
          break;
        case 'course':
          comparison = a.course.localeCompare(b.course);
          break;
        case 'createdAt':
          comparison = a.createdAt - b.createdAt;
          break;
      }
      
      return sort.direction === 'asc' ? comparison : -comparison;
    });
  }
  
  return students;
}; 