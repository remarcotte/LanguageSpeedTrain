import React, { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { StyleSheet, Alert, FlatList } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedPressable } from '@/components/ThemedPressable';
import { ThemedDropdownPicker } from '@/components/ThemedDropdownPicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoggingService from '@/services/LoggingService'; // Adjust the import based on your project structure
import DeckService from '@/services/DeckService'; // Adjust the import based on your project structure
import Histogram from '@/components/ThemedHistogram'; // Import your histogram component
import { LogDeckSummary, GameSummary, DeckDetail } from '../types/LoggingTypes'; // Adjust the import based on your project structure

type DropDownItem = { label: string; value: string };

export default function Statistics() {
  const loggingService = LoggingService.getInstance();
  const deckService = DeckService.getInstance();

  const [open, setOpen] = useState(false);
  const [selectedDeck, setSelectedDeck] = useState<string | null>(null);
  const [logDeckSummary, setLogDeckSummary] = useState<LogDeckSummary | null>(
    null,
  );
  const [deckDetail, setDeckDetail] = useState<DeckDetail[] | null>(null);
  const [games, setGames] = useState<GameSummary[] | null>(null);
  const [items, setItems] = useState<DropDownItem[]>([]);

  useEffect(() => {
    // Fetch the list of deck summaries from DeckService
    const fetchDeckSummaries = async () => {
      const loadedDecks = await deckService.getDecksSummary();
      const decks = loadedDecks
        .map((deck) => deck.deckName)
        .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

      const storedDeck = await AsyncStorage.getItem('selectedDeck');
      const defaultDeck = storedDeck || decks[0] || '';
      setSelectedDeck(defaultDeck || null);
      setItems(decks.map((deck) => ({ label: deck, value: deck })));
    };

    fetchDeckSummaries();
  }, []);

  const handleDeckChange = async (deckName: string) => {
    setSelectedDeck(deckName);
    const result = await loggingService.getDeckSummary(deckName);
    if (result) {
      setLogDeckSummary(result.summary);
      setDeckDetail(result.details);
      setGames(result.games);
    } else {
      setLogDeckSummary(null);
      setDeckDetail(null);
      setGames(null);
    }
  };

  const clearStatistics = async (deckOnly: boolean) => {
    try {
    if (deckOnly) {
      if (!selectedDeck) return;
      await loggingService.clearDeck(selectedDeck);
      Alert.alert('Statistics cleared for deck: ' + selectedDeck);
    } else {
      await loggingService.clearAll();
      Alert.alert('All statistics cleared');
      setSelectedDeck(null);
    }
    setLogDeckSummary(null);
    setDeckDetail(null);
  } catch (error) {
    console.error('Error deleting statistics.', error);
  }
  };

  const verifyClear = async (deckOnly: boolean) => {
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
      { cancelable: false },
    );
  }

  const showDeckDetail = async () => {
    if (selectedDeck && deckDetail) {
      router.navigate({
        pathname: '/statisticsDeckDetail',
        params: {
          deckName: selectedDeck,
          detailsStr: JSON.stringify(deckDetail),
        }
      });
    }
  };

  const histogramData = games
    ? games
        .slice(0, 10)
        .map((game) =>
          game?.attempted === 0
            ? 0
            : parseFloat(
                ((60 * (game?.correct ?? 0)) / game?.duration).toFixed(2),
              ),
        )
        .reverse()
    : [];

  const lineChartData = games
    ? games
        .slice(0, 10)
        .map((game) =>
          game?.attempted === 0
            ? 0
            : parseFloat(
                ((100 * (game?.correct ?? 0)) / game?.attempted).toFixed(2),
              ),
        )
        .reverse()
    : [];

  return (
    <ThemedView style={styles.container}>
      <ThemedDropdownPicker
        open={open}
        value={selectedDeck}
        items={items}
        setOpen={setOpen}
        setValue={setSelectedDeck}
        setItems={setItems}
        placeholder="Select a deck"
        onChangeValue={(value) => handleDeckChange(value ? value : '')}
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
                    <ThemedText style={styles.label}>Statistics</ThemedText>
                    <ThemedText style={styles.detail}>Plays: {logDeckSummary.timesPlayed}</ThemedText>
                    <ThemedText  style={styles.detail}>
                      Least Correct: {logDeckSummary.minCorrect}
                    </ThemedText>
                    <ThemedText style={styles.detail}>
                      Most Correct: {logDeckSummary.maxCorrect}
                    </ThemedText>
                    <ThemedText  style={styles.detail}>
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
                    <ThemedText style={styles.label}>Recent Correct/Minute</ThemedText>
                    <Histogram
                      data={histogramData.length ? histogramData : [0]}
                    />
                    <ThemedText style={styles.label}>Recent Percent Correct</ThemedText>
                    <Histogram
                      data={histogramData.length ? lineChartData : [0]}
                    />
                  </ThemedView>
                );
              } else if (item.key === 'buttons') {
                return (
                  <ThemedView>
                    <ThemedPressable
                      title="Show Detail Statistics"
                      onPress={showDeckDetail}
                      fontSize={20}
                    />
                    <ThemedPressable
                      title="Clear Deck Statistics"
                      onPress={() => verifyClear(true)}
                      fontSize={20}
                    />
                    <ThemedPressable
                      title="Clear All Statistics"
                      onPress={() => verifyClear(false)}
                      fontSize={20}
                    />
                    <ThemedPressable
                      title="Home"
                      fontSize={20}
                      onPress={() => router.navigate('/home')}
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
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  button: {
    marginBottom: 6,
  },
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
});
