import React from 'react';
import { Alert, StyleSheet } from 'react-native';
import { DeckService } from '../services/DeckService';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedPressable } from '@/components/ThemedPressable';
import { ThemedScreen } from '@/components/ThemedScreen';
import { showToast } from '@/components/ThemedToast';
import { router } from 'expo-router';
import { ErrorService } from '../services/ErrorService';
import { ErrorActionType } from '../types/ErrorTypes';

const About = () => {
  const deckService = DeckService.getInstance();
  const errorService = ErrorService.getInstance();

  const resetAllData = async () => {
    try {
      await deckService.resetDecks();
      showToast('success', 'App data has been reset.');
    } catch (error) {
      await errorService.logError(
        ErrorActionType.TOAST,
        1,
        'Failed to reset app data.',
        error
      );
    }
  };

  const verifyReset = () => {
    Alert.alert(
      'Reset All Data?',
      'Resetting all data deletes decks and statistics. Default decks will be loaded. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Continue',
          onPress: async () => {
            await resetAllData();
          },
          style: 'destructive',
        },
      ],
      { cancelable: false }
    );
  };

  // const createError = async () => {
  // await errorService.logError(ErrorActionType.TOAST,
  //   1,
  //   'Test Error',
  //   'Error solely for purpose of testing error logging and displaying'
  // );
  // };

  return (
    <ThemedScreen title="About">
      <ThemedView style={styles.innerContainer}>
        <ThemedText style={styles.title}>Language Speed Train</ThemedText>
        <ThemedText style={styles.normal}>Version 1.0</ThemedText>
        <ThemedText style={styles.normal}>Developed by Elasting</ThemedText>
        <ThemedText style={styles.normal}>
          All data collected in playing the game resides in the application on
          the phone. Your data is not sent to Elasting or anyone else.
        </ThemedText>
        <ThemedText style={styles.copyright}>
          © 2024, Elasting. All rights reserved.
        </ThemedText>
        <ThemedPressable
          title="View Errors"
          onPress={() => router.navigate('/errors')}
          fontSize={20}
          style={styles.errorButton}
        />
        {/* <ThemedPressable
          title="Create Error"
          onPress={createError}
          fontSize={20}
          style={styles.errorButton}
        /> */}
      </ThemedView>
      <ThemedView style={styles.footer}>
        <ThemedPressable
          title="Reset App Data"
          onPress={verifyReset}
          fontSize={20}
        />
      </ThemedView>
    </ThemedScreen>
  );
};

const styles = StyleSheet.create({
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
  errorButton: {
    marginHorizontal: 80,
    marginTop: 100,
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

export default About;
