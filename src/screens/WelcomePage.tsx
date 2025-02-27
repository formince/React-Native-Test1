import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function WelcomePage() {
  const navigation = useNavigation();

  return (
    <ImageBackground
      source={{ uri: 'https://source.unsplash.com/random/?education,university' }}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>Eğitim Portalı</Text>
          <Text style={styles.subtitle}>
            Öğrenme yolculuğunuza hoş geldiniz
          </Text>
          <View style={styles.descriptionContainer}>
            <Text style={styles.description}>
              Modern eğitim platformumuzda öğrenci ve öğretmenler için özel hazırlanmış
              içerikler ve yönetim araçları sunuyoruz.
            </Text>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Login' as never)}
          >
            <Text style={styles.buttonText}>Giriş Yap</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    width: width * 0.9,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  descriptionContainer: {
    backgroundColor: 'rgba(33,150,243,0.1)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
  },
  description: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#2196F3',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 