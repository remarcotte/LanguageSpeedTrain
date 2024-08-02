import React from 'react';
import { Alert, StyleSheet } from 'react-native';
import DeckManager from '../services/DeckService';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedPressable } from '@/components/ThemedPressable';
import { ThemedScreen } from '@/components/ThemedScreen';
import Toast from 'react-native-toast-message';

const About = () => {
  const deckManager = DeckManager.getInstance();

  const resetAllData = async () => {
    try {
      await deckManager.resetDecks();
      Toast.show({
        type: 'success',
        text1: 'App data has been reset.',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to reset app data.',
      });
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
            try {
              await resetAllData();
            } catch (error) {
              console.error('Error in resetAllData:', error);
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: false }
    );
  };

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
  container: {
    justifyContent: 'space-between',
    alignItems: 'center',
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

export default About;
