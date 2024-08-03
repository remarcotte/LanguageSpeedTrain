import React, { forwardRef } from "react";
import {
  TextInput as RNTextInput,
  TextInputProps,
  StyleSheet,
} from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedTextInputProps = TextInputProps & {
  lightColor?: string;
  darkColor?: string;
};

export const ThemedTextInput = forwardRef<RNTextInput, ThemedTextInputProps>(
  ({ style, lightColor, darkColor, ...props }, ref) => {
    const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
    const background = useThemeColor(
      { light: lightColor, dark: darkColor },
      "inputBackground",
    );

    return (
      <RNTextInput
        ref={ref}
        style={[
          styles.default,
          { color: color, backgroundColor: background, borderColor: color },
          style,
        ]}
        placeholderTextColor={color}
        {...props}
      />
    );
  },
);

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
});
