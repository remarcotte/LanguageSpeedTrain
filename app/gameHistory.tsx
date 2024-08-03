import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { TurnAnswer } from '../types/LoggingTypes';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedScreen } from '@/components/ThemedScreen';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams } from 'expo-router';
import { useThemeColor } from '@/hooks/useThemeColor';

type IoniconName = keyof typeof Ionicons.glyphMap;

export default function GameHistory() {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  const { turnsStr } = useLocalSearchParams<{
    turnsStr: string;
  }>();

  const turns: TurnAnswer[] = JSON.parse(turnsStr);

  return (
    <ThemedScreen title="Game History">
      <ScrollView style={styles.scrollContainer}>
        {turns.map((turn: TurnAnswer, index: number) => (
          <ThemedView key={index} style={styles.turnContainer}>
            <ThemedView style={styles.turnHeader}>
              {turn.isCorrect && (
                <Ionicons
                  size={22}
                  name={'checkmark-circle'}
                  style={{ color: 'green', fontWeight: '900' }}
                />
              )}
              {!turn.isCorrect && turn.type !== 'skip' && (
                <Ionicons
                  size={22}
                  name={'close-circle'}
                  style={{ color: 'red', fontWeight: '900' }}
                />
              )}
              <ThemedText style={styles.turnText}>
                {turn.text} ({turn.category})
              </ThemedText>
            </ThemedView>
            <ThemedText style={styles.responseText}>
              Your response: {turn.response || 'Skipped'}
            </ThemedText>
            {(!turn.isCorrect || turn.type === 'skip') && (
              <ThemedText style={[styles.correctResponseText]}>
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
});
