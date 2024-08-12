// manageDecks.tsx

import React, { useState, useCallback } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';

import { useThemeColor } from '@/hooks/useThemeColor';

import { showToast } from '@/components/ThemedToast';
import { ThemedPressable } from '@/components/ThemedPressable';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedScreen } from '@/components/ThemedScreen';
import { ThemedSwipeableList } from '@/components/ThemedSwipeableList';
import { ThemedSwipeActionButton } from '@/components/ThemedSwipeActionButton';
import { ThemedSwipeableListItem } from '@/components/ThemedSwipeableListItem';

import { DeckService } from '@/services/DeckService';
import { DeckSummary } from '@/types/DeckTypes';
import { ErrorService } from '@/services/ErrorService';
import { ErrorActionType } from '@/types/ErrorTypes';

export default function ManageDecks() {
  // Create instances of deck and error services
  const deckService = DeckService.getInstance();
  const errorService = ErrorService.getInstance();

  // Get the theme color for the list button background
  const listButtonBackgroundColor = useThemeColor({}, 'listButtonBackground');

  // State to store deck summaries
  const [decks, setDecks] = useState<DeckSummary[]>([]);

  // Load decks from the service
  const loadDecks = useCallback(async () => {
    try {
      const loadedDecks = await deckService.getDecksSummary();
      setDecks(loadedDecks); // Update state with loaded decks
    } catch (error) {
      await errorService.logError(
        ErrorActionType.TOAST,
        9,
        'Unable to retrieve list of decks.',
        error
      );
    }
  }, [deckService, errorService]);

  // Load decks whenever the screen is focused
  useFocusEffect(
    useCallback(() => {
      loadDecks();
    }, [loadDecks])
  );

  // Delete a deck and reload the deck list
  const deleteDeck = useCallback(
    async (deckName: string) => {
      try {
        await deckService.deleteDeck(deckName); // Delete deck from the service
        await loadDecks(); // Reload decks after deletion
        showToast('success', 'Deck deleted.'); // Show success message
      } catch (error) {
        await errorService.logError(
          ErrorActionType.TOAST,
          11,
          'Unable to delete decks.',
          error
        );
      }
    },
    [deckService, errorService, loadDecks]
  );

  // Show a confirmation alert before deleting a deck
  const confirmDelete = useCallback(
    (deckName: string) => {
      Alert.alert(
        'Delete Deck',
        `Are you sure you want to delete the deck "${deckName}"?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            onPress: () => deleteDeck(deckName),
            style: 'destructive',
          },
        ],
        { cancelable: false }
      );
    },
    [deleteDeck]
  );

  // Reset all decks to default and reload the deck list
  const doResetDecks = useCallback(async () => {
    try {
      await deckService.resetDecks(); // Reset decks to default
      await loadDecks(); // Reload decks after reset
      showToast('success', 'Reset complete.'); // Show success message
    } catch (error) {
      await errorService.logError(
        ErrorActionType.TOAST,
        14,
        'Unable to reset decks.',
        error
      );
    }
  }, [deckService, errorService, loadDecks]);

  // Show a confirmation alert before resetting decks
  const resetDecks = useCallback(() => {
    Alert.alert(
      'Reset Decks?',
      `Are you sure you reset to the default decks? This will delete all decks and statistics.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', onPress: () => doResetDecks(), style: 'destructive' },
      ],
      { cancelable: false }
    );
  }, [doResetDecks]);

  // Render each deck item in the list
  const renderDeckItem = useCallback(
    ({ item }: { item: DeckSummary }) => (
      <ThemedSwipeableListItem
        onPress={() =>
          router.navigate({
            pathname: './deckItems',
            params: {
              deckName: item.deckName,
              categories: item.categories,
            },
          })
        }
        height={70}
        listButtonBackgroundColor={listButtonBackgroundColor}
      >
        <ThemedText
          type="list-item-title"
          style={[{ backgroundColor: listButtonBackgroundColor }]}
        >
          {item.deckName}
        </ThemedText>
        <ThemedText
          type="list-item"
          style={[{ backgroundColor: listButtonBackgroundColor }]}
        >
          {item.itemCount} items, Categories: {item.categories.join(', ')}
        </ThemedText>
      </ThemedSwipeableListItem>
    ),
    [listButtonBackgroundColor]
  );

  // Render hidden actions (Edit, Delete) for each deck item
  const renderDeckHiddenItem = useCallback(
    ({ item }: { item: DeckSummary }) => (
      <ThemedView style={styles.rowBack}>
        <ThemedSwipeActionButton
          title="Edit"
          color="blue"
          onPress={() =>
            router.navigate({
              pathname: './deckItems',
              params: {
                deckName: item.deckName,
                categories: item.categories,
              },
            })
          }
          style={styles.backRightBtnLeft}
        />
        <ThemedSwipeActionButton
          title="Delete"
          color="red"
          onPress={() => confirmDelete(item.deckName)}
          style={styles.backRightBtnRight}
        />
      </ThemedView>
    ),
    [confirmDelete]
  );

  return (
    <ThemedScreen
      title="Manage Decks"
      headerRight={
        <ThemedPressable
          title="New Deck"
          fontSize={16}
          isTransparent={true}
          onPress={() => router.navigate('./addNewDeck')}
        />
      }
    >
      <ThemedSwipeableList
        data={decks}
        keyExtractor={(item) => item.deckName}
        renderItem={renderDeckItem}
        renderHiddenItem={renderDeckHiddenItem}
        rightOpenValue={-155}
      />
      <ThemedView
        style={[styles.footer, { borderTopColor: listButtonBackgroundColor }]}
      >
        <ThemedPressable
          type="wide"
          title="Reset Decks"
          onPress={() => resetDecks()}
        />
      </ThemedView>
    </ThemedScreen>
  );
}

const styles = StyleSheet.create({
  rowBack: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
    marginBottom: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  backRightBtnLeft: {
    right: 78,
  },
  backRightBtnRight: {
    right: 0,
  },
  footer: {
    alignSelf: 'stretch',
    padding: 16,
    borderTopWidth: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
