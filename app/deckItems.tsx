import React, { useState, useCallback } from 'react';
import { Pressable, View, Text, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedScreen } from '@/components/ThemedScreen';
import { ThemedPressable } from '@/components/ThemedPressable';
import { router } from 'expo-router';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useFocusEffect } from '@react-navigation/native';
import DeckService from '../services/DeckService';
import { SwipeListView } from 'react-native-swipe-list-view';
import { useLocalSearchParams } from 'expo-router';

interface DeckItem {
  text: string;
  categories: string[];
}

export default function DeckItems() {
  const { deckName, categories } = useLocalSearchParams<{
    deckName: string;
    categories: string;
  }>();

  const deckService = DeckService.getInstance();
  const listButtonBackgroundColor = useThemeColor({}, 'listButtonBackground');

  const [items, setItems] = useState<DeckItem[]>([]);

  const loadItems = async () => {
    try {
      const deck = await deckService.getDeck(deckName);
      if (!deck) {
        Alert.alert('Error', 'Failed to load deck');
        return;
      }

      const deckItems = deck.items.map((item: string[]) => ({
        text: item[0],
        categories: item.slice(1),
      }));

      setItems(deckItems);
    } catch (error) {
      Alert.alert('Error', 'Failed to load items');
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadItems();
    }, []),
  );

  const deleteItem = async (text: string) => {
    if (items.length === 1) {
      Alert.alert(
        'Error',
        'A deck must have at least one item. Cannot delete last item.',
      );
    } else {
      try {
        await deckService.deleteDeckItem(deckName, text);
        await loadItems();
        Alert.alert(
          'Information',
          'Deleted deck items may appear in statistics. If this is undesirable, you may clear deck statistics on the Statistics screen.'
        );
      } catch (error) {
        Alert.alert('Error', 'Failed to delete item');
      }
    }
  };

  const confirmDelete = (text: string) => {
    if (items.length === 1) {
      Alert.alert(
        'Error',
        'A deck must have at least one item. Cannot delete last item.',
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
        { cancelable: false },
      );
    }
  };

  const getItemHeight = (categories: string[]): number => {
    switch (categories.length) {
      case 1:
        return 70;
      case 2:
        return 90;
      case 3:
        return 110;
      case 4:
      default:
        return 130;
    }
  };

  const renderItem = ({ item }: { item: DeckItem }) => (
    <TouchableOpacity
      onPress={() =>
          router.navigate( {
            pathname: './editDeckItem',
            params: {
              deckName,
              categoriesStr: categories,
              itemStr: JSON.stringify(item)
            }
          })
      }
      style={[styles.rowFront, { backgroundColor: listButtonBackgroundColor}]}
    >
      <View style={[styles.item, { height: getItemHeight(item.categories)}]}>
        <ThemedText style={[styles.text, { backgroundColor: listButtonBackgroundColor}]}>{item.text}</ThemedText>
        {item.categories.map((value, index) => (
          <ThemedText key={index} style={[styles.category, { backgroundColor: listButtonBackgroundColor}]}>
            {value}
          </ThemedText>
        ))}
      </View>
    </TouchableOpacity>
  );

  const renderHiddenItem = ({ item }: { item: DeckItem }) => (
    <ThemedView style={[styles.rowBack, { height: getItemHeight(item.categories) }]}>
      <Pressable
        style={[styles.backRightBtn, styles.backRightBtnLeft]}
      onPress={() =>
        router.navigate(
          { pathname: './editDeckItem',
            params: {
              deckName,
              categoriesStr: categories,
              itemStr: JSON.stringify(item)
            }
        })
        }
      >
        <Text style={styles.backTextWhite}>Edit</Text>
      </Pressable>
      <Pressable
        style={[styles.backRightBtn, styles.backRightBtnRight]}
        onPress={() => confirmDelete(item.text) }
      >
        <Text style={styles.backTextWhite}>Delete</Text>
      </Pressable>
    </ThemedView>
  );

  return (
    <ThemedScreen
      title='Deck Items'
      headerRight={
        <ThemedPressable
          title="Add Item"
          fontSize={16}
          isTransparent={true}
          onPress={() => router.navigate({
            pathname: './editDeckItem',
            params: {
              deckName,
              categoriesStr: categories
            }
          }) }
        /> } >
      <SwipeListView
        data={items}
        keyExtractor={(item) => item.text}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        rightOpenValue={-155}
        contentContainerStyle={styles.listContent}
      />
    </ThemedScreen>
  );
};

const styles = StyleSheet.create({
  listContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  item: {
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  category: {
    fontSize: 14,
    marginTop: 4,
    textAlign: 'left',
  },
  rowFront: {
    alignItems: 'flex-start',
    justifyContent: 'center',
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
    bottom: 0,
    borderRadius: 8,
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
});
