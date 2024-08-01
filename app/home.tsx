import { StyleSheet } from 'react-native';
import { ThemedPressable } from '@/components/ThemedPressable';
import { ThemedView } from '@/components/ThemedView';
import { Image } from 'expo-image';
import { router } from 'expo-router';

export default function Home() {
  return (
      <ThemedView style={styles.container}>
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
        <ThemedPressable
          title="Debug"
          fontSize={32}
          style={styles.button}
          onPress={() => { router.navigate('/debug');}}
        />
      </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: '10%', // Start 15% down from the top
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
  },
});