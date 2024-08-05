import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { TurnAnswer } from '../types/LoggingTypes';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedScreen } from '@/components/ThemedScreen';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams } from 'expo-router';
import { useThemeColor } from '@/hooks/useThemeColor';

type IoniconName = keyof typeof Ionicons.glyphMap; // Type for Ionicon names

export default function GameHistory() {
  const backgroundColor = useThemeColor({}, 'background'); // Get background color from theme
  const textColor = useThemeColor({}, 'text'); // Get text color from theme

  // Retrieve the serialized turns string from URL parameters
  const { turnsStr } = useLocalSearchParams<{
    turnsStr: string;
  }>();

  // Parse the serialized turns string into an array of TurnAnswer objects
  const turns: TurnAnswer[] = JSON.parse(turnsStr);

  return (
    <ThemedScreen title="Game History">
      <ScrollView style={styles.scrollContainer}>
        {turns.map((turn: TurnAnswer, index: number) => (
          <ThemedView key={index} style={styles.turnContainer}>
            <ThemedView style={styles.turnHeader}>
              {/* Display a checkmark if the answer is correct, otherwise display a cross */}
              {turn.isCorrect ? (
                <Ionicons
                  size={22}
                  name="checkmark-circle"
                  style={styles.correctIcon}
                />
              ) : (
                turn.type !== 'skip' && (
                  <Ionicons
                    size={22}
                    name="close-circle"
                    style={styles.incorrectIcon}
                  />
                )
              )}
              <ThemedText style={styles.turnText}>
                {turn.text} ({turn.category})
              </ThemedText>
            </ThemedView>
            <ThemedText style={styles.responseText}>
              Your response: {turn.response || 'Skipped'}
            </ThemedText>
            {(!turn.isCorrect || turn.type === 'skip') && (
              <ThemedText style={styles.correctResponseText}>
                Correct response: {turn.answer}
              </ThemedText>
            )}
          </ThemedView>
        ))}
      </ScrollView>
    </ThemedScreen>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  turnContainer: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 8,
  },
  turnHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  turnText: {
    fontSize: 18,
    marginLeft: 8,
  },
  responseText: {
    fontSize: 18,
  },
  correctResponseText: {
    fontSize: 18,
    color: 'green',
  },
  correctIcon: {
    color: 'green',
    fontWeight: '900',
  },
  incorrectIcon: {
    color: 'red',
    fontWeight: '900',
  },
});
