import React, { useContext, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { MobilenetScreen } from '../screens/MobilenetScreen';
import { WelcomScreen } from '../screens/WelcomScreen';
import { HandPoseScreen } from '../screens/HandPoseScreen';
import { AppContext } from '../provider/AppProvider';
import { NavigationProp, useNavigation } from '@react-navigation/core';

export type StackParamList = {
  welcome: undefined;
  mobilenet: undefined;
  handpose: undefined;
};

const Stack = createStackNavigator<StackParamList>();

export const StackNavigator = () => {
  const { mobileNetModel } = useContext(AppContext);
  const navigation = useNavigation<NavigationProp<StackParamList>>();

  // push通知を受け取り画面画面遷移をするならここにビジネスロジックを記述

  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleStyle: { fontFamily: 'PatrickHand-Regular' },
      }}
    >
      <Stack.Screen
        name='welcome'
        component={WelcomScreen}
        options={{ title: 'TensorFlow.js App', headerTitleStyle: { fontFamily: 'PatrickHand-Regular' } }}
      />
      <Stack.Screen name='mobilenet' component={MobilenetScreen} />
      <Stack.Screen name='handpose' component={HandPoseScreen} />
    </Stack.Navigator>
  );
};
