// ThemedFlatList.tsx

import React from "react";
import { FlatList, type FlatListProps } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

// Define props for ThemedFlatList, extending FlatListProps and adding optional color themes
export type ThemedFlatListProps<ItemT> = FlatListProps<ItemT> & {
  lightColor?: string; // Optional light theme background color
  darkColor?: string; // Optional dark theme background color
};

// ThemedFlatList component to apply theme-based background color to FlatList
export function ThemedFlatList<ItemT>({
  style = {}, // Default style to an empty object
  lightColor,
  darkColor,
  ...otherProps // Spread the remaining props to pass to FlatList
}: ThemedFlatListProps<ItemT>) {
  // Use theme color hook to determine background color based on light or dark theme
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background",
  );

  return (
    // Apply the computed background color and any additional styles to FlatList
    <FlatList style={[{ backgroundColor }, style]} {...otherProps} />
  );
}
