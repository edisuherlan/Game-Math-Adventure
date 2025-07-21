// Dibuat oleh: Edi Suherlan (audhighasu.com)
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  HIGH_SCORES: '@math_adventure_high_scores',
  UNLOCKED_LEVELS: '@math_adventure_unlocked_levels',
  LAST_GAME: '@math_adventure_last_game',
  USER_NAME: '@math_adventure_user_name',
};

// Menyimpan nama pengguna
export const saveUserName = async (name) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_NAME, name);
    return true;
  } catch (error) {
    console.error('Error saving user name:', error);
    return false;
  }
};

// Mendapatkan nama pengguna
export const getUserName = async () => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.USER_NAME);
  } catch (error) {
    console.error('Error getting user name:', error);
    return null;
  }
};

// Menyimpan skor tertinggi
export const saveHighScore = async (levelId, score, userName) => {
  try {
    const key = `highScore_${levelId}`;
    const existingScores = await getHighScores();
    const currentLevelScores = existingScores[levelId] || [];
    
    // Convert to array if it's a single score
    const scoresArray = Array.isArray(currentLevelScores) ? currentLevelScores : [currentLevelScores];
    
    // Add new score
    const newScore = {
      score,
      userName,
      date: new Date().toISOString()
    };
    
    // Add new score and sort by score
    scoresArray.push(newScore);
    scoresArray.sort((a, b) => b.score - a.score);
    
    // Keep only top 10 scores
    const topScores = scoresArray.slice(0, 10);
    
    // Update scores
    existingScores[levelId] = topScores;
    
    // Save to storage
    await AsyncStorage.setItem('highScores', JSON.stringify(existingScores));
    
    // Return true if this is a new high score
    return scoresArray[0] === newScore;
  } catch (error) {
    console.error('Error saving high score:', error);
    return false;
  }
};

// Mendapatkan semua skor tertinggi
export const getHighScores = async () => {
  try {
    const scores = await AsyncStorage.getItem('highScores');
    return scores ? JSON.parse(scores) : {};
  } catch (error) {
    console.error('Error getting high scores:', error);
    return {};
  }
};

// Membuka level baru
export const unlockLevel = async (levelId) => {
  try {
    const unlockedLevels = await getUnlockedLevels();
    if (!unlockedLevels.includes(levelId)) {
      unlockedLevels.push(levelId);
      await AsyncStorage.setItem(STORAGE_KEYS.UNLOCKED_LEVELS, JSON.stringify(unlockedLevels));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error unlocking level:', error);
    return false;
  }
};

// Mendapatkan level yang sudah dibuka
export const getUnlockedLevels = async () => {
  try {
    const levels = await AsyncStorage.getItem(STORAGE_KEYS.UNLOCKED_LEVELS);
    return levels ? JSON.parse(levels) : [1]; // Level 1 selalu terbuka
  } catch (error) {
    console.error('Error getting unlocked levels:', error);
    return [1];
  }
};

// Menyimpan data permainan terakhir
export const saveLastGame = async (gameData) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.LAST_GAME, JSON.stringify(gameData));
    return true;
  } catch (error) {
    console.error('Error saving last game:', error);
    return false;
  }
};

// Mendapatkan data permainan terakhir
export const getLastGame = async () => {
  try {
    const lastGame = await AsyncStorage.getItem(STORAGE_KEYS.LAST_GAME);
    return lastGame ? JSON.parse(lastGame) : null;
  } catch (error) {
    console.error('Error getting last game:', error);
    return null;
  }
};

// Menghapus data permainan terakhir
export const clearLastGame = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.LAST_GAME);
    return true;
  } catch (error) {
    console.error('Error clearing last game:', error);
    return false;
  }
}; 