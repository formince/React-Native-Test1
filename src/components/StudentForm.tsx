import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Student } from '../models/Student';
import { COURSES } from '../services/MockDataService';

interface StudentFormProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (student: Omit<Student, 'id' | 'createdAt'> | Student) => void;
  student?: Student; // If provided, we're in edit mode
}

const StudentForm: React.FC<StudentFormProps> = ({
  isVisible,
  onClose,
  onSave,
  student,
}) => {
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [course, setCourse] = useState(COURSES[0]);
  const [grade, setGrade] = useState('');
  const [attendance, setAttendance] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form when editing a student
  useEffect(() => {
    if (student) {
      setName(student.name);
      setEmail(student.email);
      setCourse(student.course);
      setGrade(student.grade.toString());
      setAttendance(student.attendance.toString());
    } else {
      resetForm();
    }
  }, [student, isVisible]);

  // Reset form
  const resetForm = () => {
    setName('');
    setEmail('');
    setCourse(COURSES[0]);
    setGrade('');
    setAttendance('');
    setErrors({});
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'İsim zorunludur';
    }

    if (!email.trim()) {
      newErrors.email = 'Email zorunludur';
    } else if (!email.includes('@')) {
      newErrors.email = 'Geçerli bir email adresi giriniz';
    }

    if (!grade) {
      newErrors.grade = 'Not zorunludur';
    } else {
      const gradeValue = Number(grade);
      if (isNaN(gradeValue) || gradeValue < 0 || gradeValue > 100) {
        newErrors.grade = 'Not 0-100 arasında olmalıdır';
      }
    }

    if (!attendance) {
      newErrors.attendance = 'Devam yüzdesi zorunludur';
    } else {
      const attendanceValue = Number(attendance);
      if (isNaN(attendanceValue) || attendanceValue < 0 || attendanceValue > 100) {
        newErrors.attendance = 'Devam yüzdesi 0-100 arasında olmalıdır';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle save
  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    const studentData = {
      name,
      email,
      course,
      grade: Number(grade),
      attendance: Number(attendance),
      ...(student ? { id: student.id, createdAt: student.createdAt } : {}),
    };

    onSave(studentData as any);
    onClose();
    resetForm();
  };

  // Handle cancel
  const handleCancel = () => {
    if (name || email || grade || attendance) {
      Alert.alert(
        'Değişiklikler Kaydedilmedi',
        'Yaptığınız değişiklikler kaydedilmeyecek. Devam etmek istiyor musunuz?',
        [
          { text: 'İptal', style: 'cancel' },
          { text: 'Devam', onPress: () => { onClose(); resetForm(); } },
        ]
      );
    } else {
      onClose();
      resetForm();
    }
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleCancel}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {student ? 'Öğrenci Düzenle' : 'Yeni Öğrenci Ekle'}
          </Text>

          <ScrollView style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>İsim</Text>
              <TextInput
                style={[styles.input, errors.name ? styles.inputError : null]}
                value={name}
                onChangeText={setName}
                placeholder="Öğrenci adı ve soyadı"
              />
              {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[styles.input, errors.email ? styles.inputError : null]}
                value={email}
                onChangeText={setEmail}
                placeholder="ornek@edu.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Kurs</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={course}
                  onValueChange={(itemValue: string) => setCourse(itemValue)}
                  style={styles.picker}
                >
                  {COURSES.map((c: string) => (
                    <Picker.Item key={c} label={c} value={c} />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Not</Text>
              <TextInput
                style={[styles.input, errors.grade ? styles.inputError : null]}
                value={grade}
                onChangeText={setGrade}
                placeholder="0-100"
                keyboardType="numeric"
              />
              {errors.grade ? <Text style={styles.errorText}>{errors.grade}</Text> : null}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Devam (%)</Text>
              <TextInput
                style={[styles.input, errors.attendance ? styles.inputError : null]}
                value={attendance}
                onChangeText={setAttendance}
                placeholder="0-100"
                keyboardType="numeric"
              />
              {errors.attendance ? (
                <Text style={styles.errorText}>{errors.attendance}</Text>
              ) : null}
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}
            >
              <Text style={styles.buttonText}>İptal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
            >
              <Text style={styles.buttonText}>Kaydet</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    width: '90%',
    maxHeight: '80%',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  formContainer: {
    maxHeight: 400,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#F44336',
  },
  errorText: {
    color: '#F44336',
    fontSize: 14,
    marginTop: 5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  picker: {
    height: 50,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: '#9E9E9E',
  },
  saveButton: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default StudentForm; 