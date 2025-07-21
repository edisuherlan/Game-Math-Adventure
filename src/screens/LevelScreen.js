// Dibuat oleh: Edi Suherlan (audhighasu.com)
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getUnlockedLevels, getHighScores } from '../utils/storage';

const levels = [
  { id: 1, title: 'Level 1', description: 'Penjumlahan Dasar', difficulty: 'Mudah' },
  { id: 2, title: 'Level 2', description: 'Pengurangan Dasar', difficulty: 'Mudah' },
  { id: 3, title: 'Level 3', description: 'Perkalian Dasar', difficulty: 'Sedang' },
  { id: 4, title: 'Level 4', description: 'Pembagian Dasar', difficulty: 'Sedang' },
  { id: 5, title: 'Level 5', description: 'Operasi Campuran', difficulty: 'Sulit' },
];

const LevelScreen = ({ navigation }) => {
  const [unlockedLevels, setUnlockedLevels] = useState([]);
  const [highScores, setHighScores] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [unlocked, scores] = await Promise.all([
        getUnlockedLevels(),
        getHighScores()
      ]);
      setUnlockedLevels(unlocked);
      setHighScores(scores);
    } catch (error) {
      console.error('Error loading level data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {levels.map((level) => {
          const isUnlocked = unlockedLevels.includes(level.id);
          const highScore = highScores[level.id] || 0;
          
          return (
            <TouchableOpacity
              key={level.id}
              style={[
                styles.levelCard,
                !isUnlocked && styles.lockedCard
              ]}
              onPress={() => isUnlocked && navigation.navigate('Game', { levelId: level.id })}
              disabled={!isUnlocked}
            >
              <LinearGradient
                colors={isUnlocked ? ['#4A90E2', '#357ABD'] : ['#CCCCCC', '#999999']}
                style={styles.gradient}
              >
                <View style={styles.levelContent}>
                  <Text style={styles.levelTitle}>{level.title}</Text>
                  <Text style={styles.levelDescription}>{level.description}</Text>
                  <View style={styles.infoContainer}>
                    <View style={styles.difficultyContainer}>
                      <Text style={styles.difficultyText}>Kesulitan: {level.difficulty}</Text>
                    </View>
                    {isUnlocked && highScore > 0 && (
                      <View style={styles.scoreContainer}>
                        <Text style={styles.scoreText}>Skor Tertinggi: {highScore}</Text>
                      </View>
                    )}
                  </View>
                  {!isUnlocked && (
                    <Text style={styles.lockedText}>Selesaikan level sebelumnya untuk membuka</Text>
                  )}
                </View>
              </LinearGradient>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 16,
  },
  levelCard: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  lockedCard: {
    opacity: 0.7,
  },
  gradient: {
    padding: 16,
  },
  levelContent: {
    flex: 1,
  },
  levelTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  levelDescription: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  difficultyContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 8,
    borderRadius: 8,
  },
  scoreContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 8,
    borderRadius: 8,
  },
  difficultyText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  scoreText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  lockedText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default LevelScreen; 