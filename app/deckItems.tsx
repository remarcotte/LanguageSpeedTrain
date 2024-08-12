// deckItems.tsx

import React, { useState, useCallback } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

import { useThemeColor } from '@/hooks/useThemeColor';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedScreen } from '@/components/ThemedScreen';
import { ThemedPressable } from '@/components/ThemedPressable';
import { ThemedSwipeableList } from '@/components/ThemedSwipeableList';
import { ThemedSwipeableListItem } from '@/components/ThemedSwipeableListItem';
import { ThemedSwipeActionButton } from '@/components/ThemedSwipeActionButton';

import { DeckService } from '@/services/DeckService';
import { ErrorService } from '@/services/ErrorService';
import { ErrorActionType } from '@/types/ErrorTypes';

import { LIST_ITEM_HEIGHTS } from '@/constants/General';

// Interface for deck items
interface DeckItem {
  text: string;
  categories: string[];
}

export default function DeckItems() {
  // Extract parameters from the navigation route with default values
  const { deckName = '', categories = '' } = useLocalSearchParams<{
    deckName: string;
    categories: string;
  }>();

  // Singleton instances of services
  const deckService = DeckService.getInstance();
  const errorService = ErrorService.getInstance();

  // Retrieve the theme color for the list button background
  const listButtonBackgroundColor = useThemeColor({}, 'listButtonBackground');

  // State for storing deck items
  const [items, setItems] = useState<DeckItem[]>([]);

  // Function to load items from the specified deck
  const loadItems = useCallback(async () => {
    try {
      // Retrieve the deck by name
      const deck = await deckService.getDeck(deckName);
      if (!deck) {
        await errorService.logError(
          ErrorActionType.TOAST,
          4,
          'Failed to load deck.'
        );
        return;
      }

      // Map the deck items to the required format
      const deckItems = deck.items.map((item: string[]) => ({
        text: item[0], // Item text
        categories: item.slice(1), // Categories associated with the item
      }));

      setItems(deckItems); // Set the items state
    } catch (error) {
      await errorService.logError(
        ErrorActionType.TOAST,
        5,
        'Failed to load items.'
      );
    }
  }, [deckName, deckService, errorService]);

  // Load items when the screen is focused
  useFocusEffect(
    useCallback(() => {
      loadItems();
    }, [loadItems])
  );

  // Function to delete an item from the deck
  const deleteItem = useCallback(
    async (text: string) => {
      if (items.length === 1) {
        Alert.alert(
          'Error',
          'A deck must have at least one item. Cannot delete last item.'
        );
      } else {
        try {
          await deckService.deleteDeckItem(deckName, text);
          await loadItems(); // Refresh the item list
          Alert.alert(
            'Information',
            'Deleted deck items may appear in statistics. If this is undesirable, you may clear deck statistics on the Statistics screen.'
          );
        } catch (error) {
          await errorService.logError(
            ErrorActionType.TOAST,
            6,
            'Failed to delete deck item.',
            error
          );
        }
      }
    },
    [deckName, items.length, deckService, errorService, loadItems]
  );

  // Function to confirm deletion of an item
  const confirmDelete = useCallback(
    (text: string) => {
      if (items.length === 1) {
        Alert.alert(
          'Error',
          'A deck must have at least one item. Cannot delete last item.'
        );
      } else {
        Alert.alert(
          'Delete Item?',
          `Are you sure you want to delete the item "${text}"?`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Delete',
              onPress: () => deleteItem(text),
              style: 'destructive',
            },
          ],
          { cancelable: false }
        );
      }
    },
    [deleteItem, items.length]
  );

  // Determine the height of an item based on the number of categories
  const getItemHeight = useCallback((categories: string[]): number => {
    switch (categories.length) {
      case 1:
        return LIST_ITEM_HEIGHTS[0];
      case 2:
        return LIST_ITEM_HEIGHTS[1];
      case 3:
        return LIST_ITEM_HEIGHTS[2];
      case 4:
      default:
        return LIST_ITEM_HEIGHTS[3];
    }
  }, []);

  // Render a single item in the list
  const renderItem = useCallback(
    ({ item: { text, categories } }: { item: DeckItem }) => (
      <ThemedSwipeableListItem
        onPress={() =>
          router.navigate({
            pathname: './editDeckItem',
            params: {
              deckName,
              categoriesStr: categories,
              itemStr: JSON.stringify({ text, categories }),
            },
          })
        }
        height={getItemHeight(categories)}
        listButtonBackgroundColor={listButtonBackgroundColor}
      >
        <ThemedText
          type="list-item-title"
          style={[{ backgroundColor: listButtonBackgroundColor }]}
        >
          {text}
        </ThemedText>
        {categories.map((value, index) => (
          <ThemedText
            type="list-item"
            key={index}
            style={[{ backgroundColor: listButtonBackgroundColor }]}
          >
            {value}
          </ThemedText>
        ))}
      </ThemedSwipeableListItem>
    ),
    [deckName, getItemHeight, listButtonBackgroundColor]
  );

  // Render hidden item actions for swiping
  const renderHiddenItem = useCallback(
    ({ item: { text, categories } }: { item: DeckItem }) => (
      <ThemedView
        style={[styles.rowBack, { height: getItemHeight(categories) }]}
      >
        <ThemedSwipeActionButton
          title="Edit"
          color="blue"
          onPress={() =>
            router.navigate({
              pathname: './editDeckItem',
              params: {
                deckName,
                categoriesStr: categories,
                itemStr: JSON.stringify({ text, categories }),
              },
            })
          }
          style={styles.backRightBtnLeft}
        />
        <ThemedSwipeActionButton
          title="Delete"
          color="red"
          onPress={() => confirmDelete(text)}
          style={styles.backRightBtnRight}
        />
      </ThemedView>
    ),
    [deckName, getItemHeight, confirmDelete]
  );

  return (
    <ThemedScreen
      title="Deck Items"
      headerRight={
        <ThemedPressable
          title="Add Item"
          isTransparent={true}
          fontSize={16}
          onPress={() =>
            router.navigate({
              pathname: './editDeckItem',
              params: {
                deckName,
                categoriesStr: categories,
              },
            })
          }
        />
      }
    >
      <ThemedSwipeableList
        data={items}
        keyExtractor={(item) => item.text}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        rightOpenValue={-155}
      />
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
});
