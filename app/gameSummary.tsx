// gameSummary.tsx

import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

import { useThemeColor } from '@/hooks/useThemeColor';

import { ThemedPressable } from '@/components/ThemedPressable';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedScreen } from '@/components/ThemedScreen';

import { TurnAnswer } from '@/types/LoggingTypes';
import { RATING_THRESHOLDS } from '@/constants/General';

type IoniconName = keyof typeof Ionicons.glyphMap; // Define type for Ionicon names

export default function GameSummary() {
  const inputBackgroundColor = useThemeColor({}, 'inputBackground'); // Get theme color

  // Get search params from the URL
  const { deckName, category, duration, turnsStr } = useLocalSearchParams<{
    deckName: string;
    category: string;
    duration: string;
    turnsStr: string;
  }>();

  const turns: TurnAnswer[] = JSON.parse(turnsStr); // Parse turns string to array

  const [gameRating, setGameRating] = useState(1); // State to hold game rating

  // Calculate statistics from the turns
  const total = turns.length;
  const correct = turns.filter((turn) => turn.isCorrect).length;
  const skipped = turns.filter((turn) => turn.type === 'skip').length;
  const incorrect = total - correct - skipped;

  // Calculate percentage metrics
  const percentCorrect = (total ? (correct / total) * 100 : 0).toFixed(2);
  const percentSkipped = (total ? (skipped / total) * 100 : 0).toFixed(2);
  const correctPerMinute = (correct / (parseInt(duration) / 60)).toFixed(2);

  // Calculate game rating based on percentage correct
  useEffect(() => {
    const pctCorrect = Number(percentCorrect);
    if (pctCorrect === RATING_THRESHOLDS[2]) {
      setGameRating(4);
    } else if (pctCorrect >= RATING_THRESHOLDS[1]) {
      setGameRating(3);
    } else if (pctCorrect >= RATING_THRESHOLDS[0]) {
      setGameRating(2);
    } else if (pctCorrect > 0) {
      setGameRating(1);
    } else {
      setGameRating(0);
    }
  }, [percentCorrect]);

  return (
    <ThemedScreen
      title="Game Summary"
      showBackButton={false}
      style={styles.container}
    >
      {/* Header buttons */}
      <ThemedView style={styles.header}>
        <ThemedPressable
          type="normal"
          title="New Game"
          onPress={() => router.navigate('/newGame')}
        />
        <ThemedPressable
          type="normal"
          title="Replay Game"
          onPress={() =>
            router.replace({
              pathname: '/startGame',
              params: { deckName, category, duration },
            })
          }
        />
      </ThemedView>
      {/* Game options section */}
      <ThemedView style={styles.section}>
        <ThemedText type="head2">Game Options</ThemedText>
        <ThemedText type="normal" style={styles.optionsText}>
          Deck: {deckName}
        </ThemedText>
        <ThemedText type="normal" style={styles.optionsText}>
          Category: {category}
        </ThemedText>
        <ThemedText type="normal" style={styles.optionsText}>
          Time: {duration} seconds
        </ThemedText>
        <ThemedView style={styles.ratingContainer}>
          {[...Array(4)].map((_, i) => (
            <Ionicons
              key={i}
              size={30}
              name={i < gameRating ? 'star' : 'star-outline'}
              style={i < gameRating ? styles.goldStar : styles.grayStar}
            />
          ))}
        </ThemedView>
      </ThemedView>
      {/* Statistics section */}
      <ThemedView style={styles.section}>
        <ThemedText type="head2">Statistics</ThemedText>
        <ThemedView style={styles.row}>
          <ThemedText type="normal-bold">Correct: {correct}</ThemedText>
          <ThemedText type="normal-bold">Incorrect: {incorrect}</ThemedText>
          <ThemedText type="normal-bold">Skipped: {skipped}</ThemedText>
        </ThemedView>
      </ThemedView>
      {/* Metrics section */}
      <ThemedView style={styles.section}>
        <ThemedText type="head2">Metrics</ThemedText>
        <ThemedView style={styles.row}>
          <ThemedText type="normal-bold">Correct: {percentCorrect}%</ThemedText>
          <ThemedText type="normal-bold">Skipped: {percentSkipped}%</ThemedText>
        </ThemedView>
        <ThemedText type="normal-bold">
          Correct/Minute: {correctPerMinute}
        </ThemedText>
      </ThemedView>
      {/* Footer buttons */}
      <ThemedView style={styles.section}>
        {total > 0 && (
          <ThemedPressable
            type="wide"
            title="Game History"
            onPress={() =>
              router.navigate({
                pathname: '/gameHistory',
                params: { turnsStr: JSON.stringify(turns) },
              })
            }
          />
        )}
        <ThemedPressable
          type="wide"
          title="View Statistics"
          onPress={() => router.navigate('/statistics')}
        />
        <ThemedPressable
          type="wide"
          title="Home"
          onPress={() => router.navigate('/home')}
        />
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
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  section: {
    marginBottom: 16,
    alignItems: 'center',
  },
  optionsText: {
    marginBottom: 4,
    textAlign: 'center',
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
    marginBottom: 12,
  },
  goldStar: {
    color: 'gold',
  },
  grayStar: {
    color: 'gray',
  },
});
