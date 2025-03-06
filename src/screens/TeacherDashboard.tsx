import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { 
  initializeStorage, 
  getAllStudents, 
  addStudent, 
  updateStudent, 
  deleteStudent,
  filterAndSortStudents 
} from '../services/StorageService';
import { Student, StudentFilter, StudentSort } from '../models/Student';
import StudentCard from '../components/StudentCard';
import StudentForm from '../components/StudentForm';
import StudentFilterComponent from '../components/StudentFilter'; 

// Detail view modal for student
import { Modal } from 'react-native';

const TeacherDashboard: React.FC = () => {
  const navigation = useNavigation();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // State for active student
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  
  // State for modals
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  
  // State for view mode
  const [isGridView, setIsGridView] = useState(false);
  
  // State for filtering and sorting
  const [filter, setFilter] = useState<StudentFilter>({});
  const [sort, setSort] = useState<StudentSort>({ by: 'name', direction: 'asc' });

  useEffect(() => {
    const setup = async () => {
      try {
        // Initialize storage with sample data on first run
        await initializeStorage();
        await loadStudents();
      } catch (error) {
        console.error('Setup error:', error);
        Alert.alert('Hata', 'Uygulama başlatılırken bir sorun oluştu.');
      } finally {
        setLoading(false);
      }
    };

    setup();
  }, []);

  const loadStudents = async () => {
    try {
      // Use filter and sort if set, otherwise get all students
      const students = await filterAndSortStudents(filter, sort);
      setStudents(students);
    } catch (error) {
      console.error('Load students error:', error);
      Alert.alert('Hata', 'Öğrenciler yüklenirken bir sorun oluştu.');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadStudents();
    setRefreshing(false);
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    const searchFilter: StudentFilter = {
      ...filter,
      search: text || undefined
    };
    setFilter(searchFilter);
    
    // Debounced search
    const handler = setTimeout(() => {
      loadStudents();
    }, 300);
    
    return () => clearTimeout(handler);
  };

  const handleAddStudent = () => {
    setSelectedStudent(null); // Ensure we're in add mode, not edit
    setIsFormVisible(true);
  };

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setIsFormVisible(true);
  };

  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student);
    setIsDetailVisible(true);
  };

  const handleDeleteStudent = (studentId: string) => {
    Alert.alert(
      'Öğrenciyi Sil',
      'Bu öğrenciyi silmek istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { 
          text: 'Sil', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteStudent(studentId);
              await loadStudents();
              Alert.alert('Başarılı', 'Öğrenci başarıyla silindi.');
            } catch (error) {
              console.error('Delete student error:', error);
              Alert.alert('Hata', 'Öğrenci silinirken bir sorun oluştu.');
            }
          } 
        },
      ]
    );
  };

  const handleSaveStudent = async (studentData: Omit<Student, 'id' | 'createdAt'> | Student) => {
    try {
      if ('id' in studentData) {
        // Update existing student
        await updateStudent(studentData as Student);
        Alert.alert('Başarılı', 'Öğrenci başarıyla güncellendi.');
      } else {
        // Add new student
        await addStudent(studentData);
        Alert.alert('Başarılı', 'Öğrenci başarıyla eklendi.');
      }
      
      await loadStudents();
    } catch (error) {
      console.error('Save student error:', error);
      Alert.alert('Hata', 'Öğrenci kaydedilirken bir sorun oluştu.');
    }
  };

  const handleApplyFilter = (newFilter: StudentFilter) => {
    setFilter(newFilter);
    loadStudents();
  };

  const handleApplySort = (newSort: StudentSort) => {
    setSort(newSort);
    loadStudents();
  };

  // Render student grid item
  const renderStudentGridItem = ({ item }: { item: Student }) => (
    <View style={styles.gridItem}>
      <StudentCard
        student={item}
        onEdit={handleEditStudent}
        onDelete={handleDeleteStudent}
        onView={handleViewStudent}
      />
    </View>
  );

  // Render loading indicator
  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Öğrenci Yönetimi</Text>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => navigation.navigate('Welcome' as never)}
        >
          <Text style={styles.logoutText}>Çıkış</Text>
        </TouchableOpacity>
      </View>

      {/* Search and Filter Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Öğrenci ara..."
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
        
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setIsFilterVisible(true)}
        >
          <Text style={styles.iconButtonText}>🔍</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setIsGridView(!isGridView)}
        >
          <Text style={styles.iconButtonText}>{isGridView ? '📋' : '📊'}</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Tags (if filters are applied) */}
      {(filter.course || filter.minGrade || filter.maxGrade) && (
        <View style={styles.filterTagsContainer}>
          {filter.course && (
            <View style={styles.filterTag}>
              <Text style={styles.filterTagText}>Kurs: {filter.course}</Text>
            </View>
          )}
          
          {filter.minGrade !== undefined && (
            <View style={styles.filterTag}>
              <Text style={styles.filterTagText}>Min Not: {filter.minGrade}</Text>
            </View>
          )}
          
          {filter.maxGrade !== undefined && (
            <View style={styles.filterTag}>
              <Text style={styles.filterTagText}>Max Not: {filter.maxGrade}</Text>
            </View>
          )}
          
          <TouchableOpacity
            style={[styles.filterTag, styles.clearFilterTag]}
            onPress={() => {
              setFilter({});
              setSearchQuery('');
              loadStudents();
            }}
          >
            <Text style={styles.clearFilterTagText}>Temizle ✕</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Content */}
      {students.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Henüz öğrenci bulunmuyor.</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddStudent}
          >
            <Text style={styles.addButtonText}>Öğrenci Ekle</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {isGridView ? (
            <FlatList
              data={students}
              renderItem={renderStudentGridItem}
              keyExtractor={(item) => item.id}
              numColumns={1}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
              }
              contentContainerStyle={styles.contentContainer}
            />
          ) : (
            <ScrollView
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
              }
              contentContainerStyle={styles.contentContainer}
            >
              {students.map((student) => (
                <StudentCard
                  key={student.id}
                  student={student}
                  onEdit={handleEditStudent}
                  onDelete={handleDeleteStudent}
                  onView={handleViewStudent}
                />
              ))}
            </ScrollView>
          )}
          
          <TouchableOpacity
            style={styles.floatingButton}
            onPress={handleAddStudent}
          >
            <Text style={styles.floatingButtonText}>+</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Student Form Modal */}
      <StudentForm
        isVisible={isFormVisible}
        onClose={() => setIsFormVisible(false)}
        onSave={handleSaveStudent}
        student={selectedStudent || undefined}
      />

      {/* Filter Modal */}
      <StudentFilterComponent
        isVisible={isFilterVisible}
        onClose={() => setIsFilterVisible(false)}
        onApplyFilter={handleApplyFilter}
        onApplySort={handleApplySort}
        currentFilter={filter}
        currentSort={sort}
      />

      {/* Student Detail Modal */}
      <Modal
        visible={isDetailVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsDetailVisible(false)}
      >
        {selectedStudent && (
          <View style={styles.detailModalContainer}>
            <View style={styles.detailModalContent}>
              <Text style={styles.detailModalTitle}>{selectedStudent.name}</Text>
              
              <View style={styles.detailSection}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Email:</Text>
                  <Text style={styles.detailValue}>{selectedStudent.email}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Kurs:</Text>
                  <Text style={styles.detailValue}>{selectedStudent.course}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Not:</Text>
                  <Text style={styles.detailValue}>{selectedStudent.grade}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Devam:</Text>
                  <Text style={styles.detailValue}>%{selectedStudent.attendance}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Kayıt:</Text>
                  <Text style={styles.detailValue}>
                    {new Date(selectedStudent.createdAt).toLocaleDateString('tr-TR')}
                  </Text>
                </View>
              </View>
              
              <View style={styles.detailButtonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.editButton]}
                  onPress={() => {
                    setIsDetailVisible(false);
                    handleEditStudent(selectedStudent);
                  }}
                >
                  <Text style={styles.buttonText}>Düzenle</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.button, styles.closeButton]}
                  onPress={() => setIsDetailVisible(false)}
                >
                  <Text style={styles.buttonText}>Kapat</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </Modal>
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
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
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
  searchContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchInputContainer: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  searchInput: {
    height: 40,
  },
  iconButton: {
    width: 40,
    height: 40,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  iconButtonText: {
    fontSize: 20,
  },
  filterTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterTag: {
    backgroundColor: '#e3f2fd',
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 8,
    marginBottom: 5,
  },
  filterTagText: {
    fontSize: 12,
    color: '#2196F3',
  },
  clearFilterTag: {
    backgroundColor: '#ffebee',
  },
  clearFilterTagText: {
    fontSize: 12,
    color: '#f44336',
  },
  contentContainer: {
    padding: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  floatingButtonText: {
    color: 'white',
    fontSize: 24,
  },
  gridItem: {
    flex: 1,
    margin: 4,
  },
  detailModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  detailModalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    width: '85%',
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
  detailModalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  detailSection: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  detailLabel: {
    width: 80,
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  detailValue: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  detailButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 10,
  },
  editButton: {
    backgroundColor: '#2196F3',
  },
  closeButton: {
    backgroundColor: '#9E9E9E',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default TeacherDashboard; 