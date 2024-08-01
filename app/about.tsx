import React from 'react';
import { Alert, StyleSheet } from 'react-native';
import DeckManager from '../services/DeckService';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedPressable } from '@/components/ThemedPressable';

export default function About() {
  const deckManager = DeckManager.getInstance();

  const resetAllData = async () => {
    await deckManager.resetDecks();
    Alert.alert('App data has been reset');
  }

  const verifyReset = async () => {
    Alert.alert(
      'Reset All Data?',
      'Resetting all data deletes decks and statistics. Default decks will be loaded. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Continue',
          onPress: () => resetAllData(),
          style: 'destructive',
        },
      ],
      { cancelable: false },
    );
  }

  return (
    <ThemedView style={styles.container}>
    <ThemedView style={styles.innerContainer}>
      <ThemedText style={styles.title}>Language Speed Train</ThemedText>
      <ThemedText style={styles.normal}>Version 1.0</ThemedText>
      <ThemedText style={styles.normal}>Developed by Elasting</ThemedText>
      <ThemedText style={styles.normal}>
        All data collected in playing the game resides in the application on the
        phone. Your data is not sent to Elasting or anyone else.
      </ThemedText>
        <ThemedText style={styles.copyright}>© 2024, Elasting. All rights reserved.</ThemedText>
    </ThemedView>
      <ThemedView style={styles.footer}>
      <ThemedPressable
        title="Reset App Data"
        onPress={verifyReset}
        fontSize={20}
      />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  innerContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  normal: {
    fontSize: 16,
    marginBottom: 10,
    marginLeft: 25,
    marginRight: 25,
  },
  copyright: {
    marginTop: 50,
    textAlign: 'center',
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
