import React, { useEffect } from 'react';
import { router, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

import { InitAll } from '../services/InitAll';
import { ErrorService } from '../services/ErrorService';
import { ErrorActionType } from '../types/ErrorTypes';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const errorService = ErrorService.getInstance();

  useEffect(() => {
    const prepare = async () => {
      try {
        const initAll = new InitAll();
        await initAll.initialize();
      } catch (error) {
        await errorService.logError(
          ErrorActionType.TOASTONLY,
          8,
          'Error while initializing.',
          error
        );
      }
      await SplashScreen.hideAsync();
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
