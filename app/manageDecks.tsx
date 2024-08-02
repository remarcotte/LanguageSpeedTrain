import React, { useState, useCallback } from 'react';
import { Button, Pressable, View, Text, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedPressable } from '@/components/ThemedPressable';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedScreen } from '@/components/ThemedScreen';
import { router } from 'expo-router';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useFocusEffect } from '@react-navigation/native';
import DeckService from '../services/DeckService';
import { DeckSummary } from '../types/DeckTypes';
import { SwipeListView } from 'react-native-swipe-list-view';

export default function ManageDecksScreen() {
  const deckService = DeckService.getInstance();
  const listButtonBackgroundColor = useThemeColor({}, 'listButtonBackground');

  const [decks, setDecks] = useState<DeckSummary[]>([]);

  const loadDecks = async () => {
    const loadedDecks = await deckService.getDecksSummary();
    setDecks(loadedDecks);
  };

  useFocusEffect(
    useCallback(() => {
      loadDecks();
    }, []),
  );

  const deleteDeck = async (deckName: string) => {
    await deckService.deleteDeck(deckName);
    await loadDecks();
  };

  const confirmDelete = (deckName: string) => {
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
      { cancelable: false },
    );
  };

  const doResetDecks = async () => {
    await deckService.resetDecks();
    await loadDecks();
  };

  const resetDecks = () => {
    Alert.alert(
      'Reset Decks?',
      `Are you sure you reset to the default decks? This will delete all decks and statistics.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', onPress: () => doResetDecks(), style: 'destructive' },
      ],
      { cancelable: false },
    );
  };

  const renderItem = ({ item }: { item: DeckSummary }) => (
    <TouchableOpacity
      onPress={() =>
        router.navigate(
          { pathname: './deckItems',
            params: {
              deckName: item.deckName,
              categories: item.categories,  // still string, never parsed
            }
        })
      }
      style={[styles.rowFront, { backgroundColor: listButtonBackgroundColor }]}
    >
      <View style={styles.deckItem}>
        <ThemedText style={[styles.deckName, { backgroundColor: listButtonBackgroundColor }]}>{item.deckName}</ThemedText>
        <ThemedText style={[styles.deckInfo, { backgroundColor: listButtonBackgroundColor }]}>
          {item.itemCount} items, Categories: {item.categories.join(', ')}
        </ThemedText>
      </View>
    </TouchableOpacity>
  );

  const renderHiddenItem = ({ item }: { item: DeckSummary }) => (
    <ThemedView style={styles.rowBack}>
      <Pressable
        style={[styles.backRightBtn, styles.backRightBtnLeft]}
      onPress={() =>
        router.navigate(
          { pathname: './deckItems',
            params: {
              deckName: item.deckName,
              categories: item.categories,
            }
        })
        }
      >
        <Text style={styles.backTextWhite}>Edit</Text>
      </Pressable>
      <Pressable
        style={[styles.backRightBtn, styles.backRightBtnRight]}
        onPress={() => confirmDelete(item.deckName) }
      >
        <Text style={styles.backTextWhite}>Delete</Text>
      </Pressable>
    </ThemedView>
  );

  return (
    <ThemedScreen
      title='Manage Decks'
      headerRight={
        <ThemedPressable
          title="New Deck"
          fontSize={16}
          isTransparent={true}
          onPress={() => router.navigate('./addNewDeck') }
        /> } >
      <SwipeListView
        data={decks}
        keyExtractor={(item) => item.deckName}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        rightOpenValue={-155}
        contentContainerStyle={styles.listContent}
      />
      <ThemedView style={[styles.footer, { borderTopColor: listButtonBackgroundColor}]}>
        <ThemedPressable
          title="Reset Decks"
          fontSize={20}
          onPress={() => resetDecks()}
        />
      </ThemedView>
    </ThemedScreen>
  );
};

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
    backgroundColor: 'blue',
    right: 78,
  },
  backRightBtnRight: {
    backgroundColor: 'red',
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
