// statisticsDeckDetail.tsx

import React, { useMemo } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedScreen } from '@/components/ThemedScreen';
import { ThemedFlatList } from '@/components/ThemedFlatList';

import { DeckDetail } from '@/types/LoggingTypes';

export default function StatisticsDeckDetail() {
  // Extract deckName and detailsStr from route parameters
  const { deckName, detailsStr } = useLocalSearchParams<{
    deckName: string;
    detailsStr: string;
  }>();

  // Parse the JSON string to get the deck details
  const details: DeckDetail[] = useMemo(
    () => JSON.parse(detailsStr),
    [detailsStr]
  );

  return (
    <ThemedScreen title="Deck Detail Statistics">
      <ThemedText type="head2">{deckName} History</ThemedText>
      <ThemedFlatList
        data={details}
        keyExtractor={(item, index) => index.toString()} // Ensure unique keys for each item
        renderItem={({ item }) => (
          <ThemedView style={styles.detailContainer}>
            <ThemedView style={styles.detailHeader}>
              <ThemedText type="list-item-title" style={styles.detailTextLeft}>
                {item.text}
              </ThemedText>
              {item.numberAttempts > 0 && (
                <ThemedText type="list-item" style={styles.detailTextRight}>
                  {((100 * item.numberCorrect) / item.numberAttempts)
                    .toFixed(2) // Round to two decimal places
                    .replace(/\.00$/, '') // Remove trailing .00
                    .replace(/(\.\d)0$/, '$1')}
                  %
                </ThemedText>
              )}
            </ThemedView>
            <ThemedText type="list-item">
              Attempts: {item.numberAttempts}, Correct: {item.numberCorrect}
            </ThemedText>
          </ThemedView>
        )}
        contentContainerStyle={styles.contentContainer} // Adjust contentContainerStyle for FlatList
      />
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
  contentContainer: {
    flexGrow: 1,
    marginTop: 8,
    paddingBottom: 20, // Add padding to ensure last item is visible
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
    marginLeft: 8,
  },
  detailTextRight: {
    marginRight: 8,
  },
});
