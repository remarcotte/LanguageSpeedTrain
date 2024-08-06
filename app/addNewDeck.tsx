// addNewDeck.tsx

import React, { useState, useRef } from 'react';
import { Platform, StyleSheet, TextInput as RNTextInput } from 'react-native';
import { router } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedTextInput } from '@/components/ThemedTextInput';
import { ThemedPressable } from '@/components/ThemedPressable';
import { ThemedScreen } from '@/components/ThemedScreen';
import { ThemedView } from '@/components/ThemedView'; // Use a simple scroll view now

import { DeckService } from '@/services/DeckService';
import { ErrorService } from '@/services/ErrorService';
import { ErrorActionType } from '@/types/ErrorTypes';

export default function AddNewDeck() {
  const deckService = DeckService.getInstance();
  const errorService = ErrorService.getInstance();

  const [deckName, setDeckName] = useState('');
  const [deckData, setDeckData] = useState('');

  const deckNameInputRef = useRef<RNTextInput>(null);
  const deckDataInputRef = useRef<RNTextInput>(null);

  const addNewDeck = async () => {
    let msg = '';
    try {
      msg = await deckService.createDeck(deckName, deckData);
      if (msg === '') router.navigate('/manageDecks');
      if (msg) {
        await errorService.logError(
          ErrorActionType.TOASTONLY,
          57,
          'Error adding new deck.'
        );
      }
    } catch (error) {
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
      <ThemedView>
        <ThemedPressable
          title="How to Format Decks"
          onPress={() => router.navigate('/deckFormatInfo')}
        />
        <ThemedText style={styles.normal}>
          Your new deck needs a name. No two decks may share the same name.
        </ThemedText>
        <ThemedTextInput
          ref={deckNameInputRef}
          placeholder="Deck Name"
          value={deckName}
          autoCorrect={false}
          autoCapitalize="none"
          onChangeText={setDeckName}
          returnKeyType="next"
          onSubmitEditing={() => deckDataInputRef.current?.focus()}
          blurOnSubmit={false}
          style={styles.input}
        />
        <ThemedText style={styles.normal}>
          Paste your deck data here, then click the Add button.
        </ThemedText>
        <ThemedTextInput
          ref={deckDataInputRef}
          placeholder="Data (CSV format)"
          value={deckData}
          autoCorrect={false}
          autoCapitalize="none"
          onChangeText={setDeckData}
          style={[styles.input, styles.multilineInput]}
          multiline
          returnKeyType="default"
          blurOnSubmit={false}
        />
        <ThemedPressable
          title="Add"
          onPress={addNewDeck}
          disabled={!deckName.trim() || !deckData.trim()}
        />
      </ThemedView>
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
    marginHorizontal: 12,
    marginBottom: 8,
    padding: 8,
  },
  normal: {
    fontSize: 16,
    marginHorizontal: 12,
    marginRight: 16,
    marginBottom: 8,
    marginTop: 8,
  },
  multilineInput: {
    height: 120,
    marginLeft: 12,
    textAlignVertical: 'top',
  },
  button: {
    marginBottom: 8,
    marginHorizontal: 12,
  },
});
