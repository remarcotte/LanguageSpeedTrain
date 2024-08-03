import React from "react";
import { View, type ViewProps, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedScreenProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  title: string;
  children: React.ReactNode;
  headerRight?: React.ReactNode;
};

export function ThemedScreen({
  style,
  lightColor,
  darkColor,
  title,
  children,
  headerRight,
  ...otherProps
}: ThemedScreenProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background",
  );
  const textColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "text",
  );

  return (
    <View style={[styles.screen, { backgroundColor }, style]} {...otherProps}>
      <Stack.Screen
        options={{
          title,
          headerStyle: { backgroundColor },
          headerTintColor: textColor,
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerRight: () => headerRight,
        }}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 16,
    justifyContent: "flex-start",
  },
});
