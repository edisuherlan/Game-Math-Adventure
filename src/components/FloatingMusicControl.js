// Dibuat oleh: Edi Suherlan (audhighasu.com)
import React, { useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Animated, PanResponder } from 'react-native';
import { Audio } from 'expo-av';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const MUSIC_PATH = require('../assets/Fun Time.mp3');

const FloatingMusicControl = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [sound, setSound] = useState(null);
  const pan = useRef(new Animated.ValueXY({ x: 20, y: 80 })).current;

  useEffect(() => {
    loadSound();
    return () => { if (sound) sound.unloadAsync(); };
    // eslint-disable-next-line
  }, []);

  const loadSound = async () => {
    const { sound: playbackObject } = await Audio.Sound.createAsync(
      MUSIC_PATH,
      { shouldPlay: true, isLooping: true, volume: 0.5 }
    );
    setSound(playbackObject);
  };

  const togglePlay = async () => {
    if (!sound) return;
    const status = await sound.getStatusAsync();
    if (isPlaying) {
      if (status.isPlaying) {
        await sound.pauseAsync();
      }
      setIsPlaying(false);
    } else {
      if (!status.isPlaying) {
        await sound.playAsync();
      }
      setIsPlaying(true);
    }
  };

  // PanResponder hanya untuk handle drag
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({ x: pan.x._value, y: pan.y._value });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: (e, gestureState) => {
        pan.setValue({ x: gestureState.dx, y: gestureState.dy });
      },
      onPanResponderRelease: () => {
        pan.flattenOffset();
      },
    })
  ).current;

  return (
    <Animated.View
      style={[styles.floating, { transform: pan.getTranslateTransform() }]}
      pointerEvents="box-none"
    >
      <View style={styles.button}>
        <View {...panResponder.panHandlers} style={styles.handleDrag}>
          <MaterialCommunityIcons name="arrow-all" size={24} color="#bbb" />
        </View>
        <TouchableOpacity onPress={togglePlay} activeOpacity={0.8} style={styles.playArea}>
          <MaterialCommunityIcons name={isPlaying ? 'music-circle' : 'music-circle-outline'} size={32} color="#357ABD" />
          <Text style={styles.text}>{isPlaying ? 'Pause' : 'Play'}</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  floating: {
    position: 'absolute',
    zIndex: 9999,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 24,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#e0eafc',
  },
  handleDrag: {
    padding: 6,
    marginRight: 4,
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'grab',
  },
  playArea: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  text: {
    marginLeft: 8,
    color: '#357ABD',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default FloatingMusicControl; 