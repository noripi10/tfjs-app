import React, { useLayoutEffect } from 'react';
import { StatusBar } from 'expo-status-bar';

import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { DrawerNavigation } from './DrawerNavigation';

import { useColorScheme } from 'react-native-appearance';
import { useColorMode } from 'native-base';

export const Router = () => {
  const colorScheme = useColorScheme();
  const { colorMode, toggleColorMode } = useColorMode();

  useLayoutEffect(() => {
    // system colorが変更された場合にはsystem colorへ統一する
    if (colorScheme !== colorMode) {
      toggleColorMode();
    }
  }, [colorScheme]);

  const theme = colorMode === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <>
      <NavigationContainer theme={theme}>
        <DrawerNavigation />
      </NavigationContainer>
      <StatusBar style={colorMode === 'dark' ? 'light' : 'dark'} />
    </>
  );
};
