// home.tsx

import { StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';

import { useThemeColor } from '@/hooks/useThemeColor';

import { ThemedPressable } from '@/components/ThemedPressable';
import { ThemedScreen } from '@/components/ThemedScreen';

import { SHOW_DEBUG_SCREEN } from '@/constants/General';

export default function Home() {
  // Retrieve the theme colors for background and text
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  return (
    <ThemedScreen style={styles.container} title="Home">
      <Image
        style={styles.logoImage}
        source={require('@/assets/images/logo.jpg')}
        contentFit="contain"
      />
      <ThemedPressable
        type="big"
        title="New Game"
        onPress={() => {
          router.navigate('/newGame');
        }}
      />
      <ThemedPressable
        type="big"
        title="Manage Decks"
        onPress={() => {
          router.navigate('/manageDecks');
        }}
      />
      <ThemedPressable
        type="big"
        title="Statistics"
        onPress={() => {
          router.navigate('/statistics');
        }}
      />
      <ThemedPressable
        type="big"
        title="About"
        onPress={() => {
          router.navigate('/about');
        }}
      />
      {SHOW_DEBUG_SCREEN && (
        <ThemedPressable
          type="big"
          title="Debug"
          onPress={() => {
            router.navigate('/debug');
          }}
        />
      )}
    </ThemedScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center', // Center align items horizontally
    backgroundColor: '#938562',
  },
  logoImage: {
    width: '60%', // Set width to 60% of the container
    height: undefined, // Maintain aspect ratio
    aspectRatio: 1, // Aspect ratio for the image
    marginTop: '10%', // Top margin for logo positioning
  },
});
