import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { DeckService } from '../services/DeckService';
import { ThemedText } from '@/components/ThemedText';
import { ThemedTextInput } from '@/components/ThemedTextInput';
import { ThemedPressable } from '@/components/ThemedPressable';
import { ThemedScreen } from '@/components/ThemedScreen';
import { ThemedScrollView } from '@/components/ThemedScrollView';
import { ErrorService } from '../services/ErrorService';
import { ErrorActionType } from '../types/ErrorTypes';

export default function AddNewDeck() {
  const deckService = DeckService.getInstance();
  const errorService = ErrorService.getInstance();

  const [name, deckName] = useState('');
  const [data, deckData] = useState('');

  const addNewDeck = async () => {
    try {
      await deckService.createDeck(name, data);
      router.navigate('/manageDecks');
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
            value={name}
            autoCorrect={false}
            autoCapitalize="none"
            onChangeText={deckName}
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
            Follow same format for your deck.
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
            value={data}
            autoCorrect={false}
            autoCapitalize="none"
            onChangeText={deckData}
            style={[styles.input, styles.multilineInput]}
            multiline
          />
          <ThemedPressable
            title="Add"
            onPress={addNewDeck}
            disabled={!name || !data}
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
    textAlignVertical: 'top',
  },
});
