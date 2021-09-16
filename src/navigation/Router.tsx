import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { StackNavigator } from './StackNavigator';
import { useColorScheme } from 'react-native-appearance';
import { useColorMode } from 'native-base';
import { AppContext } from '../provider/AppProvider';
import { useTensorFlow } from '../hooks/useTensorFlow';

export const Router = () => {
  const colorScheme = useColorScheme();
  const { colorMode, toggleColorMode } = useColorMode();
  const { setMobileNetModel, setHandPoseModel } = useContext(AppContext);
  const { initialModel } = useTensorFlow();

  useLayoutEffect(() => {
    // system colorが変更された場合にはsystem colorへ統一する
    if (colorScheme !== colorMode) {
      toggleColorMode();
    }
  }, [colorScheme]);

  const theme = colorMode === 'dark' ? DarkTheme : DefaultTheme;

  useEffect(() => {
    initialModel().then((data) => {
      setMobileNetModel(data.mobileNetModel);
      setHandPoseModel(data.handPoseModel);
    });
  }, []);

  return (
    <NavigationContainer theme={theme}>
      <StackNavigator />
    </NavigationContainer>
  );
};
