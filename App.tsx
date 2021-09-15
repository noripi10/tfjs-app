/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React from 'react';
import { NativeBaseProvider, extendTheme } from 'native-base';
import { AppearanceProvider } from 'react-native-appearance';

import { Router } from './src/navigation/Router';
import { AppProvider } from './src/provider/AppProvider';

// Define the config
const themeConfig = {
  useSystemColorMode: false,
  initialColorMode: 'dark',
};

// extend the theme
const customTheme = extendTheme({ themeConfig });

const config = {
  dependencies: {
    'linear-gradient': require('expo-linear-gradient').LinearGradient,
  },
};

export default function App(): JSX.Element {
  return (
    <AppearanceProvider>
      <NativeBaseProvider theme={customTheme} config={config}>
        <AppProvider>
          <Router />
        </AppProvider>
      </NativeBaseProvider>
    </AppearanceProvider>
  );
}
