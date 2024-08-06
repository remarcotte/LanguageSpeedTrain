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
          Follow the same format for your deck. Note: The only commas allowed in
          the data are those separating the different categories.
        </ThemedText>
      </ThemedScrollView>
    </ThemedScreen>
  );
}

const styles = StyleSheet.create({
  normal: {
    fontSize: 18,
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
});
