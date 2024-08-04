import React, { useState } from 'react';
import { ThemedTextInput } from '@/components/ThemedTextInput';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedScrollView } from '@/components/ThemedScrollView';
import { ThemedScreen } from '@/components/ThemedScreen';
import { StyleSheet } from 'react-native';
import { ThemedPressable } from '@/components/ThemedPressable';
import { router } from 'expo-router';
import { DeckService } from '../services/DeckService';
import { useLocalSearchParams } from 'expo-router';
import { showToast } from '@/components/ThemedToast';
import { ErrorService } from '../services/ErrorService';
import { ErrorActionType } from '../types/ErrorTypes';

export default function EditDeckItem() {
  const deckService = DeckService.getInstance();
  const errorService = ErrorService.getInstance();

  const { deckName, categoriesStr, itemStr } = useLocalSearchParams<{
    deckName: string;
    categoriesStr: string;
    itemStr: string;
  }>();

  const categories = categoriesStr.split(',');
  const item = itemStr ? JSON.parse(itemStr) : undefined;

  const [text, setText] = useState(item?.text || '');
  const [categoryValues, setCategoryValues] = useState<string[]>(
    item ? item.categories : categories.map(() => '')
  );

  const handleSave = async () => {
    try {
      if (!text) {
        showToast('danger', 'Text is required.');
        return;
      }
      if (categoryValues.includes('')) {
        showToast('danger', 'All category fields are required.');
        return;
      }

      const newItem = [text, ...categoryValues];

      if (item) {
        await deckService.updateDeckItem(deckName, item.text, newItem);
        showToast('success', 'Item updated.');
      } else {
        await deckService.addDeckItem(deckName, newItem);
      }
      router.back();
    } catch (error) {
      await errorService.logError(
        ErrorActionType.TOAST,
        7,
        'Error saving deck item.',
        error
      );
    }
  };

  const handleCategoryChange = (index: number, value: string) => {
    const newCategoryValues = [...categoryValues];
    newCategoryValues[index] = value;
    setCategoryValues(newCategoryValues);
  };

  return (
    <ThemedScreen title="Edit Items">
      <ThemedScrollView contentContainerStyle={styles.container}>
        <ThemedText style={styles.label}>Text</ThemedText>
        <ThemedTextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
        />
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
        <ThemedPressable title="Save" onPress={() => handleSave()} />
      </ThemedScrollView>
    </ThemedScreen>
  );
}

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
