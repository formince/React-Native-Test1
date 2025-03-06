import AsyncStorage from '@react-native-async-storage/async-storage';
import { Student } from '../models/Student';
import { 
  STUDENTS, 
  ANNOUNCEMENTS, 
  findStudentByEmail, 
  getAllStudents as getMockStudents,
  getAllAnnouncements as getMockAnnouncements
} from './StudentMockDataService';

const STORAGE_KEYS = {
  STUDENTS: 'students_data',
  ANNOUNCEMENTS: 'announcements_data',
  INITIALIZED: 'student_data_initialized'
};

/**
 * Initialize student data in AsyncStorage if first run
 */
export const initializeStudentData = async (): Promise<void> => {
  try {
    const initialized = await AsyncStorage.getItem(STORAGE_KEYS.INITIALIZED);
    
    if (!initialized) {
      // Store mock data to AsyncStorage
      await AsyncStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(STUDENTS));
      await AsyncStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(ANNOUNCEMENTS));
      await AsyncStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
      
      console.log('Student data initialized with mock data');
    }
  } catch (error) {
    console.error('Error initializing student data:', error);
    throw error;
  }
};

/**
 * Get student by email
 */
export const getStudentByEmail = async (email: string): Promise<Student | null> => {
  try {
    // First, try to get from AsyncStorage
    const studentsJson = await AsyncStorage.getItem(STORAGE_KEYS.STUDENTS);
    let students: Student[] = [];
    
    if (studentsJson) {
      students = JSON.parse(studentsJson);
      const student = students.find(s => s.email.toLowerCase() === email.toLowerCase());
      if (student) return student;
    }
    
    // If not found or AsyncStorage not set up yet, use mock data
    return findStudentByEmail(email) || null;
  } catch (error) {
    console.error('Error getting student by email:', error);
    // Fallback to mock data
    return findStudentByEmail(email) || null;
  }
};

/**
 * Get all students
 */
export const getAllStudents = async (): Promise<Student[]> => {
  try {
    // First, try to get from AsyncStorage
    const studentsJson = await AsyncStorage.getItem(STORAGE_KEYS.STUDENTS);
    
    if (studentsJson) {
      return JSON.parse(studentsJson);
    }
    
    // If AsyncStorage not set up yet, use mock data
    return getMockStudents();
  } catch (error) {
    console.error('Error getting all students:', error);
    // Fallback to mock data
    return getMockStudents();
  }
};

/**
 * Get all announcements
 */
export const getAllAnnouncements = async () => {
  try {
    // First, try to get from AsyncStorage
    const announcementsJson = await AsyncStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS);
    
    if (announcementsJson) {
      return JSON.parse(announcementsJson);
    }
    
    // If AsyncStorage not set up yet, use mock data
    return getMockAnnouncements();
  } catch (error) {
    console.error('Error getting announcements:', error);
    // Fallback to mock data
    return getMockAnnouncements();
  }
};

/**
 * Update student data
 */
export const updateStudentData = async (updatedStudent: Student): Promise<boolean> => {
  try {
    // Get current students
    const students = await getAllStudents();
    const index = students.findIndex(s => s.id === updatedStudent.id);
    
    if (index === -1) return false;
    
    // Update student
    students[index] = updatedStudent;
    
    // Save back to AsyncStorage
    await AsyncStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    return true;
  } catch (error) {
    console.error('Error updating student:', error);
    return false;
  }
}; 