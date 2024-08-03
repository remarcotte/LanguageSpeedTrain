import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { DeckDetail } from '../types/LoggingTypes';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedScreen } from '@/components/ThemedScreen';
import { useLocalSearchParams } from 'expo-router';

export default function StatisticsDeckDetail() {
  const { deckName, detailsStr } = useLocalSearchParams<{
    deckName: string;
    detailsStr: string;
  }>();

  const details = JSON.parse(detailsStr);

  return (
    <ThemedScreen title="Deck Detail Statistics">
      <ThemedText style={styles.title}>{deckName} History</ThemedText>
      <ScrollView style={styles.scrollContainer}>
        {details.map((detail: DeckDetail, index: number) => (
          <ThemedView key={index} style={styles.detailContainer}>
            <ThemedView style={styles.detailHeader}>
              <ThemedText style={styles.detailTextLeft}>
                {detail.text}
              </ThemedText>
              {detail && detail.numberAttempts > 0 && (
                <ThemedText style={styles.detailTextRight}>
                  {((100 * detail.numberCorrect) / detail.numberAttempts)
                    .toFixed(2)
                    .replace(/\.00$/, '')
                    .replace(/(\.\d)0$/, '$1')}
                  %
                </ThemedText>
              )}
            </ThemedView>
            <ThemedText style={styles.metricText}>
              Attempts: {detail.numberAttempts}, Correct: {detail.numberCorrect}
            </ThemedText>
          </ThemedView>
        ))}
      </ScrollView>
    </ThemedScreen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  scrollContainer: {
    flexGrow: 1,
    marginTop: 8,
  },
  detailContainer: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 8,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailTextLeft: {
    fontSize: 18,
    marginLeft: 8,
  },
  detailTextRight: {
    fontSize: 18,
    marginRight: 8,
  },
  metricText: {
    fontSize: 18,
  },
});
