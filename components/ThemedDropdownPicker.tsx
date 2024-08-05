import React, { useEffect, useMemo } from 'react';
import DropDownPicker, {
  DropDownPickerProps,
} from 'react-native-dropdown-picker';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedText } from '@/components/ThemedText';

// Define props for ThemedDropdownPicker, extending DropDownPickerProps
type ThemedDropdownPickerProps = DropDownPickerProps<any> & {
  lightColor?: string; // Optional light theme color
  darkColor?: string; // Optional dark theme color
  iconSize?: number; // Optional size for icons
  emptyListText?: string; // Text to display when item list is empty
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

export const ThemedDropdownPicker: React.FC<ThemedDropdownPickerProps> = ({
  style = {},
  textStyle = {},
  dropDownContainerStyle = {},
  lightColor,
  darkColor,
  iconSize = 18, // Default size for icons
  emptyListText = 'No items available', // Default text for empty list
  items,
  setValue,
  value,
  ...props
}) => {
  // Use the provided colors if available, otherwise fallback to theme colors
  const backgroundColor = useMemo(
    () =>
      useThemeColor({ light: lightColor, dark: darkColor }, 'inputBackground'),
    [lightColor, darkColor]
  );

  const color = useMemo(
    () => useThemeColor({ light: lightColor, dark: darkColor }, 'text'),
    [lightColor, darkColor]
  );

  // Handle single item selection automatically if only one item is available
  const handleSingleItemSelection = () => {
    if (items.length === 1 && setValue) {
      setValue(() => items[0].value);
    }
  };

  // Use effect to handle single item selection
  useEffect(() => {
    handleSingleItemSelection();
  }, [items, setValue]);

  // Display empty list text if no items are available
  if (items.length === 0) {
    return (
      <ThemedText style={[{ textAlign: 'center', fontSize: 16 }, textStyle]}>
        {emptyListText}
      </ThemedText>
    );
  }

  // Display single item text if only one item is available
  if (items.length === 1) {
    return (
      <ThemedText style={[{ textAlign: 'center', fontSize: 16 }, textStyle]}>
        {items[0].label}
      </ThemedText>
    );
  }

  // Render DropDownPicker with custom styles and icons
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
      ArrowUpIconComponent={({ style }) => (
        <ArrowUpIcon color={color} size={iconSize} />
      )}
      ArrowDownIconComponent={({ style }) => (
        <ArrowDownIcon color={color} size={iconSize} />
      )}
      TickIconComponent={({ style }) => (
        <TickIcon color={color} size={iconSize} />
      )}
      {...props}
    />
  );
};
