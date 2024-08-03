import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { ThemedPressable } from '../components/ThemedPressable';
import { ThemedScreen } from '@/components/ThemedScreen';
import { router } from 'expo-router';
import { ThemedDropdownPicker } from '../components/ThemedDropdownPicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useThemeColor } from '@/hooks/useThemeColor';
import DeckService from '../services/DeckService';
import { DeckSummary } from '../types/DeckTypes';
import { showToast } from '@/components/ThemedToast';

type Deck = { name: string; categories: string[] };

export default function NewGameScreen() {
  const listButtonBackgroundColor = useThemeColor({}, 'listButtonBackground');
  const deckService = DeckService.getInstance();

  const [decks, setDecks] = useState<DeckSummary[]>([]);
  const [selectedDeck, setSelectedDeck] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null);
  const [openDecks, setOpenDecks] = useState(false);
  const [openCategories, setOpenCategories] = useState(false);
  const [openDurations, setOpenDurations] = useState(false);
  const [categoryItems, setCategoryItems] = useState<
    { label: string; value: string }[]
  >([]);

  const durations = [
    'Sprint (90 seconds)',
    'Race (3 minutes)',
    'Marathon (6 minutes)',
  ];

  useEffect(() => {
    const fetchDecks = async () => {
      const loadedDecks = await deckService.getDecksSummary();
      setDecks(
        loadedDecks.sort((a, b) =>
          a.deckName.toLowerCase().localeCompare(b.deckName.toLowerCase())
        )
      );

      const storedDeck = await AsyncStorage.getItem('selectedDeck');
      const defaultDeck = storedDeck || loadedDecks[0]?.deckName || '';
      setSelectedDeck(defaultDeck || null);

      const storedCategory = await AsyncStorage.getItem('selectedCategory');
      if (storedCategory) {
        setSelectedCategory(storedCategory);
      }

      const storedDuration = await AsyncStorage.getItem('selectedDuration');
      if (storedDuration) {
        setSelectedDuration(storedDuration);
      }
    };

    fetchDecks();
  }, []);

  useEffect(() => {
    if (selectedDeck) {
      const selectedDeckObj = decks.find(
        (deck) => deck.deckName === selectedDeck
      );
      if (selectedDeckObj) {
        const sortedCategories = selectedDeckObj.categories.sort((a, b) =>
          a.toLowerCase().localeCompare(b.toLowerCase())
        );
        const categoryOptions =
          sortedCategories.length === 1
            ? [{ label: sortedCategories[0], value: sortedCategories[0] }]
            : [
                ...sortedCategories.map((category) => ({
                  label: category,
                  value: category,
                })),
                { label: 'Random', value: 'Random' },
              ];
        setCategoryItems(categoryOptions);
        setSelectedCategory(
          categoryOptions.length === 1 ? categoryOptions[0].value : 'Random'
        );
      }
    }
  }, [selectedDeck, decks]);

  const handleStart = async () => {
    try {
      if (!selectedDeck || !selectedCategory || !selectedDuration) {
        showToast('warning', 'Please make all selections');
        return;
      }

      const durationInSeconds =
        selectedDuration === 'Sprint (90 seconds)'
          ? 90
          : selectedDuration === 'Race (3 minutes)'
          ? 180
          : 360;

      await AsyncStorage.setItem('selectedDeck', selectedDeck);
      await AsyncStorage.setItem('selectedCategory', selectedCategory || '');
      await AsyncStorage.setItem('selectedDuration', selectedDuration);

      router.navigate({
        pathname: './startGame',
        params: {
          deckName: selectedDeck,
          category: selectedCategory,
          duration: durationInSeconds,
        },
      });
    } catch (error) {
      showToast('warning', 'Failed to start the game');
    }
  };

  const handleOpenChange = (
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    return (value: boolean | ((prev: boolean) => boolean)) => {
      setOpenDecks(false);
      setOpenCategories(false);
      setOpenDurations(false);

      // Set the target dropdown open state
      if (typeof value === 'function') {
        setOpen((prev) => value(prev));
      } else {
        setOpen(value);
      }
    };
  };

  return (
    <ThemedScreen title="New Game">
      <ThemedView style={styles.innerContainer}>
        <ThemedText style={styles.label}>Deck</ThemedText>
        {decks.length > 1 ? (
          <ThemedDropdownPicker
            open={openDecks}
            value={selectedDeck}
            items={decks.map((deck) => ({
              label: deck.deckName,
              value: deck.deckName,
            }))}
            setOpen={handleOpenChange(setOpenDecks)}
            setValue={setSelectedDeck}
            setItems={setDecks}
            style={styles.dropdown}
            textStyle={styles.dropdownText}
            dropDownContainerStyle={styles.dropdownContainer}
            zIndex={3000}
          />
        ) : (
          <ThemedText style={styles.label}>{selectedDeck}</ThemedText>
        )}

        <ThemedText style={styles.label}>Category</ThemedText>
        {selectedDeck && categoryItems.length > 0 ? (
          categoryItems.length > 1 ? (
            <ThemedDropdownPicker
              open={openCategories}
              value={selectedCategory}
              items={categoryItems}
              setOpen={handleOpenChange(setOpenCategories)}
              setValue={setSelectedCategory}
              setItems={setCategoryItems}
              style={styles.dropdown}
              textStyle={styles.dropdownText}
              dropDownContainerStyle={styles.dropdownContainer}
              zIndex={2000}
            />
          ) : (
            <ThemedText style={styles.centeredText}>
              {selectedCategory}
            </ThemedText>
          )
        ) : (
          <ThemedText style={[styles.label, styles.centeredText]}>
            {selectedCategory}
          </ThemedText>
        )}

        <ThemedText style={styles.label}>Duration</ThemedText>
        <ThemedDropdownPicker
          open={openDurations}
          value={selectedDuration}
          items={durations.map((duration) => ({
            label: duration,
            value: duration,
          }))}
          setOpen={handleOpenChange(setOpenDurations)}
          setValue={setSelectedDuration}
          setItems={() => {}}
          style={styles.dropdown}
          textStyle={styles.dropdownText}
          dropDownContainerStyle={styles.dropdownContainer}
          zIndex={1000}
        />
      </ThemedView>

      <ThemedView
        style={[styles.footer, { borderTopColor: listButtonBackgroundColor }]}
      >
        <ThemedPressable
          title="Start Game"
          fontSize={20}
          onPress={handleStart}
        />
      </ThemedView>
    </ThemedScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    padding: 16,
  },
  innerContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    marginVertical: 12,
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
  centeredText: {
    textAlign: 'center',
    fontSize: 20, // Same as label but not bold
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
