// ThemedSwipeableList.tsx

import React from "react";
import { StyleSheet } from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";

type ThemedSwipeableList<T> = {
  data: T[];
  keyExtractor: (item: T) => string;
  renderItem: ({ item }: { item: T }) => React.ReactElement;
  renderHiddenItem: ({ item }: { item: T }) => React.ReactElement;
  rightOpenValue: number;
};

export function ThemedSwipeableList<T>({
  data,
  keyExtractor,
  renderItem,
  renderHiddenItem,
  rightOpenValue,
}: ThemedSwipeableList<T>) {
  return (
    <SwipeListView
      data={data}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      renderHiddenItem={renderHiddenItem}
      rightOpenValue={rightOpenValue}
      contentContainerStyle={styles.listContent}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
});
