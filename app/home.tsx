import { StyleSheet } from 'react-native';
import { ThemedPressable } from '@/components/ThemedPressable';
import { ThemedScreen } from '@/components/ThemedScreen';
import { Image } from 'expo-image';
import { router, Stack } from 'expo-router';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function Home() {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  return (
      <ThemedScreen
        style={styles.container}
        title='Home'
      >
        <Image
        style={styles.logoImage}
        source={require('@/assets/images/logo.png')}
        contentFit="contain"
        />
        <ThemedPressable
          title="New Game"
          fontSize={32}
          style={styles.button}
          onPress={() => { router.navigate('/newGame');}}
        />
        <ThemedPressable
          title="Manage Decks"
          fontSize={32}
          style={styles.button}
          onPress={() => { router.navigate('/manageDecks');}}
        />
        <ThemedPressable
          title="Statistics"
          fontSize={32}
          style={styles.button}
          onPress={() => { router.navigate('/statistics');}}
        />
        <ThemedPressable
          title="About"
          fontSize={32}
          style={styles.button}
          onPress={() => { router.navigate('/about');}}
        />
        {/* <ThemedPressable
          title="Debug"
          fontSize={32}
          style={styles.button}
          onPress={() => { router.navigate('/debug');}}
        /> */}
      </ThemedScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 25,
    marginVertical: 5, // Space between buttons
    borderRadius: 5,
  },
  logoImage: {
    width: '60%',
    height: undefined,
    aspectRatio: 1,
    marginTop: '10%',
  },
});