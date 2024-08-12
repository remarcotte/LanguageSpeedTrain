// newGame.tsx

import React, { useState, useEffect, useCallback } from "react"; // Import React hooks
import { StyleSheet } from "react-native"; // Import StyleSheet from React Native
import { router } from "expo-router"; // Router for navigation
import AsyncStorage from "@react-native-async-storage/async-storage"; // AsyncStorage for persistent storage

import { useThemeColor } from "@/hooks/useThemeColor"; // Hook for theme color

import { showToast } from "@/components/ThemedToast"; // Custom themed toast for notifications
import { ThemedText } from "@/components/ThemedText"; // Custom themed text component
import { ThemedView } from "@/components/ThemedView"; // Custom themed view component
import { ThemedPressable } from "@/components/ThemedPressable"; // Custom themed pressable component
import { ThemedScreen } from "@/components/ThemedScreen"; // Custom themed screen component
import { ThemedDropdownPicker } from "@/components/ThemedDropdownPicker"; // Custom themed dropdown picker

import { DeckService } from "@/services/DeckService"; // Service for deck operations
import { DeckSummary } from "@/types/DeckTypes"; // Type definition for deck summary
import { ErrorService } from "@/services/ErrorService"; // Service for error logging
import { ErrorActionType } from "@/types/ErrorTypes"; // Error action types

import { GAME_DURATIONS } from "@/constants/General";

type Deck = { name: string; categories: string[] }; // Type definition for a deck

export default function NewGame() {
  // Hook to get theme color for list button background
  const listButtonBackgroundColor = useThemeColor({}, "listButtonBackground");
  const deckService = DeckService.getInstance(); // Get instance of deck service
  const errorService = ErrorService.getInstance(); // Get instance of error service

  // State hooks for managing various UI states
  const [decks, setDecks] = useState<DeckSummary[]>([]); // List of decks
  const [selectedDeck, setSelectedDeck] = useState<string | null>(null); // Selected deck
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null); // Selected category
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null); // Selected duration
  const [openDecks, setOpenDecks] = useState(false); // Dropdown state for decks
  const [openCategories, setOpenCategories] = useState(false); // Dropdown state for categories
  const [openDurations, setOpenDurations] = useState(false); // Dropdown state for durations
  const [categoryItems, setCategoryItems] = useState<
    { label: string; value: string }[]
  >([]); // Category items for dropdown

  const durations = GAME_DURATIONS;

  // Fetch decks and saved selections from AsyncStorage
  const fetchDecks = useCallback(async () => {
    try {
      const loadedDecks = await deckService.getDecksSummary(); // Fetch deck summaries
      // Sort decks alphabetically by name
      setDecks(
        loadedDecks.sort((a, b) =>
          a.deckName.toLowerCase().localeCompare(b.deckName.toLowerCase()),
        ),
      );

      // Retrieve stored deck from AsyncStorage, if any
      const storedDeck = await AsyncStorage.getItem("selectedDeck");
      const defaultDeck = storedDeck || loadedDecks[0]?.deckName || "";
      setSelectedDeck(defaultDeck || null); // Set default deck selection

      // Retrieve stored category from AsyncStorage, if any
      const storedCategory = await AsyncStorage.getItem("selectedCategory");
      if (storedCategory) {
        setSelectedCategory(storedCategory);
      }

      // Retrieve stored duration from AsyncStorage, if any
      const storedDuration = await AsyncStorage.getItem("selectedDuration");
      if (storedDuration) {
        setSelectedDuration(parseInt(storedDuration, 10));
      }
    } catch (error) {
      await errorService.logError(
        ErrorActionType.TOAST,
        23,
        "Unable to load decks and settings.",
        error,
      );
    }
  }, [deckService, errorService]);

  useEffect(() => {
    fetchDecks();
  }, [fetchDecks]); // Fetch decks on mount

  // Update category options when selected deck changes
  useEffect(() => {
    if (selectedDeck) {
      // Find the selected deck object from the list
      const selectedDeckObj = decks.find(
        (deck) => deck.deckName === selectedDeck,
      );
      if (selectedDeckObj) {
        // Sort categories alphabetically
        const sortedCategories = selectedDeckObj.categories.sort((a, b) =>
          a.toLowerCase().localeCompare(b.toLowerCase()),
        );
        // Create category options for dropdown
        const categoryOptions =
          sortedCategories.length === 1
            ? [{ label: sortedCategories[0], value: sortedCategories[0] }]
            : [
                ...sortedCategories.map((category) => ({
                  label: category,
                  value: category,
                })),
                { label: "Random", value: "Random" }, // Add "Random" option
              ];
        setCategoryItems(categoryOptions); // Update category items state
        setSelectedCategory(
          categoryOptions.length === 1 ? categoryOptions[0].value : "Random",
        ); // Set default category selection
      }
    }
  }, [selectedDeck, decks]); // Run when selectedDeck or decks changes

  // Handle the start of a new game
  const handleStart = async () => {
    try {
      // Ensure all selections are made
      if (!selectedDeck || !selectedCategory || !selectedDuration) {
        showToast("warning", "Please make all selections"); // Show warning if not all selections are made
        return;
      }

      // Save selections to AsyncStorage
      await AsyncStorage.setItem("selectedDeck", selectedDeck);
      await AsyncStorage.setItem("selectedCategory", selectedCategory || "");
      await AsyncStorage.setItem(
        "selectedDuration",
        selectedDuration.toString(),
      );

      // Navigate to the game start screen with selected parameters
      router.navigate({
        pathname: "./startGame",
        params: {
          deckName: selectedDeck,
          category: selectedCategory,
          duration: selectedDuration,
        },
      });
    } catch (error) {
      await errorService.logError(
        ErrorActionType.TOAST,
        24,
        "Failed to start the game.",
        error,
      );
    }
  };

  // Handle dropdown open state changes
  const handleOpenChange = useCallback(
    (setOpen: React.Dispatch<React.SetStateAction<boolean>>) => {
      return (value: boolean | ((prev: boolean) => boolean)) => {
        // Close all dropdowns before opening the selected one
        setOpenDecks(false);
        setOpenCategories(false);
        setOpenDurations(false);

        // Set the target dropdown open state
        if (typeof value === "function") {
          setOpen((prev) => value(prev));
        } else {
          setOpen(value);
        }
      };
    },
    [],
  );

  return (
    <ThemedScreen title="New Game">
      <ThemedView style={styles.innerContainer}>
        <ThemedText type="head2">Deck</ThemedText>
        {decks.length > 1 ? ( // Show dropdown if more than one deck
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
            placeholder="Select a deck..."
            style={styles.dropdown}
            textStyle={styles.dropdownText}
            dropDownContainerStyle={styles.dropdownContainer}
            zIndex={3000}
          />
        ) : (
          <ThemedText type="head2">{selectedDeck}</ThemedText> // Show text if only one deck
        )}

        <ThemedText type="head2">Category</ThemedText>
        {selectedDeck && categoryItems.length > 0 ? (
          categoryItems.length > 1 ? ( // Show dropdown if more than one category
            <ThemedDropdownPicker
              open={openCategories}
              value={selectedCategory}
              items={categoryItems}
              setOpen={handleOpenChange(setOpenCategories)}
              setValue={setSelectedCategory}
              setItems={setCategoryItems}
              placeholder="Select a category..."
              style={styles.dropdown}
              textStyle={styles.dropdownText}
              dropDownContainerStyle={styles.dropdownContainer}
              zIndex={2000}
            />
          ) : (
            <ThemedText type="head2">{selectedCategory}</ThemedText> // Show text if only one category
          )
        ) : (
          <ThemedText type="head2">{selectedCategory}</ThemedText> // Show selected category if no items
        )}

        <ThemedText type="head2">Duration</ThemedText>
        <ThemedDropdownPicker
          open={openDurations}
          value={selectedDuration}
          items={durations.map((duration) => ({
            label: duration.text,
            value: duration.value,
          }))}
          setOpen={handleOpenChange(setOpenDurations)}
          setValue={setSelectedDuration}
          setItems={() => {}}
          placeholder="Select a duration..."
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
          type="wide"
          title="Start Game"
          onPress={handleStart} // Button to start the game
        />
      </ThemedView>
    </ThemedScreen>
  );
}

const styles = StyleSheet.create({
  innerContainer: {
    marginBottom: 16,
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
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});
