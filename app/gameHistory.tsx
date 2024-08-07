// gameHistory.tsx

import React from 'react';
import { StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams } from 'expo-router';

import { useThemeColor } from '@/hooks/useThemeColor';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedScreen } from '@/components/ThemedScreen';
import { ThemedFlatList } from '@/components/ThemedFlatList'; // Assuming you have this component

import { TurnAnswer } from '@/types/LoggingTypes';

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

  // Render item function for FlatList
  const renderItem = ({ item }: { item: TurnAnswer }) => (
    <ThemedView style={styles.turnContainer}>
      <ThemedView style={styles.turnHeader}>
        {/* Display a checkmark if the answer is correct, otherwise display a cross */}
        {item.isCorrect ? (
          <Ionicons
            size={22}
            name="checkmark-circle"
            style={styles.correctIcon}
          />
        ) : (
          item.type !== 'skip' && (
            <Ionicons
              size={22}
              name="close-circle"
              style={styles.incorrectIcon}
            />
          )
        )}
        <ThemedText type="list-item">
          {item.text} ({item.category})
        </ThemedText>
      </ThemedView>
      <ThemedText type="list-item">
        Your response: {item.response || 'Skipped'}
      </ThemedText>
      {(!item.isCorrect || item.type === 'skip') && (
        <ThemedText type="list-item" style={styles.correctResponseText}>
          Correct response: {item.answer}
        </ThemedText>
      )}
    </ThemedView>
  );

  return (
    <ThemedScreen title="Game History">
      <ThemedFlatList
        data={turns}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.scrollContainer}
      />
    </ThemedScreen>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 8,
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
