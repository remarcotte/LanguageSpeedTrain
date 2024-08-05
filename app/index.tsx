import React, { useEffect } from 'react';
import { router, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

import { InitAll } from '../services/InitAll';
import { ErrorService } from '../services/ErrorService';
import { ErrorActionType } from '../types/ErrorTypes';

// Prevent the splash screen from hiding automatically until the app is ready
SplashScreen.preventAutoHideAsync();

export default function App() {
  // Retrieve the singleton instance of the ErrorService
  const errorService = ErrorService.getInstance();

  useEffect(() => {
    // Function to prepare and initialize the app
    const prepare = async () => {
      try {
        const initAll = new InitAll(); // Create an instance of InitAll to handle initialization
        await initAll.initialize(); // Initialize app services and resources
      } catch (error) {
        // Log any initialization errors
        await errorService.logError(
          ErrorActionType.TOASTONLY,
          8,
          'Error while initializing.',
          error
        );
      }
      await SplashScreen.hideAsync(); // Hide the splash screen once initialization is complete
      router.replace('/home'); // Navigate to the home screen
    };
    prepare();
  }, []);

  return (
    <>
      <Stack /> {/* Use Expo Router's Stack component to handle navigation */}
    </>
  );
}
