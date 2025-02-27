import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function TeacherDashboard() {
  const navigation = useNavigation();
  const [newAnnouncement, setNewAnnouncement] = useState('');

  const students = [
    { id: 1, name: 'Ahmet Yılmaz', course: 'Matematik', grade: 85 },
    { id: 2, name: 'Ayşe Demir', course: 'Matematik', grade: 92 },
    { id: 3, name: 'Mehmet Kaya', course: 'Fizik', grade: 78 },
    { id: 4, name: 'Zeynep Çelik', course: 'Fizik', grade: 95 },
    { id: 5, name: 'Can Öztürk', course: 'Programlama', grade: 88 },
  ];

  const schedule = [
    { time: '10:00', course: 'Matematik', class: '10-A' },
    { time: '13:00', course: 'Fizik', class: '11-B' },
    { time: '15:00', course: 'Programlama', class: '12-C' },
  ];

  const handleCreateAnnouncement = () => {
    if (newAnnouncement.trim()) {
      Alert.alert('Başarılı', 'Duyuru oluşturuldu!');
      setNewAnnouncement('');
    } else {
      Alert.alert('Hata', 'Lütfen duyuru içeriği giriniz.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Hoş Geldin, Öğretmen</Text>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => navigation.navigate('Welcome' as never)}
        >
          <Text style={styles.logoutText}>Çıkış</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bugünkü Ders Programı</Text>
        {schedule.map((item, index) => (
          <View key={index} style={styles.scheduleItem}>
            <Text style={styles.timeText}>{item.time}</Text>
            <View style={styles.classInfo}>
              <Text style={styles.courseText}>{item.course}</Text>
              <Text style={styles.classText}>Sınıf: {item.class}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Öğrenci Listesi ve Notlar</Text>
        {students.map((student) => (
          <View key={student.id} style={styles.studentItem}>
            <View style={styles.studentInfo}>
              <Text style={styles.studentName}>{student.name}</Text>
              <Text style={styles.studentCourse}>{student.course}</Text>
            </View>
            <View style={styles.gradeContainer}>
              <Text style={styles.gradeText}>{student.grade}</Text>
              <TouchableOpacity style={styles.editButton}>
                <Text style={styles.editButtonText}>Düzenle</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Yeni Duyuru Oluştur</Text>
        <TextInput
          style={styles.announcementInput}
          placeholder="Duyuru içeriğini yazın..."
          value={newAnnouncement}
          onChangeText={setNewAnnouncement}
          multiline
          numberOfLines={4}
        />
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateAnnouncement}
        >
          <Text style={styles.createButtonText}>Duyuru Oluştur</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#2196F3',
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  logoutButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 8,
    borderRadius: 8,
  },
  logoutText: {
    color: 'white',
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: 'white',
    margin: 10,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 8,
  },
  timeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
    width: 80,
  },
  classInfo: {
    flex: 1,
  },
  courseText: {
    fontSize: 16,
    color: '#333',
  },
  classText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  studentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  studentCourse: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  gradeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gradeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
    marginRight: 10,
  },
  editButton: {
    backgroundColor: '#2196F3',
    padding: 6,
    borderRadius: 6,
  },
  editButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  announcementInput: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    height: 100,
    textAlignVertical: 'top',
  },
  createButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 