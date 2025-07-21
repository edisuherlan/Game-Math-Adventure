// Dibuat oleh: Edi Suherlan (audhighasu.com)
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal, ScrollView, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getLastGame, getUserName } from '../utils/storage';

const LOGO = require('../assets/logo.png');

const HomeScreen = ({ navigation }) => {
  const [lastGame, setLastGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    loadLastGame();
    checkUserName();
  }, []);

  const loadLastGame = async () => {
    try {
      const game = await getLastGame();
      setLastGame(game);
    } catch (error) {
      console.error('Error loading last game:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkUserName = async () => {
    try {
      const name = await getUserName();
      setUserName(name);
      if (!name) {
        Alert.alert(
          'Selamat Datang!',
          'Silakan atur nama Anda terlebih dahulu untuk mulai bermain',
          [
            {
              text: 'Atur Nama',
              onPress: () => navigation.navigate('Profile')
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error checking user name:', error);
    }
  };

  const handleContinueGame = () => {
    if (lastGame) {
      navigation.navigate('Game', { 
        levelId: lastGame.levelId,
        continueGame: true,
        savedScore: lastGame.score,
        savedQuestions: lastGame.questionsAnswered,
        savedTime: lastGame.timeLeft
      });
    }
  };

  const handleStartGame = () => {
    if (!userName) {
      Alert.alert(
        'Nama Belum Diatur',
        'Silakan atur nama Anda terlebih dahulu untuk mulai bermain',
        [
          {
            text: 'Atur Nama',
            onPress: () => navigation.navigate('Profile')
          }
        ]
      );
      return;
    }
    navigation.navigate('Levels');
  };

  const TutorialModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showTutorial}
      onRequestClose={() => setShowTutorial(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ScrollView>
            <Text style={styles.modalTitle}>Cara Bermain Math Adventure</Text>
            
            <View style={styles.tutorialSection}>
              <Text style={styles.tutorialSubtitle}>1. Memulai Permainan</Text>
              <Text style={styles.tutorialText}>
                • Pilih "Mulai Petualangan" untuk memulai permainan baru{'\n'}
                • Atau "Lanjutkan Permainan" jika ada progress yang tersimpan
              </Text>
            </View>

            <View style={styles.tutorialSection}>
              <Text style={styles.tutorialSubtitle}>2. Memilih Level</Text>
              <Text style={styles.tutorialText}>
                • Level 1 selalu terbuka untuk pemain baru{'\n'}
                • Level baru akan terbuka setelah mencapai skor 50 di level sebelumnya{'\n'}
                • Setiap level memiliki tingkat kesulitan yang berbeda
              </Text>
            </View>

            <View style={styles.tutorialSection}>
              <Text style={styles.tutorialSubtitle}>3. Bermain</Text>
              <Text style={styles.tutorialText}>
                • Jawab pertanyaan matematika dengan memilih jawaban yang benar{'\n'}
                • Setiap jawaban benar mendapat 10 poin{'\n'}
                • Waktu untuk menjawab adalah 30 detik{'\n'}
                • Jika waktu habis, permainan berakhir
              </Text>
            </View>

            <View style={styles.tutorialSection}>
              <Text style={styles.tutorialSubtitle}>4. Skor dan Progress</Text>
              <Text style={styles.tutorialText}>
                • Skor tertinggi akan disimpan untuk setiap level{'\n'}
                • Progress permainan akan otomatis tersimpan{'\n'}
                • Anda bisa melanjutkan permainan kapan saja
              </Text>
            </View>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowTutorial(false)}
            >
              <LinearGradient
                colors={['#4A90E2', '#357ABD']}
                style={styles.gradient}
              >
                <Text style={styles.closeButtonText}>Tutup</Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <LinearGradient
      colors={['#4A90E2', '#357ABD']}
      style={styles.background}
    >
      <View style={styles.container}>
        {/* Logo di atas judul */}
        <Image source={LOGO} style={styles.logo} resizeMode="contain" />
        
        <Text style={styles.subtitle}>Petualangan Matematika yang Menyenangkan!</Text>
        
        <View style={styles.buttonContainer}>
          {lastGame && (
            <TouchableOpacity
              style={[styles.button, styles.continueButton]}
              onPress={handleContinueGame}
            >
              <LinearGradient
                colors={['#4CAF50', '#45A049']}
                style={styles.gradient}
              >
                <Text style={styles.buttonText}>Lanjutkan Permainan</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.button}
            onPress={handleStartGame}
          >
            <LinearGradient
              colors={['#FFFFFF', '#F0F0F0']}
              style={styles.gradient}
            >
              <Text style={[styles.buttonText, { color: '#4A90E2' }]}>Mulai Petualangan</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => setShowTutorial(true)}
          >
            <LinearGradient
              colors={['#FFFFFF', '#F0F0F0']}
              style={styles.gradient}
            >
              <Text style={[styles.buttonText, { color: '#FF6B6B' }]}>Cara Bermain</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => navigation.navigate('HighScores')}
          >
            <LinearGradient
              colors={['#FFFFFF', '#F0F0F0']}
              style={styles.gradient}
            >
              <Text style={[styles.buttonText, { color: '#4A90E2' }]}>Skor Tertinggi</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => navigation.navigate('Profile')}
          >
            <LinearGradient
              colors={['#FFA726', '#FB8C00']}
              style={styles.gradient}
            >
              <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>
                {userName ? `Ubah Nama (${userName})` : 'Atur Nama'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <TutorialModal />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 220,
    height: 220,
    marginBottom: 10,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 40,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
  },
  button: {
    width: '100%',
    height: 50,
    marginVertical: 10,
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  continueButton: {
    marginBottom: 20,
  },
  secondaryButton: {
    marginTop: 20,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A90E2',
    textAlign: 'center',
    marginBottom: 20,
  },
  tutorialSection: {
    marginBottom: 20,
  },
  tutorialSubtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  tutorialText: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 24,
  },
  closeButton: {
    width: '100%',
    height: 50,
    marginTop: 20,
    borderRadius: 25,
    overflow: 'hidden',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen; 