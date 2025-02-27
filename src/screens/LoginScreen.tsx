import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { height } = Dimensions.get('window');

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const navigation = useNavigation();

  const handleLogin = () => {
    if (email === 'student@edu.com' && password === 'student123') {
      navigation.navigate('StudentDashboard' as never);
    } else if (email === 'teacher@edu.com' && password === 'teacher123') {
      navigation.navigate('TeacherDashboard' as never);
    } else {
      Alert.alert('Hata', 'Geçersiz email veya şifre!');
    }
  };

  return (
    <ImageBackground
      source={{ uri: 'https://source.unsplash.com/random/?university,education' }}
      style={styles.background}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.card}>
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <Text style={styles.logoText}>EP</Text>
              </View>
              <Text style={styles.title}>Eğitim Portalı</Text>
              <Text style={styles.subtitle}>Giriş Yap</Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="Email adresinizi girin"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Şifre</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={secureTextEntry}
                  placeholder="Şifrenizi girin"
                />
                <TouchableOpacity 
                  style={styles.eyeButton}
                  onPress={() => setSecureTextEntry(!secureTextEntry)}
                >
                  <Text style={styles.eyeButtonText}>
                    {secureTextEntry ? '👁️' : '🔒'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Giriş Yap</Text>
            </TouchableOpacity>

            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>Örnek Giriş Bilgileri</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>👨‍🏫 Öğretmen:</Text>
                <Text style={styles.infoText}>teacher@edu.com / teacher123</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>👨‍🎓 Öğrenci:</Text>
                <Text style={styles.infoText}>student@edu.com / student123</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    minHeight: height,
  },
  card: {
    padding: 20,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.95)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2196F3',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginTop: 5,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
    fontWeight: '500',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  eyeButton: {
    padding: 12,
  },
  eyeButtonText: {
    fontSize: 18,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoCard: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: 'rgba(33,150,243,0.1)',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 10,
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  infoLabel: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    width: 90,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
  },
}); 