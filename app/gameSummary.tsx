import React, { useEffect, useState } from 'react';
import { TextInput as RTextInput, StyleSheet } from 'react-native';
import { ThemedPressable } from '@/components/ThemedPressable';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';
import { TurnAnswer } from '../types/LoggingTypes';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams } from 'expo-router';
import { useThemeColor } from '@/hooks/useThemeColor';

type IoniconName = keyof typeof Ionicons.glyphMap;

export default function GameSummary() {
  const inputBackgroundColor = useThemeColor({}, 'inputBackground');

  const { deckName, category, duration, turnsStr } = useLocalSearchParams<{
    deckName: string;
    category: string;
    duration: string;
    turnsStr: string;
  }>();

  const turns: TurnAnswer[] = JSON.parse(turnsStr);

  const [gameRating, setGameRating] = useState(1);

  const total = turns.length;
  const correct = turns.filter((turn) => turn.isCorrect).length;
  const skipped = turns.filter((turn) => turn.type === 'skip').length;
  const incorrect = total - correct - skipped;

  const percentCorrect = (total ? (correct / total) * 100 : 0).toFixed(2);
  const percentSkipped = (total ? (skipped / total) * 100 : 0).toFixed(2);
  const correctPerMinute = (correct / (parseInt(duration) / 60)).toFixed(2);

  // Calculate game rating based on percentage correct
  useEffect(() => {
    const pctCorrect = Number(percentCorrect);
    if (pctCorrect == 100) {
      setGameRating(4);
    } else if (pctCorrect >= 85) {
      setGameRating(3);
    } else if (pctCorrect >= 60) {
      setGameRating(2);
    } else {
      setGameRating(1);
    }
  }, [percentCorrect]);

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedPressable
          title="New Game"
          fontSize={20}
          onPress={() => router.navigate('/newGame')}
        />
        <ThemedPressable
          title="Replay Game"
          fontSize={20}
          onPress={() =>
            router.replace(
              { pathname: '/startGame',
                params: { deckName, category, duration } } )
          }
        />
      </ThemedView>
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionLabel}>Game Options</ThemedText>
        <ThemedText style={styles.optionText}>Deck: {deckName}</ThemedText>
        <ThemedText style={styles.optionText}>Category: {category}</ThemedText>
        <ThemedText style={styles.optionText}>Time: {duration} seconds</ThemedText>
        <ThemedView style={styles.ratingContainer}>
          {[...Array(4)].map((_, i) => (
            (i < gameRating) ?
            <Ionicons
              size={30}
              name={'star-outline'}
              style={ {color: 'lightgray'} } />
            :
            <Ionicons
              size={30}
              name={'star'}
              style={ {color: 'gold'} } />
          ))}
        </ThemedView>
      </ThemedView>
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionLabel}>Statistics</ThemedText>
        <ThemedView style={styles.row}>
          <ThemedText style={styles.statText}>Correct: {correct}</ThemedText>
          <ThemedText style={styles.statText}>Incorrect: {incorrect}</ThemedText>
          <ThemedText style={styles.statText}>Skipped: {skipped}</ThemedText>
        </ThemedView>
      </ThemedView>
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionLabel}>Metrics</ThemedText>
        <ThemedView style={styles.row}>
          <ThemedText style={styles.metricText}>Correct: {percentCorrect}%</ThemedText>
          <ThemedText style={styles.metricText}>Skipped: {percentSkipped}%</ThemedText>
        </ThemedView>
        <ThemedText style={styles.metricText}>
          Correct/Minute: {correctPerMinute}
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.section}>
        {(total) ?
          <ThemedPressable
            title="Game History"
            fontSize={20}
            onPress={() => router.navigate(
              { pathname: '/gameHistory',
                params: { turnsStr: JSON.stringify(turns) } } ) }
          />
        : ''
        }
        <ThemedPressable
          title="View Statistics"
          fontSize={20}
          onPress={() => router.navigate('/statistics')}
        />
        <ThemedPressable
          title="Home"
          fontSize={20}
          onPress={() => router.navigate('/home')}
        />
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  section: {
    marginBottom: 16,
    alignItems: 'center',
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  optionText: {
    fontSize: 16,
    marginBottom: 4,
    textAlign: 'center',
  },
  statText: {
    fontSize: 16,
    marginBottom: 4,
    fontWeight: 'bold',
  },
  metricText: {
    fontSize: 20, // Increased font size
    marginBottom: 4,
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
    marginTop: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
  },
});
