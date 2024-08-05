// ThemedSwipeableListItem.tsx

import React from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';

export interface ThemedSwipeableListItemProps {
  children: React.ReactNode;
  onPress: () => void;
  height: number;
  listButtonBackgroundColor: string;
}

export const ThemedSwipeableListItem: React.FC<
  ThemedSwipeableListItemProps
> = ({ children, onPress, height, listButtonBackgroundColor }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.item,
        { height, backgroundColor: listButtonBackgroundColor },
      ]}
    >
      <View style={styles.content}>{children}</View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
    marginBottom: 10,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
});
