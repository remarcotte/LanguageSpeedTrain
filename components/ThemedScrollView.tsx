import { ScrollView, type ScrollViewProps } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

// Define props for ThemedScrollView, extending ScrollViewProps and adding optional color themes
export type ThemedScrollViewProps = ScrollViewProps & {
  lightColor?: string; // Optional light theme background color
  darkColor?: string; // Optional dark theme background color
};

// ThemedScrollView component to apply theme-based background color to ScrollView
export function ThemedScrollView({
  style = {}, // Default style to an empty object
  lightColor,
  darkColor,
  ...otherProps // Spread the remaining props to pass to ScrollView
}: ThemedScrollViewProps) {
  // Use theme color hook to determine background color based on light or dark theme
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    'background'
  );

  return (
    // Apply the computed background color and any additional styles to ScrollView
    <ScrollView style={[{ backgroundColor }, style]} {...otherProps} />
  );
}
