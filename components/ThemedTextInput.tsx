import React, { forwardRef } from 'react';
import {
  TextInput as RNTextInput,
  TextInputProps,
  StyleSheet,
} from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

// Define props for ThemedTextInput, extending TextInputProps and adding optional theme colors
export type ThemedTextInputProps = TextInputProps & {
  lightColor?: string; // Optional light theme color
  darkColor?: string; // Optional dark theme color
};

// ThemedTextInput component using forwardRef to pass ref to the native TextInput component
export const ThemedTextInput = forwardRef<RNTextInput, ThemedTextInputProps>(
  (
    { style = {}, lightColor, darkColor, ...props }, // Default style to an empty object
    ref // Typed ref for RNTextInput
  ) => {
    // Get text color based on theme
    const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

    // Get background color based on theme
    const background = useThemeColor(
      { light: lightColor, dark: darkColor },
      'inputBackground'
    );

    return (
      <RNTextInput
        ref={ref} // Forward the ref to the native TextInput
        style={[
          styles.default, // Apply default styles
          { color: color, backgroundColor: background, borderColor: color }, // Apply theme-based styles
          style, // Apply additional styles from props
        ]}
        placeholderTextColor={color} // Set placeholder text color based on theme
        {...props} // Spread additional props to TextInput
      />
    );
  }
);

const styles = StyleSheet.create({
  default: {
    fontSize: 16, // Default font size
    lineHeight: 24, // Default line height
  },
});
