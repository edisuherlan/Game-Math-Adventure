// Dibuat oleh: Edi Suherlan (audhighasu.com)
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { saveUserName, getUserName } from '../utils/storage';

const ProfileScreen = ({ route, navigation }) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const returnTo = route.params?.returnTo;
  const params = route.params?.params;

  useEffect(() => {
    loadUserName();
  }, []);

  const loadUserName = async () => {
    try {
      const savedName = await getUserName();
      if (savedName) {
        setName(savedName);
      }
    } catch (error) {
      console.error('Error loading user name:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveName = async () => {
    if (name.trim().length < 2) {
      Alert.alert('Error', 'Nama harus minimal 2 karakter');
      return;
    }

    try {
      await saveUserName(name.trim());
      Alert.alert('Sukses', 'Nama berhasil disimpan!', [
        {
          text: 'OK',
          onPress: () => {
            if (returnTo) {
              navigation.navigate(returnTo, params);
            } else {
              navigation.goBack();
            }
          }
        }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Gagal menyimpan nama');
    }
  };

  return (
    <LinearGradient
      colors={['#4A90E2', '#357ABD']}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Profil Pemain</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nama Pemain:</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Masukkan nama Anda"
            placeholderTextColor="#999"
            maxLength={20}
          />
        </View>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveName}
        >
          <LinearGradient
            colors={['#4CAF50', '#45A049']}
            style={styles.gradient}
          >
            <Text style={styles.buttonText}>Simpan Nama</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 40,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  inputContainer: {
    marginBottom: 30,
  },
  label: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 10,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: '#333333',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  saveButton: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProfileScreen; 