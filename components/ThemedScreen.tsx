import React from 'react';
import { View, type ViewProps, StyleSheet } from 'react-native';
import { Stack } from 'expo-router'; // Importing Stack for screen navigation options
import { useThemeColor } from '@/hooks/useThemeColor'; // Custom hook for theme colors

// Define props for ThemedScreen, extending ViewProps and adding custom properties
export type ThemedScreenProps = ViewProps & {
  lightColor?: string; // Optional light color theme
  darkColor?: string; // Optional dark color theme
  title: string; // Title for the screen header
  children: React.ReactNode; // Children components to be rendered within the screen
  headerRight?: React.ReactNode; // Optional custom header right component
};

// ThemedScreen component to provide consistent styling and header configuration
export function ThemedScreen({
  style = {},
  lightColor,
  darkColor,
  title,
  children,
  headerRight,
  ...otherProps
}: ThemedScreenProps) {
  // Determine background color based on theme
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    'background'
  );

  // Determine text color based on theme
  const textColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    'text'
  );

  return (
    <View style={[styles.screen, { backgroundColor }, style]} {...otherProps}>
      <Stack.Screen
        options={{
          title, // Set the header title
          headerStyle: { backgroundColor }, // Style the header with the background color
          headerTintColor: textColor, // Set the text color for header elements
          headerTitleStyle: {
            fontWeight: 'bold', // Make the header title bold
          },
          headerRight: () => headerRight, // Render the custom header right component if provided
        }}
      />
      {children} {/* Render children components */}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1, // Full-screen flex layout
    padding: 16, // Padding around the content
    justifyContent: 'flex-start', // Align content to the start of the screen
  },
});
