// index.tsx

import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { router, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

import { useColorScheme } from 'react-native';
import { InitAll } from '@/services/InitAll';

export default function App() {
  // const colorScheme = useColorScheme(); // Detect system color scheme
  // const lightMode = useColorScheme() ?? "light";
  // const backgroundColor = (lightMode === "light") ? '#333' : '#fff';

  useEffect(() => {
    // Prevent the splash screen from hiding automatically until the app is ready
    SplashScreen.preventAutoHideAsync();

    // Function to prepare and initialize the app
    const prepare = async () => {
      try {
        const initAll = new InitAll(); // Create an instance of InitAll to handle initialization
        await initAll.initialize(); // Initialize app services and resources
      } catch (error) {
        // Log any initialization errors
        console.log('Error while initializing.');
      }
      await SplashScreen.hideAsync(); // Hide the splash screen once initialization is complete
      router.replace('/home'); // Navigate to the home screen
    };
    prepare();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: '#938562' }]}>
      <Image
        source={
          // colorScheme === 'dark'
          //   ? require('./assets/splash-dark.png')
          //   : require('./assets/splash-light.png')
          require('@/assets/images/splash.png')
        }
        style={styles.splashImage}
      />
      <Stack />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: colorScheme === 'dark' ? '#000' : '#fff',
  },
  splashImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});
