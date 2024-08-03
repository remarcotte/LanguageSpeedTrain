import React, { useEffect } from "react";
import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";

import InitAll from "../services/InitAll";

SplashScreen.preventAutoHideAsync();

export default function App() {
  useEffect(() => {
    const prepare = async () => {
      const initAll = new InitAll();
      await initAll.initialize();
      await SplashScreen.hideAsync();
      router.replace("/home"); // Navigate to the home screen
    };
    prepare();
  }, []);

  return (
    <>
      <Stack />
    </>
  );
}
