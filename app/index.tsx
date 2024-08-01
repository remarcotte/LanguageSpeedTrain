import React, { useEffect } from 'react';
import { RootSiblingParent } from 'react-native-root-siblings';
import { router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedPressable } from '@/components/ThemedPressable';
import { useToast, ToastProvider } from '@/components/toast';
import InitAll from '../services/InitAll';

SplashScreen.preventAutoHideAsync();

export default function App() {
  useEffect(() => {
    const prepare = async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate a task
      SplashScreen.hideAsync(); // Hide the splash screen once everything is ready
    };
    prepare();
  }, []);

  useEffect(() => {
    const initAll = new InitAll();
  }, []);

  return (
    <RootSiblingParent>
      <ToastProvider>
        <MainComponent />
      </ToastProvider>
    </RootSiblingParent>
  );
}

function MainComponent() {
  const { showToast } = useToast();

  const handleToast = () => {
    showToast('This is a themed toast!');
  };

  return (
    <ThemedView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ThemedText>Edit app/index.tsx to edit this screen.</ThemedText>
      <ThemedPressable title="Show Toast" onPress={handleToast} />
      <ThemedPressable title="Home Screen" onPress={handleToast} />
      <ThemedPressable
          title="Home"
          fontSize={32}
          onPress={() => { router.navigate('/home');}}
      />

    </ThemedView>
  );
}

/*
import React, { useEffect } from 'react';
import 'react-native-gesture-handler';
import { ThemeProvider } from './components/ThemeProvider';
import AppNavigator from './navigation/AppNavigator';
import InitAll from './services/InitAll';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync(); // Keep the splash screen visible

export default function App() {
  useEffect(() => {
    const prepare = async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate a task
      SplashScreen.hideAsync(); // Hide the splash screen once everything is ready
    };
    prepare();
  }, []);

  useEffect(() => {
    const initAll = new InitAll();
  }, []);
*/