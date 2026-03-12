import React, { useEffect } from "react";

import { Platform } from "react-native";

import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { setBackgroundColorAsync } from "expo-system-ui";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import * as NavigationBar from "expo-navigation-bar";

//Helpers
import { queryClient } from "@core/helper/queryClient";

import { QueryClientProvider } from "@tanstack/react-query";
import "./global.css";

//Components
import { GeneralModals } from "@src/components/modals/generalModals";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // ... rest of imports/state

  const [fontsLoaded, fontError] = useFonts({
    InterItalic: require("../src/assets/fonts/Inter_24pt-Italic.ttf"),
    InterBold: require("../src/assets/fonts/Inter_24pt-Bold.ttf"),
    InterSemiBold: require("../src/assets/fonts/Inter_24pt-SemiBold.ttf"),
    InterMedium: require("../src/assets/fonts/Inter_24pt-Medium.ttf"),
    InterRegular: require("../src/assets/fonts/Inter_24pt-Regular.ttf"),
    InterLight: require("../src/assets/fonts/Inter_24pt-Light.ttf"),
  })

  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setButtonStyleAsync("dark");
      setBackgroundColorAsync("#181A2A");
    }
  }, []);

  useEffect(() => {
    if (fontError) throw fontError;
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView
        style={{
          flex: 1,
          paddingTop: 0,
          backgroundColor: "#fff",
        }}
      >
        <SafeAreaProvider>
          <Stack screenOptions={{ headerShown: false }} />
          <GeneralModals />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  )
}