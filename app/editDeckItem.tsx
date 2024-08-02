import React, { useState, useEffect } from 'react';
import { ThemedTextInput } from '@/components/ThemedTextInput';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedScrollView } from '@/components/ThemedScrollView';
import { ThemedScreen } from '@/components/ThemedScreen';
import { Alert, StyleSheet, ScrollView } from 'react-native';
import { ThemedPressable } from '@/components/ThemedPressable';
import { router } from 'expo-router';
import DeckService from '../services/DeckService';
import { useLocalSearchParams } from 'expo-router';

export default function EditDeckItem() {
  const deckService = DeckService.getInstance();

  const { deckName, categoriesStr, itemStr } = useLocalSearchParams<{
    deckName: string;
    categoriesStr: string;
    itemStr: string
  }>();

  const categories = categoriesStr.split(',');
  const item = itemStr ? JSON.parse(itemStr) : undefined;

  const [text, setText] = useState(item?.text || '');
  const [categoryValues, setCategoryValues] = useState<string[]>(
    item ? item.categories : categories.map(() => ''),
  );

  const handleSave = async () => {
    try {
      if (!text) {
        Alert.alert('Error', 'Text is required.');
        return;
      }
      if (categoryValues.includes('')) {
        Alert.alert('Error', 'All category fields are required.');
        return;
      }

      const newItem = [text, ...categoryValues];

      if (item) {
        await deckService.updateDeckItem(deckName, item.text, newItem);
        Alert.alert(
          'Information',
          'Prior versions of deck items may appear in statistics. If this is undesirable, you may clear deck statistics on the Statistics screen.',
        );
      } else {
        await deckService.addDeckItem(deckName, newItem);
      }
      router.back();
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'An unexpected error occurred',
      );
    }
  };

  const handleCategoryChange = (index: number, value: string) => {
    const newCategoryValues = [...categoryValues];
    newCategoryValues[index] = value;
    setCategoryValues(newCategoryValues);
  };

  return (
    <ThemedScreen title='Edit Items'>
    <ThemedScrollView contentContainerStyle={styles.container}>
      <ThemedText style={styles.label}>Text</ThemedText>
      <ThemedTextInput style={styles.input} value={text} onChangeText={setText} />
      {categories.map((category: string, index: number) => (
        <ThemedView key={index}>
          <ThemedText style={styles.label}>{category}</ThemedText>
          <ThemedTextInput
            style={styles.input}
            value={categoryValues[index]}
            onChangeText={(value) => handleCategoryChange(index, value)}
          />
        </ThemedView>
      ))}
      <ThemedPressable
        title="Save"
        onPress={() => handleSave() }
      />
    </ThemedScrollView>
    </ThemedScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingLeft: 8,
  },
});
