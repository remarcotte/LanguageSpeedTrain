// DeckFormatInfo.tsx

import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedScreen } from '@/components/ThemedScreen';
import { ThemedScrollView } from '@/components/ThemedScrollView';

export default function DeckFormatInfo() {
  return (
    <ThemedScreen title="How to Format Decks">
      <ThemedScrollView>
        <ThemedText type="normal">
          Here's a sample of the format for your deck data.
        </ThemedText>
        <ThemedText type="smaller" style={styles.example}>
          text,English,Français,Español
        </ThemedText>
        <ThemedText type="smaller" style={styles.example}>
          1,one,un,uno
        </ThemedText>
        <ThemedText type="smaller" style={styles.example}>
          2,two,deux,dos
        </ThemedText>
        <ThemedText type="smaller" style={styles.example}>
          3,three,trois,tres
        </ThemedText>
        <ThemedText type="normal">
          Follow the same format for your deck.
        </ThemedText>
        <ThemedText type="normal">
          Note: The only commas allowed in the data are those separating the
          different categories.
        </ThemedText>
      </ThemedScrollView>
    </ThemedScreen>
  );
}

const styles = StyleSheet.create({
  example: {
    marginLeft: 50,
    marginRight: 16,
    marginVertical: 0,
  },
});
