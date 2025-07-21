// Dibuat oleh: Edi Suherlan (audhighasu.com)
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getHighScores } from '../utils/storage';

const levels = [
  { id: 1, title: 'Level 1', description: 'Penjumlahan Dasar' },
  { id: 2, title: 'Level 2', description: 'Pengurangan Dasar' },
  { id: 3, title: 'Level 3', description: 'Perkalian Dasar' },
  { id: 4, title: 'Level 4', description: 'Pembagian Dasar' },
  { id: 5, title: 'Level 5', description: 'Operasi Campuran' },
];

const HighScoresScreen = () => {
  const [highScores, setHighScores] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadHighScores();
  }, []);

  const loadHighScores = async () => {
    try {
      const scores = await getHighScores();
      console.log('Loaded scores:', scores); // Debug log
      setHighScores(scores);
    } catch (error) {
      console.error('Error loading high scores:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleLevelPress = (level) => {
    setSelectedLevel(level);
    setShowModal(true);
  };

  const ScoreModal = () => {
    if (!selectedLevel) return null;

    const levelScores = highScores[selectedLevel.id];
    let sortedScores = [];

    if (levelScores) {
      const scoresArray = Array.isArray(levelScores) ? levelScores : [levelScores];
      sortedScores = scoresArray.sort((a, b) => b.score - a.score);
    }

    return (
      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedLevel.title}</Text>
              <Text style={styles.modalSubtitle}>{selectedLevel.description}</Text>
            </View>

            <ScrollView 
              style={styles.scoreList}
              showsVerticalScrollIndicator={true}
            >
              {sortedScores.length > 0 ? (
                sortedScores.map((score, index) => (
                  <View key={index} style={styles.scoreItem}>
                    <View style={styles.rankContainer}>
                      <Text style={styles.rankText}>#{index + 1}</Text>
                    </View>
                    <View style={styles.scoreDetails}>
                      <Text style={styles.playerName}>{score.userName}</Text>
                      <Text style={styles.scoreText}>{score.score} poin</Text>
                      <Text style={styles.dateText}>{formatDate(score.date)}</Text>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.noScoresText}>Belum ada skor untuk level ini</Text>
              )}
            </ScrollView>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowModal(false)}
            >
              <LinearGradient
                colors={['#4A90E2', '#357ABD']}
                style={styles.gradient}
              >
                <Text style={styles.closeButtonText}>Tutup</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={['#4A90E2', '#357ABD']}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Skor Tertinggi</Text>
        
        <ScrollView style={styles.scrollView}>
          {levels.map((level) => {
            const scoreData = highScores[level.id];
            let topScore = null;

            if (scoreData) {
              // Convert to array if it's a single score object
              const scoresArray = Array.isArray(scoreData) ? scoreData : [scoreData];
              topScore = scoresArray.sort((a, b) => b.score - a.score)[0];
            }
            
            return (
              <TouchableOpacity
                key={level.id}
                style={styles.scoreCard}
                onPress={() => handleLevelPress(level)}
              >
                <LinearGradient
                  colors={['#FFFFFF', '#F0F0F0']}
                  style={styles.gradient}
                >
                  <View style={styles.levelInfo}>
                    <Text style={styles.levelTitle}>{level.title}</Text>
                    <Text style={styles.levelDescription}>{level.description}</Text>
                  </View>
                  
                  <View style={styles.scoreContainer}>
                    {topScore ? (
                      <>
                        <View style={styles.scoreRow}>
                          <Text style={styles.scoreLabel}>Pemain Terbaik:</Text>
                          <Text style={styles.scoreValue}>{topScore.userName}</Text>
                        </View>
                        <View style={styles.scoreRow}>
                          <Text style={styles.scoreLabel}>Skor Tertinggi:</Text>
                          <Text style={styles.scoreValue}>{topScore.score}</Text>
                        </View>
                        <View style={styles.scoreRow}>
                          <Text style={styles.scoreLabel}>Tanggal:</Text>
                          <Text style={styles.scoreValue}>{formatDate(topScore.date)}</Text>
                        </View>
                        <Text style={styles.tapText}>Tap untuk lihat semua skor</Text>
                      </>
                    ) : (
                      <Text style={styles.noScoreText}>Belum ada skor</Text>
                    )}
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <ScoreModal />
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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  scrollView: {
    flex: 1,
  },
  scoreCard: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    backgroundColor: '#FFFFFF',
  },
  gradient: {
    padding: 16,
  },
  levelInfo: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    paddingBottom: 12,
  },
  levelTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  levelDescription: {
    fontSize: 16,
    color: '#666666',
  },
  scoreContainer: {
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 4,
  },
  scoreLabel: {
    fontSize: 15,
    color: '#666666',
    fontWeight: '500',
  },
  scoreValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4A90E2',
  },
  noScoreText: {
    fontSize: 15,
    color: '#666666',
    textAlign: 'center',
    fontStyle: 'italic',
    padding: 8,
  },
  tapText: {
    fontSize: 13,
    color: '#4A90E2',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
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
    width: '90%',
    maxHeight: '80%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A90E2',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  scoreList: {
    padding: 15,
    maxHeight: 400,
  },
  scoreItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  rankContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scoreDetails: {
    flex: 1,
  },
  playerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  scoreText: {
    fontSize: 14,
    color: '#4A90E2',
    fontWeight: '500',
    marginBottom: 2,
  },
  dateText: {
    fontSize: 12,
    color: '#666666',
  },
  noScoresText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    fontStyle: 'italic',
    padding: 20,
  },
  closeButton: {
    width: '90%',
    height: 45,
    marginTop: 15,
    marginBottom: 15,
    marginHorizontal: '5%',
    borderRadius: 22.5,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default HighScoresScreen; 