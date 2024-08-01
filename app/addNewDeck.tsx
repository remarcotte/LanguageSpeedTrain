import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function AddNewDeck() {
  return (
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Add New Deck</ThemedText>
      </ThemedView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});