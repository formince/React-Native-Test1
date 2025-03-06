import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Image,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { initializeStudentData, getStudentByEmail, getAllAnnouncements } from '../services/StudentStorageService';
import { Student } from '../models/Student';

const { width } = Dimensions.get('window');

// Dummy data for student performance graph
const performanceData = [65, 70, 85, 75, 90];

const StudentDashboard: React.FC = () => {
  const navigation = useNavigation();
  const [studentInfo, setStudentInfo] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [performanceData, setPerformanceData] = useState<number[]>([65, 70, 85, 75, 90]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  
  // Fixed email for demo purposes (in real app, would come from authentication)
  const studentEmail = 'ahmet.yilmaz@edu.com';

  useEffect(() => {
    const setup = async () => {
      try {
        // Initialize storage with sample data on first run
        await initializeStudentData();
        await loadStudentInfo();
      } catch (error) {
        console.error('Setup error:', error);
      } finally {
        setLoading(false);
      }
    };

    setup();
  }, []);

  const loadStudentInfo = async () => {
    try {
      // Get student by email
      const student = await getStudentByEmail(studentEmail);
      
      if (student) {
        setStudentInfo(student);
        
        // If there's performance data, set it
        if (student.performance) {
          setPerformanceData(student.performance);
        }
      }
    } catch (error) {
      console.error('Load student info error:', error);
    }
  };

  const loadAnnouncements = async () => {
    try {
      const data = await getAllAnnouncements();
      setAnnouncements(data);
    } catch (error) {
      console.error('Load announcements error:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadStudentInfo();
    await loadAnnouncements();
    setRefreshing(false);
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const getGradeColor = (grade: number) => {
    if (grade >= 85) return '#4CAF50'; // Green
    if (grade >= 70) return '#2196F3'; // Blue
    if (grade >= 60) return '#FF9800'; // Orange
    return '#F44336'; // Red
  };

  const getGradeText = (grade: number) => {
    if (grade >= 85) return 'Mükemmel';
    if (grade >= 70) return 'İyi';
    if (grade >= 60) return 'Orta';
    return 'Geliştirilebilir';
  };

  const getAttendanceColor = (attendance: number) => {
    if (attendance >= 90) return '#4CAF50'; // Green
    if (attendance >= 80) return '#2196F3'; // Blue
    if (attendance >= 70) return '#FF9800'; // Orange
    return '#F44336'; // Red
  };

  // Render loading indicator
  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </View>
    );
  }

  // Render no student found
  if (!studentInfo) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Öğrenci bilgisi bulunamadı.</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Welcome' as never)}
        >
          <Text style={styles.buttonText}>Çıkış Yap</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Render tabs based on active tab
  const renderTabContent = () => {
    switch(activeTab) {
      case 'overview':
        return (
          <>
            {/* Student Info Card */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.avatarContainer}>
                  <Text style={styles.avatarText}>
                    {studentInfo.name.split(' ').map(n => n[0]).join('')}
                  </Text>
                </View>
                <View style={styles.nameContainer}>
                  <Text style={styles.nameText}>{studentInfo.name}</Text>
                  <Text style={styles.emailText}>{studentInfo.email}</Text>
                </View>
              </View>
            </View>

            {/* Course and Grade Card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Kurs Bilgisi</Text>
              
              <View style={styles.courseContainer}>
                <Text style={styles.courseLabel}>Kurs</Text>
                <Text style={styles.courseValue}>{studentInfo.course}</Text>
              </View>
              
              <View style={styles.gradeContainer}>
                <View style={styles.gradeItem}>
                  <Text style={styles.gradeLabel}>Not</Text>
                  <View style={[styles.gradeBadge, { backgroundColor: getGradeColor(studentInfo.grade) }]}>
                    <Text style={styles.gradeText}>{studentInfo.grade}</Text>
                  </View>
                  <Text style={[styles.gradeStatus, { color: getGradeColor(studentInfo.grade) }]}>
                    {getGradeText(studentInfo.grade)}
                  </Text>
                </View>
                
                <View style={styles.gradeItem}>
                  <Text style={styles.gradeLabel}>Devam</Text>
                  <View style={[styles.attendanceBadge, { backgroundColor: getAttendanceColor(studentInfo.attendance) }]}>
                    <Text style={styles.gradeText}>%{studentInfo.attendance}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Performance Chart Card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Performans Grafiği</Text>
              <View style={styles.chartContainer}>
                {performanceData.map((value, index) => (
                  <View key={index} style={styles.chartColumn}>
                    <View 
                      style={[
                        styles.chartBar, 
                        { 
                          height: value, 
                          backgroundColor: getGradeColor(value) 
                        }
                      ]} 
                    />
                    <Text style={styles.chartLabel}>Hafta {index + 1}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.chartLegend}>
                <Text style={styles.chartLegendText}>Son 5 haftalık performans</Text>
              </View>
            </View>
          </>
        );
      
      case 'schedule':
        return (
          <>
            {/* Daily Schedule Card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Haftalık Program</Text>
              
              {studentInfo.schedule ? 
                studentInfo.schedule.map((item, index) => (
                  <View key={index} style={styles.scheduleItem}>
                    <View style={styles.dayContainer}>
                      <Text style={styles.dayText}>{item.day}</Text>
                    </View>
                    <Text style={styles.scheduleTime}>{item.time}</Text>
                    <View style={styles.scheduleDetails}>
                      <Text style={styles.scheduleText}>{item.course}</Text>
                      <Text style={styles.roomText}>Sınıf: {item.room}</Text>
                    </View>
                  </View>
                )) :
                // Fallback to default schedule if none in student data
                [
                  { day: 'Pazartesi', time: '09:00', course: 'Matematik', room: '101' },
                  { day: 'Pazartesi', time: '11:00', course: 'Fizik', room: '203' },
                  { day: 'Salı', time: '10:00', course: 'Kimya', room: '105' },
                  { day: 'Çarşamba', time: '09:00', course: 'Programlama', room: 'Lab-1' },
                  { day: 'Perşembe', time: '13:00', course: 'Matematik', room: '101' },
                  { day: 'Cuma', time: '14:00', course: 'Fizik', room: '203' },
                ].map((item, index) => (
                  <View key={index} style={styles.scheduleItem}>
                    <View style={styles.dayContainer}>
                      <Text style={styles.dayText}>{item.day}</Text>
                    </View>
                    <Text style={styles.scheduleTime}>{item.time}</Text>
                    <View style={styles.scheduleDetails}>
                      <Text style={styles.scheduleText}>{item.course}</Text>
                      <Text style={styles.roomText}>Sınıf: {item.room}</Text>
                    </View>
                  </View>
                ))
              }
            </View>
          </>
        );
      
      case 'assignments':
        return (
          <>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Ödevler ve Projeler</Text>
              
              {studentInfo.assignments ? 
                studentInfo.assignments.map((item, index) => (
                  <View key={index} style={styles.assignmentItem}>
                    <View style={styles.assignmentHeader}>
                      <Text style={styles.assignmentTitle}>{item.title}</Text>
                      <View style={[
                        styles.statusBadge, 
                        { 
                          backgroundColor: item.status === 'Tamamlandı' 
                            ? '#4CAF50' 
                            : item.status === 'Devam Ediyor' 
                              ? '#FF9800' 
                              : '#2196F3'
                        }
                      ]}>
                        <Text style={styles.statusText}>{item.status}</Text>
                      </View>
                    </View>
                    <View style={styles.assignmentDetails}>
                      <Text style={styles.dueDateText}>Teslim: {item.dueDate}</Text>
                      {item.grade !== null && (
                        <Text style={styles.assignmentGrade}>Not: {item.grade}</Text>
                      )}
                    </View>
                  </View>
                )) :
                // Fallback to default assignments if none in student data
                [
                  { title: 'Matematik Sınav 1', dueDate: '10 Mayıs', status: 'Tamamlandı', grade: 85 },
                  { title: 'Fizik Proje', dueDate: '15 Mayıs', status: 'Devam Ediyor', grade: null },
                  { title: 'Programlama Ödevi', dueDate: '20 Mayıs', status: 'Tamamlandı', grade: 92 },
                  { title: 'Matematik Sınav 2', dueDate: '25 Mayıs', status: 'Planlandı', grade: null },
                ].map((item, index) => (
                  <View key={index} style={styles.assignmentItem}>
                    <View style={styles.assignmentHeader}>
                      <Text style={styles.assignmentTitle}>{item.title}</Text>
                      <View style={[
                        styles.statusBadge, 
                        { 
                          backgroundColor: item.status === 'Tamamlandı' 
                            ? '#4CAF50' 
                            : item.status === 'Devam Ediyor' 
                              ? '#FF9800' 
                              : '#2196F3'
                        }
                      ]}>
                        <Text style={styles.statusText}>{item.status}</Text>
                      </View>
                    </View>
                    <View style={styles.assignmentDetails}>
                      <Text style={styles.dueDateText}>Teslim: {item.dueDate}</Text>
                      {item.grade !== null && (
                        <Text style={styles.assignmentGrade}>Not: {item.grade}</Text>
                      )}
                    </View>
                  </View>
                ))
              }
            </View>
          </>
        );
      
      case 'announcements':
        return (
          <>
            {/* Announcements Card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Duyurular</Text>
              
              {announcements.length > 0 ? 
                announcements.map((item, index) => (
                  <View key={index} style={styles.announcementItem}>
                    <View style={styles.announcementHeader}>
                      <Text style={styles.announcementTitle}>{item.title}</Text>
                      <Text style={styles.announcementDate}>{item.date}</Text>
                    </View>
                    <Text style={styles.announcementContent}>{item.content}</Text>
                  </View>
                )) :
                // Fallback to default announcements if none loaded
                [
                  { title: 'Online Ders', content: 'Yarınki Matematik dersi online yapılacaktır.', date: '5 Mayıs' },
                  { title: 'Proje Teslimi', content: 'Programlama projesi son teslim tarihi uzatılmıştır.', date: '3 Mayıs' },
                  { title: 'Sınav Duyurusu', content: 'Fizik sınavı 15 Mayıs tarihinde yapılacaktır. Tüm konular dahildir.', date: '1 Mayıs' },
                  { title: 'Okul Gezisi', content: 'Bilim Müzesi gezisi 20 Mayıs tarihinde gerçekleştirilecektir.', date: '29 Nisan' },
                ].map((item, index) => (
                  <View key={index} style={styles.announcementItem}>
                    <View style={styles.announcementHeader}>
                      <Text style={styles.announcementTitle}>{item.title}</Text>
                      <Text style={styles.announcementDate}>{item.date}</Text>
                    </View>
                    <Text style={styles.announcementContent}>{item.content}</Text>
                  </View>
                ))
              }
            </View>
          </>
        );
    }
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Öğrenci Paneli</Text>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => navigation.navigate('Welcome' as never)}
        >
          <Text style={styles.logoutText}>Çıkış</Text>
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'overview' && styles.activeTabButton]}
          onPress={() => setActiveTab('overview')}
        >
          <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>Genel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'schedule' && styles.activeTabButton]}
          onPress={() => setActiveTab('schedule')}
        >
          <Text style={[styles.tabText, activeTab === 'schedule' && styles.activeTabText]}>Program</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'assignments' && styles.activeTabButton]}
          onPress={() => setActiveTab('assignments')}
        >
          <Text style={[styles.tabText, activeTab === 'assignments' && styles.activeTabText]}>Ödevler</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'announcements' && styles.activeTabButton]}
          onPress={() => setActiveTab('announcements')}
        >
          <Text style={[styles.tabText, activeTab === 'announcements' && styles.activeTabText]}>Duyurular</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        contentContainerStyle={styles.contentContainer}
      >
        {renderTabContent()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  errorText: {
    fontSize: 18,
    color: '#F44336',
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    padding: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  logoutButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  logoutText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingVertical: 5,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: '#2196F3',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
  contentContainer: {
    padding: 15,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  nameContainer: {
    flex: 1,
  },
  nameText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  emailText: {
    fontSize: 14,
    color: '#666',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  courseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  courseLabel: {
    fontSize: 16,
    color: '#666',
    width: 80,
  },
  courseValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  gradeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gradeItem: {
    alignItems: 'center',
  },
  gradeLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  gradeBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  attendanceBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  gradeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  gradeStatus: {
    fontSize: 14,
    fontWeight: '500',
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 8,
  },
  dayContainer: {
    width: 80,
    marginRight: 5,
  },
  dayText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  scheduleTime: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
    width: 60,
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
  announcementItem: {
    marginBottom: 15,
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
  },
  announcementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  announcementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  announcementDate: {
    fontSize: 12,
    color: '#666',
  },
  announcementContent: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    marginBottom: 10,
  },
  chartColumn: {
    alignItems: 'center',
    flex: 1,
  },
  chartBar: {
    width: 20,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  chartLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  chartLegend: {
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  chartLegendText: {
    fontSize: 14,
    color: '#666',
  },
  assignmentItem: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  assignmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  assignmentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  assignmentDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dueDateText: {
    fontSize: 14,
    color: '#666',
  },
  assignmentGrade: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2196F3',
  },
});

export default StudentDashboard; 