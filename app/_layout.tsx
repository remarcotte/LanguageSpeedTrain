import { Stack } from 'expo-router';
import { ThemedPressable } from '../components/ThemedPressable';
import Toast from 'react-native-toast-message';

export default function Layout() {
  return (
    <>
      <Stack
        initialRouteName="/home"
        screenOptions={({ navigation }) => ({
          headerTitleAlign: 'center',
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
        })}
      ></Stack>
      <Toast />
    </>
  );
}
