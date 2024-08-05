import { StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';

import { useThemeColor } from '@/hooks/useThemeColor';

import { ThemedPressable } from '@/components/ThemedPressable';
import { ThemedScreen } from '@/components/ThemedScreen';

export default function Home() {
  // Retrieve the theme colors for background and text
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  return (
    <ThemedScreen style={styles.container} title="Home">
      {/* Display the logo image */}
      <Image
        style={styles.logoImage}
        source={require('@/assets/images/logo.png')}
        contentFit="contain"
      />
      {/* Navigation buttons */}
      <ThemedPressable
        title="New Game"
        fontSize={32}
        style={styles.button}
        onPress={() => {
          router.navigate('/newGame'); // Navigate to the New Game screen
        }}
      />
      <ThemedPressable
        title="Manage Decks"
        fontSize={32}
        style={styles.button}
        onPress={() => {
          router.navigate('/manageDecks'); // Navigate to the Manage Decks screen
        }}
      />
      <ThemedPressable
        title="Statistics"
        fontSize={32}
        style={styles.button}
        onPress={() => {
          router.navigate('/statistics'); // Navigate to the Statistics screen
        }}
      />
      <ThemedPressable
        title="About"
        fontSize={32}
        style={styles.button}
        onPress={() => {
          router.navigate('/about'); // Navigate to the About screen
        }}
      />
      <ThemedPressable
        title="Debug"
        fontSize={32}
        style={styles.button}
        onPress={() => {
          router.navigate('/debug'); // Navigate to the Debug screen
        }}
      />
    </ThemedScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center', // Center align items horizontally
  },
  button: {
    paddingVertical: 10, // Vertical padding for buttons
    paddingHorizontal: 25, // Horizontal padding for buttons
    marginVertical: 5, // Space between buttons
    borderRadius: 5, // Rounded corners for buttons
  },
  logoImage: {
    width: '60%', // Set width to 60% of the container
    height: undefined, // Maintain aspect ratio
    aspectRatio: 1, // Aspect ratio for the image
    marginTop: '10%', // Top margin for logo positioning
  },
});
