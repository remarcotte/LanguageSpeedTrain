import React, { useEffect } from 'react';
import DropDownPicker, { DropDownPickerProps } from 'react-native-dropdown-picker';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedText } from '@/components/ThemedText';

type ThemedDropdownPickerProps = DropDownPickerProps<any> & {
  lightColor?: string;
  darkColor?: string;
  iconSize?: number;
  emptyListText?: string;
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

const ThemedDropdownPicker: React.FC<ThemedDropdownPickerProps> = ({
  style,
  textStyle,
  dropDownContainerStyle,
  lightColor,
  darkColor,
  iconSize = 18, // Default size for icons
  emptyListText = "No items available",
  items,
  setValue,
  value,
  ...props
}) => {
  // Use the provided colors if available, otherwise fallback to theme colors
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'inputBackground');
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  // Handle single item selection
  useEffect(() => {
    if (items.length === 1 && setValue) {
      setValue(() => items[0].value); // Ensure the value is set correctly
    }
  }, [items, setValue]);

  if (items.length === 0) {
    // Display empty list text
    return (
      <ThemedText style={[{ textAlign: 'center', fontSize: 16 }, textStyle]}>
        {emptyListText}
      </ThemedText>
    );
  }

  if (items.length === 1) {
    // Display single item text
    return (
      <ThemedText style={[{ textAlign: 'center', fontSize: 16 }, textStyle]}>
        {items[0].label}
      </ThemedText>
    );
  }

  return (
    <DropDownPicker
      items={items}
      value={value}
      setValue={setValue}
      multiple={false}
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

export default ThemedDropdownPicker;
