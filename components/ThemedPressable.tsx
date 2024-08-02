import React from 'react';
import { Text, Pressable, PressableProps, StyleSheet, ViewStyle } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedPressableProps = PressableProps & {
  title: string;
  lightColor?: string;
  darkColor?: string;
  fontSize?: number;
  isTransparent?: boolean;
  style?: ViewStyle | ((state: { pressed: boolean }) => ViewStyle);
};

export function ThemedPressable({
  title,
  fontSize,
  disabled,
  lightColor,
  darkColor,
  isTransparent = false,
  style,
  ...props
}: ThemedPressableProps) {
  const buttonBackgroundColor =
    isTransparent
      ? useThemeColor({ light: lightColor, dark: darkColor }, 'background')
      : useThemeColor({ light: lightColor, dark: darkColor }, 'button');

  const buttonTextColor =
    isTransparent
      ? useThemeColor({ light: lightColor, dark: darkColor }, 'text')
      : useThemeColor({ light: lightColor, dark: darkColor }, 'buttonText');

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: buttonBackgroundColor },
        typeof style === 'function' ? style({ pressed }) : style,
      ]}
      disabled={disabled}
      {...props}
    >
      <Text
        style={[
          styles.buttonText,
          { color: buttonTextColor, fontSize },
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
    margin: 2,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
  },
});
