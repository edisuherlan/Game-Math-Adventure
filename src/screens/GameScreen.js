// Dibuat oleh: Edi Suherlan (audhighasu.com)
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, BackHandler } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { saveHighScore, unlockLevel, saveLastGame, clearLastGame, getUserName } from '../utils/storage';

const generateQuestion = (levelId) => {
  switch (levelId) {
    case 1: // Penjumlahan
      const num1 = Math.floor(Math.random() * 50) + 1;
      const num2 = Math.floor(Math.random() * 50) + 1;
      return {
        question: `${num1} + ${num2} = ?`,
        answer: num1 + num2,
        options: generateOptions(num1 + num2)
      };
    case 2: // Pengurangan
      const num3 = Math.floor(Math.random() * 50) + 1;
      const num4 = Math.floor(Math.random() * num3) + 1;
      return {
        question: `${num3} - ${num4} = ?`,
        answer: num3 - num4,
        options: generateOptions(num3 - num4)
      };
    case 3: // Perkalian
      const num5 = Math.floor(Math.random() * 10) + 1;
      const num6 = Math.floor(Math.random() * 10) + 1;
      return {
        question: `${num5} × ${num6} = ?`,
        answer: num5 * num6,
        options: generateOptions(num5 * num6)
      };
    case 4: // Pembagian
      const num7 = Math.floor(Math.random() * 50) + 1;
      const num8 = Math.floor(Math.random() * 10) + 1;
      const result = num7 * num8;
      return {
        question: `${result} ÷ ${num8} = ?`,
        answer: num7,
        options: generateOptions(num7)
      };
    case 5: // Operasi Campuran
      const operations = ['+', '-', '×', '÷'];
      const operation = operations[Math.floor(Math.random() * operations.length)];
      let num9, num10, answer;
      
      if (operation === '÷') {
        num9 = Math.floor(Math.random() * 50) + 1;
        num10 = Math.floor(Math.random() * 10) + 1;
        answer = num9 * num10;
        return {
          question: `${answer} ÷ ${num10} = ?`,
          answer: num9,
          options: generateOptions(num9)
        };
      } else {
        num9 = Math.floor(Math.random() * 20) + 1;
        num10 = Math.floor(Math.random() * 20) + 1;
        switch (operation) {
          case '+': answer = num9 + num10; break;
          case '-': answer = num9 - num10; break;
          case '×': answer = num9 * num10; break;
        }
        return {
          question: `${num9} ${operation} ${num10} = ?`,
          answer: answer,
          options: generateOptions(answer)
        };
      }
    default:
      return null;
  }
};

const generateOptions = (correctAnswer) => {
  const options = [correctAnswer];
  while (options.length < 4) {
    const randomNum = Math.floor(Math.random() * 100) + 1;
    if (!options.includes(randomNum)) {
      options.push(randomNum);
    }
  }
  return options.sort(() => Math.random() - 0.5);
};

const GameScreen = ({ route, navigation }) => {
  const { levelId } = route.params;
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (!levelId) {
      navigation.goBack();
      return;
    }
    
    loadGame();
    loadUserName();

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      handleExit();
      return true;
    });

    return () => {
      backHandler.remove();
    };
  }, [levelId]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (levelId) {
        loadUserName();
      }
    });

    return unsubscribe;
  }, [navigation, levelId]);

  const loadUserName = async () => {
    try {
      const name = await getUserName();
      setUserName(name);
      if (!name) {
        Alert.alert(
          'Nama Belum Diatur',
          'Silakan atur nama Anda terlebih dahulu untuk menyimpan skor',
          [
            {
              text: 'Atur Nama',
              onPress: () => navigation.navigate('Profile', { 
                returnTo: 'Game',
                params: { levelId }
              })
            },
            {
              text: 'Nanti',
              style: 'cancel'
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error loading user name:', error);
    }
  };

  const loadGame = async () => {
    setCurrentQuestion(generateQuestion(levelId));
    setTimeLeft(30);
    setScore(0);
    setQuestionsAnswered(0);
  };

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      handleTimeUp();
    }
  }, [timeLeft]);

  const handleAnswer = async (selectedAnswer) => {
    if (selectedAnswer === currentQuestion.answer) {
      const newScore = score + 10;
      setScore(newScore);
      const newQuestionsAnswered = questionsAnswered + 1;
      setQuestionsAnswered(newQuestionsAnswered);

      // Simpan progress permainan
      await saveLastGame({
        levelId,
        score: newScore,
        questionsAnswered: newQuestionsAnswered,
        timeLeft
      });

      // Cek apakah perlu membuka level baru
      if (newScore >= 50 && levelId < 5) {
        await unlockLevel(levelId + 1);
      }

      Alert.alert('Benar!', 'Jawaban kamu tepat!', [
        { text: 'Lanjutkan', onPress: () => {
          setCurrentQuestion(generateQuestion(levelId));
          setTimeLeft(30);
        }}
      ]);
    } else {
      Alert.alert('Salah!', `Jawaban yang benar adalah ${currentQuestion.answer}`, [
        { text: 'Coba Lagi', onPress: () => {
          setCurrentQuestion(generateQuestion(levelId));
          setTimeLeft(30);
        }}
      ]);
    }
  };

  const handleTimeUp = async () => {
    try {
      const currentName = await getUserName();
      if (!currentName) {
        Alert.alert(
          'Nama Belum Diatur',
          'Silakan atur nama Anda terlebih dahulu untuk menyimpan skor',
          [
            {
              text: 'Atur Nama',
              onPress: () => navigation.navigate('Profile', { 
                returnTo: 'Game',
                params: { levelId }
              })
            },
            {
              text: 'Kembali ke Level',
              style: 'cancel',
              onPress: async () => {
                await clearLastGame();
                navigation.goBack();
              }
            }
          ]
        );
        return;
      }

      // Simpan skor tertinggi
      const isNewHighScore = await saveHighScore(levelId, score, currentName);
      
      let message = `Skor kamu: ${score}`;
      if (isNewHighScore) {
        message += '\nSkor Tertinggi Baru!';
      }

      Alert.alert('Waktu Habis!', message, [
        { 
          text: 'Kembali ke Level',
          onPress: async () => {
            await clearLastGame();
            navigation.goBack();
          }
        }
      ]);
    } catch (error) {
      console.error('Error in handleTimeUp:', error);
      Alert.alert('Error', 'Terjadi kesalahan saat menyimpan skor');
    }
  };

  const handleExit = async () => {
    try {
      const currentName = await getUserName();
      if (!currentName) {
        Alert.alert(
          'Nama Belum Diatur',
          'Silakan atur nama Anda terlebih dahulu untuk menyimpan skor',
          [
            {
              text: 'Atur Nama',
              onPress: () => navigation.navigate('Profile', { 
                returnTo: 'Game',
                params: { levelId }
              })
            },
            {
              text: 'Keluar Tanpa Simpan',
              style: 'destructive',
              onPress: async () => {
                await clearLastGame();
                navigation.goBack();
              }
            }
          ]
        );
        return;
      }

      // Simpan skor sebelum keluar
      await saveHighScore(levelId, score, currentName);
      
      Alert.alert(
        'Keluar Level',
        `Skor kamu: ${score}\nYakin ingin keluar?`,
        [
          {
            text: 'Batal',
            style: 'cancel'
          },
          {
            text: 'Ya, Keluar',
            onPress: async () => {
              await clearLastGame();
              navigation.goBack();
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error in handleExit:', error);
      Alert.alert('Error', 'Terjadi kesalahan saat menyimpan skor');
    }
  };

  if (!currentQuestion) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.score}>Skor: {score}</Text>
        <Text style={styles.timer}>Waktu: {timeLeft}s</Text>
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>Pertanyaan: {questionsAnswered + 1}</Text>
      </View>

      <View style={styles.questionContainer}>
        <Text style={styles.question}>{currentQuestion.question}</Text>
      </View>

      <View style={styles.optionsContainer}>
        {currentQuestion.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.optionButton}
            onPress={() => handleAnswer(option)}
          >
            <LinearGradient
              colors={['#4A90E2', '#357ABD']}
              style={styles.gradient}
            >
              <Text style={styles.optionText}>{option}</Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.exitButton}
        onPress={handleExit}
      >
        <LinearGradient
          colors={['#FF6B6B', '#FF5252']}
          style={styles.gradient}
        >
          <Text style={styles.exitButtonText}>Keluar Level</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  score: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  timer: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  statsContainer: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  statsText: {
    fontSize: 16,
    color: '#333333',
    textAlign: 'center',
  },
  questionContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  question: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333333',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionButton: {
    width: '48%',
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  gradient: {
    padding: 16,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  exitButton: {
    width: '100%',
    height: 50,
    marginTop: 20,
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  exitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default GameScreen; 