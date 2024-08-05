import React, { useEffect } from 'react';
import { router, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

import { InitAll } from '../services/InitAll';

// Prevent the splash screen from hiding automatically until the app is ready
SplashScreen.preventAutoHideAsync();

export default function App() {
  useEffect(() => {
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
    <>
      <Stack />
    </>
  );
}
