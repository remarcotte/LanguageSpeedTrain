// _layout.tsx

import { Stack } from "expo-router";

import { ThemedPressable } from "@/components/ThemedPressable";
import { ThemedToast } from "@/components/ThemedToast";

export default function Layout() {
  return (
    <>
      <Stack
        initialRouteName="/home"
        screenOptions={({ navigation }) => ({
          headerTitleAlign: "center",
          headerLeft: ({ canGoBack }) =>
            canGoBack && (
              <ThemedPressable
                onPress={() => {
                  navigation.goBack();
                }}
                title="Back"
                fontSize={16}
                isTransparent={true}
              />
            ),
          headerBackTitleVisible: true, // Hide the default back title
          headerBackTitle: "Back", // Set the custom back title
        })}
      ></Stack>
      <ThemedToast />
    </>
  );
}
