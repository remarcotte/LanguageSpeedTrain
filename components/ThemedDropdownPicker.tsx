import React from 'react';
import DropDownPicker, { DropDownPickerProps } from 'react-native-dropdown-picker';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';

// Define ThemedDropdownProps as an intersection type
type ValueType = string | number | boolean;

type ThemedDropdownProps<T extends ValueType> = DropDownPickerProps<T> & {
  lightColor?: string;
  darkColor?: string;
  iconSize?: number;
};

// Custom Icon Components
const ArrowUpIcon = ({ color, size }: { color: string; size: number }) => (
  <Ionicons name="chevron-up-outline" color={color} size={size} />
);

const ArrowDownIcon = ({ color, size }: { color: string; size: number }) => (
  <Ionicons name="chevron-down-outline" color={color} size={size} />
);

const TickIcon = ({ color, size }: { color: string; size: number }) => (
  <Ionicons name="checkmark-outline" color={color} size={size} />
);

export const ThemedDropdownPicker: React.FC<DropDownPickerProps<any>> = <T extends ValueType>({
  style,
  textStyle,
  dropDownContainerStyle,
  lightColor,
  darkColor,
  iconSize = 18, // Default size for icons
  ...props
}: ThemedDropdownProps<T>) => {
  // Use the provided colors if available, otherwise fallback to theme colors
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'inputBackground');
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <DropDownPicker<T>
      style={[{ backgroundColor, borderColor: color }, style]}
      textStyle={[{ color }, textStyle]}
      dropDownContainerStyle={[
        { backgroundColor, borderColor: color },
        dropDownContainerStyle,
      ]}
      ArrowUpIconComponent={({ style }) => <ArrowUpIcon color={color} size={iconSize} />}
      ArrowDownIconComponent={({ style }) => <ArrowDownIcon color={color} size={iconSize} />}
      TickIconComponent={({ style }) => <TickIcon color={color} size={iconSize} />}
      {...props}
    />
  );
};
