import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { router } from 'expo-router';

import { ThemedText } from '@/components/ThemedText'; // Custom themed text component
import { ThemedTextInput } from '@/components/ThemedTextInput'; // Custom themed text input component
import { ThemedPressable } from '@/components/ThemedPressable'; // Custom themed pressable component
import { ThemedScreen } from '@/components/ThemedScreen'; // Custom themed screen component
import { ThemedScrollView } from '@/components/ThemedScrollView'; // Custom themed scroll view component

import { DeckService } from '../services/DeckService'; // Service for handling deck-related operations
import { ErrorService } from '../services/ErrorService'; // Service for error logging
import { ErrorActionType } from '../types/ErrorTypes'; // Enum for error action types

export default function AddNewDeck() {
  // Get instances of the services
  const deckService = DeckService.getInstance();
  const errorService = ErrorService.getInstance();

  // State for deck name and data
  const [deckName, setDeckName] = useState(''); // Deck name state
  const [deckData, setDeckData] = useState(''); // Deck data state

  // Function to add a new deck
  const addNewDeck = async () => {
    try {
      // Create a new deck using the deck service
      await deckService.createDeck(deckName, deckData);
      // Navigate to the manage decks screen after successful creation
      router.navigate('/manageDecks');
    } catch (error) {
      // Log the error and show a toast notification
      await errorService.logError(
        ErrorActionType.TOAST,
        2,
        'Error adding new deck.',
        error
      );
    }
  };

  return (
    <ThemedScreen title="Add New Deck">
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100} // Adjust this value according to your header height
      >
        <ThemedScrollView>
          <ThemedText style={styles.normal}>
            First name your new deck. No two decks may share the same name.
          </ThemedText>
          <ThemedTextInput
            placeholder="Deck Name"
            value={deckName}
            autoCorrect={false}
            autoCapitalize="none"
            onChangeText={setDeckName}
            style={styles.input}
          />
          <ThemedText style={styles.normal}>
            Here's a sample of the format for your deck data.
          </ThemedText>
          <ThemedText style={styles.example}>
            text,English,Français,Español
          </ThemedText>
          <ThemedText style={styles.example}>1,one,un,uno</ThemedText>
          <ThemedText style={styles.example}>2,two,deux,dos</ThemedText>
          <ThemedText style={styles.example}>3,three,trois,tres</ThemedText>
          <ThemedText style={styles.normal}>
            Follow the same format for your deck.
          </ThemedText>
          <ThemedText style={styles.normal}>
            Note: The only commas allowed in the data are those separating the
            different categories
          </ThemedText>
          <ThemedText style={styles.normal}>
            Paste your deck data here, then click the Add button.
          </ThemedText>
          <ThemedTextInput
            placeholder="Data (CSV format)"
            value={deckData}
            autoCorrect={false}
            autoCapitalize="none"
            onChangeText={setDeckData}
            style={[styles.input, styles.multilineInput]}
            multiline
          />
          <ThemedPressable
            title="Add"
            onPress={addNewDeck}
            disabled={!deckName || !deckData} // Disable the button if name or data is empty
          />
        </ThemedScrollView>
      </KeyboardAvoidingView>
    </ThemedScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginLeft: 12,
    marginBottom: 16,
    padding: 8,
  },
  normal: {
    fontSize: 20,
    marginLeft: 12,
    marginRight: 16,
    marginBottom: 16,
    marginTop: 8,
  },
  example: {
    fontSize: 16,
    marginLeft: 50,
    marginRight: 16,
    marginBottom: 4,
    marginTop: 0,
  },
  multilineInput: {
    height: 120,
    marginLeft: 12,
    textAlignVertical: 'top', // Ensure text input starts at the top
  },
});
