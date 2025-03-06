import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { StudentFilter, StudentSort } from '../models/Student';
import { COURSES } from '../services/MockDataService';

interface StudentFilterProps {
  isVisible: boolean;
  onClose: () => void;
  onApplyFilter: (filter: StudentFilter) => void;
  onApplySort: (sort: StudentSort) => void;
  currentFilter: StudentFilter;
  currentSort: StudentSort;
}

const StudentFilterComponent: React.FC<StudentFilterProps> = ({
  isVisible,
  onClose,
  onApplyFilter,
  onApplySort,
  currentFilter,
  currentSort,
}) => {
  // Filter state
  const [search, setSearch] = useState(currentFilter.search || '');
  const [course, setCourse] = useState(currentFilter.course || '');
  const [minGrade, setMinGrade] = useState(
    currentFilter.minGrade !== undefined ? currentFilter.minGrade.toString() : ''
  );
  const [maxGrade, setMaxGrade] = useState(
    currentFilter.maxGrade !== undefined ? currentFilter.maxGrade.toString() : ''
  );

  // Sort state
  const [sortBy, setSortBy] = useState(currentSort.by);
  const [sortDirection, setSortDirection] = useState(currentSort.direction);

  // Apply filter
  const handleApplyFilter = () => {
    const filter: StudentFilter = {
      search: search.trim() || undefined,
      course: course || undefined,
      minGrade: minGrade ? Number(minGrade) : undefined,
      maxGrade: maxGrade ? Number(maxGrade) : undefined,
    };

    const sort: StudentSort = {
      by: sortBy,
      direction: sortDirection,
    };

    onApplyFilter(filter);
    onApplySort(sort);
    onClose();
  };

  // Reset filter
  const handleResetFilter = () => {
    setSearch('');
    setCourse('');
    setMinGrade('');
    setMaxGrade('');
    setSortBy('name');
    setSortDirection('asc');

    onApplyFilter({});
    onApplySort({ by: 'name', direction: 'asc' });
    onClose();
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Filtreleme ve Sıralama</Text>

          <ScrollView style={styles.formContainer}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Ara ve Filtrele</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Arama</Text>
                <TextInput
                  style={styles.input}
                  value={search}
                  onChangeText={setSearch}
                  placeholder="İsim veya email..."
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Kurs</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={course}
                    onValueChange={(itemValue: string) => setCourse(itemValue)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Tümü" value="" />
                    {COURSES.map((c: string) => (
                      <Picker.Item key={c} label={c} value={c} />
                    ))}
                  </Picker>
                </View>
              </View>

              <View style={styles.rowContainer}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                  <Text style={styles.label}>Min Not</Text>
                  <TextInput
                    style={styles.input}
                    value={minGrade}
                    onChangeText={setMinGrade}
                    placeholder="0"
                    keyboardType="numeric"
                  />
                </View>

                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Max Not</Text>
                  <TextInput
                    style={styles.input}
                    value={maxGrade}
                    onChangeText={setMaxGrade}
                    placeholder="100"
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Sıralama</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Sıralama Kriteri</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={sortBy}
                    onValueChange={(itemValue: string) => setSortBy(itemValue as any)}
                    style={styles.picker}
                  >
                    <Picker.Item label="İsim" value="name" />
                    <Picker.Item label="Not" value="grade" />
                    <Picker.Item label="Kurs" value="course" />
                    <Picker.Item label="Kayıt Tarihi" value="createdAt" />
                  </Picker>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Sıralama Yönü</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={sortDirection}
                    onValueChange={(itemValue: string) => setSortDirection(itemValue as any)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Artan" value="asc" />
                    <Picker.Item label="Azalan" value="desc" />
                  </Picker>
                </View>
              </View>
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.resetButton]}
              onPress={handleResetFilter}
            >
              <Text style={styles.buttonText}>Sıfırla</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.applyButton]}
              onPress={handleApplyFilter}
            >
              <Text style={styles.buttonText}>Uygula</Text>
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
    maxHeight: '90%',
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
    maxHeight: 450,
  },
  section: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 14,
    backgroundColor: 'white',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    backgroundColor: 'white',
  },
  picker: {
    height: 45,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginLeft: 10,
  },
  resetButton: {
    backgroundColor: '#9E9E9E',
  },
  applyButton: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default StudentFilterComponent; 