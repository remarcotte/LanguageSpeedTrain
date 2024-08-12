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
            type="huge"
            style={[{ backgroundColor: inputBackgroundColor }]}
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
            type="normal"
            title="Game paused. Tap to continue."
            onPress={handleResumePress}
          />
        </ThemedView>
      )}
      <ThemedView style={styles.header}>
        <ThemedView style={styles.edgeItem}>
          <ThemedPressable
            type="normal"
            title="Exit Game"
            onPress={handleBackPress}
          />
        </ThemedView>
        <ThemedView
          style={[
            styles.edgeItem,
            styles.statsView,
            { borderColor: resultIcon?.color },
          ]}
        >
          <ThemedText type="normal-bold" style={{ color: resultIcon?.color }}>
            {`${numberCorrect} / ${totalShown}`}
          </ThemedText>
        </ThemedView>
      </ThemedView>
      <ThemedView style={styles.container}>
        <ThemedText type="huge">{formatTime(timeLeft)}</ThemedText>
        <ThemedText type="bigger">{currentText}</ThemedText>
        <ThemedText type="head2">{currentCategory}</ThemedText>
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
            type="normal"
            title="Skip"
            onPress={handleSkipPress}
          />
          <ThemedPressable
            type="normal"
            title="Submit"
            onPress={handleSubmitPress}
            disabled={!userResponse}
          />
          <ThemedPressable
            type="normal"
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
    alignItems: 'center', // Vertically centers all items
    justifyContent: 'space-between', // Distributes items evenly
    paddingHorizontal: 16, // Adds padding to the sides of the container
  },
  edgeItem: {
    flex: 0, // Edge items should not expand
    width: 'auto', // Ensure they size to content
    justifyContent: 'center', // Center content within the item
  },
  statsView: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginHorizontal: 2,
    borderWidth: 2,
    borderRadius: 5,
  },
  centerWrapper: {
    flex: 0, // Center wrapper takes up all remaining space
    width: 50,
    alignItems: 'center', // Centers the centerItem horizontally
  },
  centerItem: {
    // This item now only needs to center its content
    justifyContent: 'center', // Center the icon vertically
  },
  stats: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultIcon: {
    // Remove extra margin to keep the icon centered
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
