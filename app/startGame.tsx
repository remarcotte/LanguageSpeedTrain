// startGame.tsx

import React, { useRef, useCallback } from 'react';
import { TextInput as RTextInput, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { useGameLogic } from '@/hooks/useGameLogic'; // Import the custom hook
import { useThemeColor } from '@/hooks/useThemeColor';

import { ThemedTextInput } from '@/components/ThemedTextInput';
import { ThemedPressable } from '@/components/ThemedPressable';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedScreen } from '@/components/ThemedScreen';

export default function StartGame() {
  const {
    timeLeft,
    isPaused,
    userResponse,
    currentText,
    currentCategory,
    numberCorrect,
    totalShown,
    resultIcon,
    handleBackPress,
    handlePausePress,
    handleResumePress,
    handleSkipPress,
    handleSubmitPress,
    setUserResponse,
    showGameOver,
  } = useGameLogic(); // Use the custom hook for game logic

  const inputBackgroundColor = useThemeColor({}, 'inputBackground');
  const textInputRef = useRef<RTextInput>(null);

  // Format the remaining time as MM:SS
  const formatTime = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${
      remainingSeconds < 10 ? '0' : ''
    }${remainingSeconds}`;
  }, []);

  return (
    <ThemedScreen title="Game On!" showBackButton={false}>
      {showGameOver && (
        <ThemedView
          style={[styles.overlay, { backgroundColor: inputBackgroundColor }]}
        >
          <ThemedText
            style={[
              styles.gameOverText,
              { backgroundColor: inputBackgroundColor },
            ]}
          >
            Game Over
          </ThemedText>
        </ThemedView>
      )}
      {isPaused && (
        <ThemedView
          style={[styles.overlay, { backgroundColor: inputBackgroundColor }]}
        >
          <ThemedPressable
            title="Game paused. Tap to continue."
            fontSize={20}
            onPress={handleResumePress}
          />
        </ThemedView>
      )}
      <ThemedView style={styles.header}>
        <ThemedPressable
          title="Exit Game"
          fontSize={20}
          onPress={handleBackPress}
        />
        <ThemedView style={styles.iconContainer}>
          {resultIcon && (
            <Ionicons
              size={24}
              name={resultIcon.name}
              style={[styles.resultIcon, { color: resultIcon.color }]}
            />
          )}
        </ThemedView>
        <ThemedText
          style={styles.stats}
        >{`${numberCorrect} / ${totalShown}`}</ThemedText>
      </ThemedView>
      <ThemedView style={styles.container}>
        <ThemedText style={styles.timer}>{formatTime(timeLeft)}</ThemedText>
        <ThemedText style={styles.itemText}>{currentText}</ThemedText>
        <ThemedText style={styles.categoryText}>{currentCategory}</ThemedText>
        <ThemedTextInput
          ref={textInputRef}
          style={styles.input}
          value={userResponse}
          onChangeText={setUserResponse}
          autoCorrect={false}
          autoCapitalize="none"
          autoComplete="off" // Disable autofill
          editable={true} // Keep the input editable
          selectTextOnFocus={false} // Disable text selection on focus
          contextMenuHidden={true}
          autoFocus={true}
          placeholder={`Enter ${currentCategory}...`}
          onSubmitEditing={handleSubmitPress}
        />
        <ThemedView style={styles.buttonContainer}>
          <ThemedPressable
            title="Skip"
            fontSize={20}
            onPress={handleSkipPress}
          />
          <ThemedPressable
            title="Submit"
            fontSize={20}
            onPress={handleSubmitPress}
            disabled={!userResponse}
          />
          <ThemedPressable
            title="Pause"
            fontSize={20}
            onPress={handlePausePress}
          />
        </ThemedView>
      </ThemedView>
    </ThemedScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconContainer: {
    position: 'relative',
    marginHorizontal: 10,
  },
  stats: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultIcon: {
    marginLeft: 10,
  },
  timer: {
    fontSize: 48,
    textAlign: 'center',
    marginVertical: 10,
  },
  itemText: {
    fontSize: 24,
    textAlign: 'center',
    marginVertical: 10,
  },
  categoryText: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 10,
  },
  input: {
    height: 40,
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  gameOverText: {
    fontSize: 48,
    fontWeight: 'bold',
  },
});
