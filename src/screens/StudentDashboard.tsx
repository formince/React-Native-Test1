import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function StudentDashboard() {
  const navigation = useNavigation();

  const schedule = [
    { time: '09:00', course: 'Matematik', room: '101' },
    { time: '11:00', course: 'Fizik', room: '203' },
    { time: '14:00', course: 'Programlama', room: 'Lab-1' },
  ];

  const grades = [
    { course: 'Matematik', midterm: 85, final: 90 },
    { course: 'Fizik', midterm: 75, final: 88 },
    { course: 'Programlama', midterm: 95, final: 92 },
  ];

  const announcements = [
    { title: 'Online Ders', content: 'Yarınki Matematik dersi online yapılacaktır.' },
    { title: 'Proje Teslimi', content: 'Programlama projesi son teslim tarihi uzatılmıştır.' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Hoş Geldin, Öğrenci</Text>
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
            <Text style={styles.scheduleTime}>{item.time}</Text>
            <View style={styles.scheduleDetails}>
              <Text style={styles.scheduleText}>{item.course}</Text>
              <Text style={styles.roomText}>Sınıf: {item.room}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notlarım</Text>
        {grades.map((item, index) => (
          <View key={index} style={styles.gradeItem}>
            <Text style={styles.courseText}>{item.course}</Text>
            <View style={styles.grades}>
              <Text style={styles.gradeText}>Vize: {item.midterm}</Text>
              <Text style={styles.gradeText}>Final: {item.final}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Duyurular</Text>
        {announcements.map((item, index) => (
          <View key={index} style={styles.announcementItem}>
            <Text style={styles.announcementTitle}>{item.title}</Text>
            <Text style={styles.announcementContent}>{item.content}</Text>
          </View>
        ))}
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
    marginBottom: 15,
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 8,
  },
  scheduleTime: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
    width: 80,
  },
  scheduleDetails: {
    flex: 1,
  },
  scheduleText: {
    fontSize: 16,
    color: '#333',
  },
  roomText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  gradeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 8,
  },
  courseText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  grades: {
    flexDirection: 'row',
  },
  gradeText: {
    fontSize: 14,
    color: '#2196F3',
    marginLeft: 15,
    fontWeight: '500',
  },
  announcementItem: {
    marginBottom: 15,
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
  },
  announcementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  announcementContent: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
}); 