// editDeckItem.tsx

import React, { useState, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router'; // Combined imports for better readability

import { showToast } from '@/components/ThemedToast';
import { ThemedTextInput } from '@/components/ThemedTextInput';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedScrollView } from '@/components/ThemedScrollView';
import { ThemedScreen } from '@/components/ThemedScreen';
import { ThemedPressable } from '@/components/ThemedPressable';

import { DeckService } from '@/services/DeckService';
import { ErrorService } from '@/services/ErrorService';
import { ErrorActionType } from '@/types/ErrorTypes';

export default function EditDeckItem() {
  // Get singleton instances of services
  const deckService = DeckService.getInstance();
  const errorService = ErrorService.getInstance();

  // Extract query parameters from the route
  const { deckName, categoriesStr, itemStr } = useLocalSearchParams<{
    deckName: string;
    categoriesStr: string;
    itemStr: string;
  }>();

  // Split categories string into an array
  const categories = categoriesStr.split(',');

  // Parse item string into an object if available
  const item = itemStr ? JSON.parse(itemStr) : undefined;

  // State for the main text field
  const [text, setText] = useState(item?.text || '');

  // State for category values
  const [categoryValues, setCategoryValues] = useState<string[]>(
    item ? item.categories : categories.map(() => '')
  );

  // Handle saving the item
  const handleSave = useCallback(async () => {
    try {
      // Validate that the text field is not empty
      if (!text) {
        showToast('danger', 'Text is required.');
        return;
      }

      // Validate that no category fields are empty
      if (categoryValues.includes('')) {
        showToast('danger', 'All category fields are required.');
        return;
      }

      // Combine text and category values into a new item
      const newItem = [text, ...categoryValues];

      // Update or add item based on the presence of an existing item
      if (item) {
        await deckService.updateDeckItem(deckName, item.text, newItem);
        showToast('success', 'Item updated.');
      } else {
        await deckService.addDeckItem(deckName, newItem);
        showToast('success', 'Item added.'); // Show toast for item addition
      }

      // Navigate back after saving
      router.back();
    } catch (error) {
      // Log error if saving fails
      await errorService.logError(
        ErrorActionType.TOAST,
        7,
        'Error saving deck item.',
        error
      );
    }
  }, [text, categoryValues, deckName, item, deckService, errorService]);

  // Handle changes to category fields
  const handleCategoryChange = useCallback(
    (index: number, value: string) => {
      const newCategoryValues = [...categoryValues];
      newCategoryValues[index] = value;
      setCategoryValues(newCategoryValues);
    },
    [categoryValues]
  );

  return (
    <ThemedScreen title="Edit Items">
      <ThemedScrollView contentContainerStyle={styles.container}>
        {/* Render main text field */}
        <ThemedText type="head2">Text</ThemedText>
        <ThemedTextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
        />

        {/* Render category fields */}
        {categories.map((category: string, index: number) => (
          <ThemedView key={index}>
            <ThemedText type="head2">{category}</ThemedText>
            <ThemedTextInput
              style={styles.input}
              value={categoryValues[index]}
              onChangeText={(value) => handleCategoryChange(index, value)}
            />
          </ThemedView>
        ))}

        {/* Render save button */}
        <ThemedPressable type="wide" title="Save" onPress={handleSave} />
      </ThemedScrollView>
    </ThemedScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginVertical: 16,
    paddingLeft: 8,
  },
});
