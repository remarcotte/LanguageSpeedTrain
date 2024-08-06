// statistics.tsx

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { StyleSheet, Alert, FlatList } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedPressable } from '@/components/ThemedPressable';
import { ThemedDropdownPicker } from '@/components/ThemedDropdownPicker';
import { ThemedScreen } from '@/components/ThemedScreen';
import { SimpleHistogram } from '@/components/ThemedHistogram'; // Import your histogram component

import { LoggingService } from '@/services/LoggingService'; // Adjust the import based on your project structure
import { DeckService } from '@/services/DeckService'; // Adjust the import based on your project structure
import { ErrorService } from '@/services/ErrorService';
import { LogDeckSummary, GameSummary, DeckDetail } from '@/types/LoggingTypes'; // Adjust the import based on your project structure
import { ErrorActionType } from '@/types/ErrorTypes';

import { HISTOGRAM_ITEM_COUNT } from '@/constants/General';

type DropDownItem = { label: string; value: string };

export default function Statistics() {
  const loggingService = LoggingService.getInstance(); // Logging service instance
  const deckService = DeckService.getInstance(); // Deck service instance
  const errorService = ErrorService.getInstance(); // Error service instance

  // State variables for managing UI and data
  const [open, setOpen] = useState(false); // Dropdown open state
  const [selectedDeck, setSelectedDeck] = useState<string | null>(null); // Selected deck
  const [logDeckSummary, setLogDeckSummary] = useState<LogDeckSummary | null>(
    null
  ); // Summary of log data for selected deck
  const [deckDetail, setDeckDetail] = useState<DeckDetail[] | null>(null); // Detailed deck data
  const [games, setGames] = useState<GameSummary[] | null>(null); // Game data
  const [items, setItems] = useState<DropDownItem[]>([]); // Items for the dropdown

  useEffect(() => {
    // Fetch the list of deck summaries from DeckService and set the default deck
    const initializeDecks = async () => {
      try {
        const loadedDecks = await deckService.getDecksSummary(); // Fetch deck summaries
        const decks = loadedDecks
          .map((deck) => deck.deckName)
          .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase())); // Sort decks alphabetically

        setItems(decks.map((deck) => ({ label: deck, value: deck }))); // Set items for dropdown

        const storedDeck = await AsyncStorage.getItem('selectedDeck'); // Get stored deck from AsyncStorage
        const defaultDeck = storedDeck || decks[0] || ''; // Set default deck
        setSelectedDeck(defaultDeck || null); // Set selected deck

        if (defaultDeck) {
          fetchDeckData(defaultDeck); // Fetch data for default deck
        }
      } catch (error) {
        await errorService.logError(
          ErrorActionType.TOAST,
          27,
          'Unable to load decks and settings.',
          error
        );
      }
    };

    initializeDecks();
  }, []);

  // Fetch data for a specific deck
  const fetchDeckData = async (deckName: string) => {
    try {
      const result = await loggingService.getDeckSummary(deckName); // Get summary for deck
      if (result) {
        setLogDeckSummary(result.summary); // Set log summary
        setDeckDetail(result.details); // Set deck details
        setGames(result.games); // Set game data
      } else {
        setLogDeckSummary(null);
        setDeckDetail(null);
        setGames(null);
      }
    } catch (error) {
      await errorService.logError(
        ErrorActionType.TOAST,
        28,
        'Unable to fetch deck data.',
        error
      );
    }
  };

  // Handle change in selected deck
  const handleDeckChange = useCallback(async (deckName: string) => {
    setSelectedDeck(deckName);
    fetchDeckData(deckName); // Fetch data for the new selected deck
  }, []);

  // Clear statistics, either for a single deck or all decks
  const clearStatistics = useCallback(
    async (deckOnly: boolean) => {
      try {
        if (deckOnly) {
          if (!selectedDeck) return;
          await loggingService.clearDeck(selectedDeck); // Clear statistics for selected deck
          await errorService.logError(
            ErrorActionType.TOAST,
            29,
            `Statistics cleared: ${selectedDeck}`
          );
        } else {
          await loggingService.clearAll(); // Clear all statistics
          await errorService.logError(
            ErrorActionType.TOAST,
            30,
            'All statistics cleared.'
          );
          setSelectedDeck(null);
        }
        setLogDeckSummary(null);
        setDeckDetail(null);
      } catch (error) {
        await errorService.logError(
          ErrorActionType.TOAST,
          31,
          'Error clearing statistics.',
          error
        );
      }
    },
    [selectedDeck]
  );

  // Verify before clearing statistics
  const verifyClear = useCallback(
    async (deckOnly: boolean) => {
      const title = deckOnly ? 'Reset Deck Statistics?' : 'Reset All Data?';
      const msg = deckOnly
        ? 'Resetting deck statistics removes history, but retains decks. Continue?'
        : 'Resetting all deletes all statistics. Decks will not be deleted. Continue?';
      Alert.alert(
        title,
        msg,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Continue',
            onPress: () => clearStatistics(deckOnly),
            style: 'destructive',
          },
        ],
        { cancelable: false }
      );
    },
    [clearStatistics]
  );

  // Navigate to deck detail view
  const showDeckDetail = useCallback(async () => {
    if (selectedDeck && deckDetail) {
      router.navigate({
        pathname: '/statisticsDeckDetail',
        params: {
          deckName: selectedDeck,
          detailsStr: JSON.stringify(deckDetail),
        },
      });
    }
  }, [selectedDeck, deckDetail]);

  // Prepare histogram data from games
  const histogramData = useMemo(() => {
    return games
      ? games
          .slice(0, HISTOGRAM_ITEM_COUNT)
          .map((game) =>
            game?.attempted === 0
              ? 0
              : parseFloat(
                  ((60 * (game?.correct ?? 0)) / game?.duration).toFixed(2)
                )
          )
          .reverse()
      : [];
  }, [games]);

  // Prepare line chart data from games
  const lineChartData = useMemo(() => {
    return games
      ? games
          .slice(0, HISTOGRAM_ITEM_COUNT)
          .map((game) =>
            game?.attempted === 0
              ? 0
              : parseFloat(
                  ((100 * (game?.correct ?? 0)) / game?.attempted).toFixed(2)
                )
          )
          .reverse()
      : [];
  }, [games]);

  return (
    <ThemedScreen title="Statistics">
      <ThemedText style={styles.label}>Select Deck</ThemedText>
      <ThemedDropdownPicker
        open={open}
        value={selectedDeck}
        items={items}
        setOpen={setOpen}
        setValue={setSelectedDeck}
        setItems={setItems}
        placeholder="Select a deck"
        onChangeValue={(value: any) => handleDeckChange(value ? value : '')}
        style={styles.dropdown}
        textStyle={styles.dropdownText}
        dropDownContainerStyle={styles.dropdownContainer}
        zIndex={3000}
      />

      {!logDeckSummary ? (
        <ThemedText>No Statistics - Deck has not been played.</ThemedText>
      ) : (
        selectedDeck &&
        logDeckSummary && (
          <FlatList
            data={[{ key: 'summary' }, { key: 'charts' }, { key: 'buttons' }]}
            renderItem={({ item }) => {
              if (item.key === 'summary') {
                return (
                  <ThemedView>
                    <ThemedText style={styles.label}>
                      Deck Statistics
                    </ThemedText>
                    <ThemedText style={styles.detail}>
                      Plays: {logDeckSummary.timesPlayed}
                    </ThemedText>
                    <ThemedText style={styles.detail}>
                      Least Correct: {logDeckSummary.minCorrect}
                    </ThemedText>
                    <ThemedText style={styles.detail}>
                      Most Correct: {logDeckSummary.maxCorrect}
                    </ThemedText>
                    <ThemedText style={styles.detail}>
                      Least Correct %: {logDeckSummary.minCorrectPerAttempt}%
                    </ThemedText>
                    <ThemedText style={styles.detail}>
                      Most Correct %: {logDeckSummary.maxCorrectPerAttempt}%
                    </ThemedText>
                    <ThemedText style={styles.detail}>
                      Lowest Rate: {logDeckSummary.minCorrectPerMinute}
                    </ThemedText>
                    <ThemedText style={styles.detail}>
                      Highest Rate: {logDeckSummary.maxCorrectPerMinute}
                    </ThemedText>
                  </ThemedView>
                );
              } else if (deckDetail && item.key === 'charts') {
                return (
                  <ThemedView>
                    <ThemedText style={styles.label}>
                      Recent Correct/Minute
                    </ThemedText>
                    <SimpleHistogram
                      data={histogramData.length ? histogramData : [0]} // Display histogram data
                    />
                    <ThemedText style={styles.label}>
                      Recent Percent Correct
                    </ThemedText>
                    <SimpleHistogram
                      data={histogramData.length ? lineChartData : [0]} // Display line chart data
                    />
                  </ThemedView>
                );
              } else if (item.key === 'buttons') {
                return (
                  <ThemedView>
                    <ThemedPressable
                      title="Deck Detail Statistics"
                      onPress={showDeckDetail} // Navigate to deck details
                      fontSize={20}
                      style={styles.bottomButton}
                    />
                    <ThemedPressable
                      title="Clear Deck Statistics"
                      onPress={() => verifyClear(true)} // Verify before clearing deck statistics
                      fontSize={20}
                      style={styles.bottomButton}
                    />
                    <ThemedPressable
                      title="Clear All Statistics"
                      onPress={() => verifyClear(false)} // Verify before clearing all statistics
                      fontSize={20}
                      style={styles.bottomButton}
                    />
                    <ThemedPressable
                      title="Home"
                      fontSize={20}
                      onPress={() => router.navigate('/home')} // Navigate to home
                      style={styles.bottomButton}
                    />
                  </ThemedView>
                );
              }
              return null;
            }}
            keyExtractor={(item) => item.key}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        )
      )}
    </ThemedScreen>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    marginBottom: 16,
    borderWidth: 1,
    borderRadius: 5,
  },
  dropdownText: {
    fontSize: 16,
  },
  dropdownContainer: {
    borderWidth: 1,
    borderRadius: 5,
  },
  label: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    marginVertical: 8,
  },
  detail: {
    fontSize: 18,
    paddingBottom: 2,
  },
  bottomButton: {
    marginHorizontal: 16,
  },
});
