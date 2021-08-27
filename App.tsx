/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React from 'react';
import { NativeBaseProvider, extendTheme } from 'native-base';
import { AppearanceProvider } from 'react-native-appearance';

import { TensorScreen } from './src/screens/TensorScreen';

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
        <TensorScreen />
      </NativeBaseProvider>
    </AppearanceProvider>
  );
}
