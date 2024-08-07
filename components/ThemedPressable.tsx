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
  type?: 'normal' | 'big' | 'wide';
  title: string; // Title text for the button
  lightColor?: string; // Optional light color theme
  darkColor?: string; // Optional dark color theme
  fontSize?: number; // Optional font size for the title
  isTransparent?: boolean; // Determines if the button should be transparent
  style?: ViewStyle | ((state: { pressed: boolean }) => ViewStyle); // Style or style function based on press state
};

// ThemedPressable component using React Native's Pressable and Text
export function ThemedPressable({
  type = 'normal',
  title,
  fontSize = 0, // Default to 0 to rely on type settings
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
        type === 'normal' ? styles.normalPressable : undefined,
        type === 'big' ? styles.bigPressable : undefined,
        type === 'wide' ? styles.widePressable : undefined,
        { backgroundColor: buttonBackgroundColor }, // Apply background color
        typeof style === 'function' ? style({ pressed }) : style, // Apply style function or static style
      ]}
      disabled={disabled} // Disable button if necessary
      {...props} // Spread additional props
    >
      <Text
        style={[
          type === 'normal' ? styles.normalText : undefined,
          type === 'big' ? styles.bigText : undefined,
          type === 'wide' ? styles.wideText : undefined,
          { color: buttonTextColor },
          fontSize > 0 ? { fontSize } : undefined, // Conditionally apply fontSize
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

// Define styles for the button and text
const styles = StyleSheet.create({
  normalPressable: {
    padding: 12,
    margin: 2,
    borderRadius: 5,
    alignItems: 'center',
  },
  bigPressable: {
    paddingVertical: 10, // Vertical padding for buttons
    paddingHorizontal: 25, // Horizontal padding for buttons
    marginVertical: 5, // Space between buttons
    borderRadius: 5, // Rounded corners for buttons
    margin: 2,
    alignItems: 'center',
  },
  widePressable: {
    width: '100%',
    padding: 8,
    marginHorizontal: 2,
    marginVertical: 8,
    borderRadius: 5,
    alignItems: 'center',
  },
  normalText: {
    fontSize: 20,
  },
  bigText: {
    fontSize: 32,
  },
  wideText: {
    fontSize: 20,
  },
});
