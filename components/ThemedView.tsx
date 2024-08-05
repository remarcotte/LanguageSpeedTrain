// ThemedView.tsx

import { View, type ViewProps } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

// Define the props for ThemedView, extending ViewProps to include optional theme colors
export type ThemedViewProps = ViewProps & {
  lightColor?: string; // Optional light theme color for the view
  darkColor?: string; // Optional dark theme color for the view
};

// ThemedView component that uses theme-based background colors
export function ThemedView({
  style = {}, // Default style to an empty object to prevent undefined
  lightColor, // Light theme color passed as a prop
  darkColor, // Dark theme color passed as a prop
  ...otherProps // Spread other view properties
}: ThemedViewProps) {
  // Determine the background color using the theme colors provided
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor }, // Theme colors for light and dark modes
    "background", // Default theme key
  );

  // Render a View component with the calculated background color and additional styles/props
  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
