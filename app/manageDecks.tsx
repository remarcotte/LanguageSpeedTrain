import React, { useState, useCallback } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';

import { showToast } from '@/components/ThemedToast';
import { useThemeColor } from '@/hooks/useThemeColor';

import { ThemedPressable } from '@/components/ThemedPressable';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedScreen } from '@/components/ThemedScreen';
import { ThemedSwipeableList } from '@/components/ThemedSwipeableList';
import { ThemedSwipeActionButton } from '@/components/ThemedSwipeActionButton';
import { ThemedSwipeableListItem } from '@/components/ThemedSwipeableListItem';

import { DeckService } from '../services/DeckService';
import { DeckSummary } from '../types/DeckTypes';
import { ErrorService } from '../services/ErrorService';
import { ErrorActionType } from '../types/ErrorTypes';

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
          style={[
            styles.deckName,
            { backgroundColor: listButtonBackgroundColor },
          ]}
        >
          {item.deckName}
        </ThemedText>
        <ThemedText
          style={[
            styles.deckInfo,
            { backgroundColor: listButtonBackgroundColor },
          ]}
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
          title="Reset Decks"
          fontSize={20}
          onPress={() => resetDecks()}
        />
      </ThemedView>
    </ThemedScreen>
  );
}

const styles = StyleSheet.create({
  deckItem: {
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  deckName: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  deckInfo: {
    fontSize: 14,
    marginTop: 4,
    textAlign: 'left',
  },
  rowFront: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    height: 80,
    marginBottom: 10,
    borderRadius: 8,
    overflow: 'hidden',
    paddingHorizontal: 16,
  },
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
  backRightBtn: {
    alignItems: 'center',
    borderRadius: 8,
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
  backRightBtnLeft: {
    right: 78,
  },
  backRightBtnRight: {
    right: 0,
  },
  backTextWhite: {
    color: '#FFF',
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 20,
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
