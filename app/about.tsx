import React, { useState } from 'react';
import { Alert, StyleSheet, ActivityIndicator } from 'react-native'; // Importing necessary components and modules
import { router } from 'expo-router';
import { showToast } from '@/components/ThemedToast'; // Custom toast component

import { ThemedText } from '@/components/ThemedText'; // Themed text component for consistent styling
import { ThemedView } from '@/components/ThemedView'; // Themed view component for layout
import { ThemedPressable } from '@/components/ThemedPressable'; // Themed pressable component for buttons
import { ThemedScreen } from '@/components/ThemedScreen'; // Themed screen component

import { DeckService } from '../services/DeckService'; // Service for managing decks
import { ErrorService } from '../services/ErrorService'; // Service for logging errors
import { ErrorActionType } from '../types/ErrorTypes'; // Enum for error action types

const About = () => {
  const deckService = DeckService.getInstance(); // Singleton instance of DeckService
  const errorService = ErrorService.getInstance(); // Singleton instance of ErrorService

  // State to track loading status
  const [loading, setLoading] = useState(false);

  // Function to reset all app data
  const resetAllData = async () => {
    setLoading(true); // Start loading
    try {
      await deckService.resetDecks(); // Reset decks and data
      showToast('success', 'App data has been reset.'); // Show success toast
    } catch (error) {
      // Log the error and show a toast notification
      await errorService.logError(
        ErrorActionType.TOAST,
        1,
        'Failed to reset app data.',
        error
      );
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Function to confirm the reset action
  const verifyReset = () => {
    Alert.alert(
      'Reset All Data?', // Title
      'Resetting all data deletes decks and statistics. Default decks will be loaded. Continue?', // Message
      [
        { text: 'Cancel', style: 'cancel' }, // Cancel button
        {
          text: 'Continue',
          onPress: () => {
            resetAllData(); // Call resetAllData if the user confirms
          },
          style: 'destructive', // Destructive style indicates the action is irreversible
        },
      ],
      { cancelable: false } // Prevent dismissing the alert by tapping outside
    );
  };

  return (
    <ThemedScreen title="About">
      {/* Screen with a title */}
      <ThemedView style={styles.innerContainer}>
        {/* Container for text and buttons */}
        <ThemedText style={styles.title}>Language Speed Train</ThemedText>
        {/* App title */}
        <ThemedText style={styles.normal}>Version 1.0</ThemedText>
        {/* Version information */}
        <ThemedText style={styles.normal}>Developed by Elasting</ThemedText>
        {/* Developer information */}
        <ThemedText style={styles.normal}>
          All data collected in playing the game resides in the application on
          the phone. Your data is not sent to Elasting or anyone else.
          {/* Privacy information */}
        </ThemedText>
        <ThemedText style={styles.copyright}>
          © 2024, Elasting. All rights reserved. {/* Copyright information */}
        </ThemedText>
        <ThemedPressable
          title="View Errors"
          onPress={() => router.navigate('/errors')} // Navigate to errors screen
          fontSize={20}
          style={styles.errorButton}
        />
      </ThemedView>
      {loading ? (
        // Show ActivityIndicator when loading
        <ActivityIndicator size="large" color="#007BFF" style={styles.loader} />
      ) : (
        <ThemedView style={styles.footer}>
          <ThemedPressable
            title="Reset App Data"
            onPress={verifyReset}
            fontSize={20}
          />
        </ThemedView>
      )}
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
  loader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -20,
    marginLeft: -20,
  },
});

export default About;
