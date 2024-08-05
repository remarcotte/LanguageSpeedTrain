import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

type ThemedSwipeActionButtonProps = {
  title: string;
  color: string;
  onPress: () => void;
  style?: object;
};

export const ThemedSwipeActionButton: React.FC<
  ThemedSwipeActionButtonProps
> = ({ title, color, onPress, style }) => (
  <Pressable
    style={[styles.button, style, { backgroundColor: color }]}
    onPress={onPress}
  >
    <Text style={styles.text}>{title}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 8,
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    top: 0,
    width: 75,
  },
  text: {
    color: '#FFF',
  },
});
