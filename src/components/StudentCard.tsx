import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Student } from '../models/Student';

interface StudentCardProps {
  student: Student;
  onEdit: (student: Student) => void;
  onDelete: (studentId: string) => void;
  onView: (student: Student) => void;
}

const StudentCard: React.FC<StudentCardProps> = ({ 
  student, 
  onEdit, 
  onDelete, 
  onView 
}) => {
  // Format date for display
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('tr-TR');
  };

  // Get color based on grade
  const getGradeColor = (grade: number) => {
    if (grade >= 85) return '#4CAF50'; // Green
    if (grade >= 70) return '#2196F3'; // Blue
    if (grade >= 60) return '#FF9800'; // Orange
    return '#F44336'; // Red
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.cardContent}
        onPress={() => onView(student)}
        activeOpacity={0.7}
      >
        <View style={styles.header}>
          <Text style={styles.name}>{student.name}</Text>
          <View style={[styles.gradeBadge, { backgroundColor: getGradeColor(student.grade) }]}>
            <Text style={styles.gradeText}>{student.grade}</Text>
          </View>
        </View>
        
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{student.email}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.label}>Kurs:</Text>
            <Text style={styles.value}>{student.course}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.label}>Devam:</Text>
            <Text style={styles.value}>%{student.attendance}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.label}>Kayıt:</Text>
            <Text style={styles.value}>{formatDate(student.createdAt)}</Text>
          </View>
        </View>
      </TouchableOpacity>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.editButton]}
          onPress={() => onEdit(student)}
        >
          <Text style={styles.buttonText}>Düzenle</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={() => onDelete(student.id)}
        >
          <Text style={styles.buttonText}>Sil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  cardContent: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  gradeBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  detailsContainer: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    paddingVertical: 4,
  },
  label: {
    width: 60,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  value: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
    marginTop: 4,
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginLeft: 8,
  },
  editButton: {
    backgroundColor: '#2196F3',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 14,
  },
});

export default StudentCard; 