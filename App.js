// Dibuat oleh: Edi Suherlan (audhighasu.com)
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './src/screens/HomeScreen';
import GameScreen from './src/screens/GameScreen';
import LevelScreen from './src/screens/LevelScreen';
import HighScoresScreen from './src/screens/HighScoresScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import FloatingMusicControl from './src/components/FloatingMusicControl';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Game" component={GameScreen} />
          <Stack.Screen name="Levels" component={LevelScreen} />
          <Stack.Screen name="HighScores" component={HighScoresScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
        </Stack.Navigator>
        {/* Kontrol musik floating */}
        <FloatingMusicControl />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App; 