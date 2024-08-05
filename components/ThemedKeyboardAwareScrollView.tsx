// ThemedKeyboardAwareScrollView.tsx

import {
  KeyboardAwareScrollView,
  type KeyboardAwareScrollViewProps,
} from "react-native-keyboard-aware-scroll-view";

import { useThemeColor } from "@/hooks/useThemeColor";

// Define props for ThemedKeyboardAwareScrollView, extending KeyboardAwareScrollViewProps and adding optional color themes
export type ThemedKeyboardAwareScrollViewProps =
  KeyboardAwareScrollViewProps & {
    lightColor?: string; // Optional light theme background color
    darkColor?: string; // Optional dark theme background color
  };

// ThemedKeyboardAwareScrollView component to apply theme-based background color
export function ThemedKeyboardAwareScrollView({
  style = {}, // Default style to an empty object
  lightColor,
  darkColor,
  ...otherProps // Spread the remaining props to pass to KeyboardAwareScrollView
}: ThemedKeyboardAwareScrollViewProps) {
  // Use theme color hook to determine background color based on light or dark theme
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background",
  );

  return (
    // Apply the computed background color and any additional styles to KeyboardAwareScrollView
    <KeyboardAwareScrollView
      style={[{ backgroundColor }, style]}
      {...otherProps}
    />
  );
}
