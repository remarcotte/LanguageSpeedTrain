import React from 'react';
import {
  Text,
  Pressable,
  PressableProps,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

// Define props for ThemedPressable, extending PressableProps and adding custom properties
export type ThemedPressableProps = PressableProps & {
  title: string; // Title text for the button
  lightColor?: string; // Optional light color theme
  darkColor?: string; // Optional dark color theme
  fontSize?: number; // Optional font size for the title
  isTransparent?: boolean; // Determines if the button should be transparent
  style?: ViewStyle | ((state: { pressed: boolean }) => ViewStyle); // Style or style function based on press state
};

// ThemedPressable component using React Native's Pressable and Text
export function ThemedPressable({
  title,
  fontSize = 16,
  disabled,
  lightColor,
  darkColor,
  isTransparent = false,
  style,
  ...props
}: ThemedPressableProps) {
  // Determine background color based on theme and transparency
  const buttonBackgroundColor = isTransparent
    ? useThemeColor({ light: lightColor, dark: darkColor }, 'background')
    : useThemeColor({ light: lightColor, dark: darkColor }, 'button');

  // Determine text color based on theme and transparency
  const buttonTextColor = isTransparent
    ? useThemeColor({ light: lightColor, dark: darkColor }, 'text')
    : useThemeColor({ light: lightColor, dark: darkColor }, 'buttonText');

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: buttonBackgroundColor }, // Apply background color
        typeof style === 'function' ? style({ pressed }) : style, // Apply style function or static style
      ]}
      disabled={disabled} // Disable button if necessary
      {...props} // Spread additional props
    >
      <Text style={[styles.buttonText, { color: buttonTextColor, fontSize }]}>
        {title}
      </Text>
    </Pressable>
  );
}

// Define styles for the button and text
const styles = StyleSheet.create({
  button: {
    padding: 8, // Padding inside the button
    margin: 2, // Margin around the button
    borderRadius: 5, // Rounded corners
    alignItems: 'center', // Center text horizontally
  },
  buttonText: {
    fontSize: 16, // Default font size for text
  },
});
