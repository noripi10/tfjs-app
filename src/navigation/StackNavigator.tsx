import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { MobilenetScreen } from '../screens/MobilenetScreen';
import { WelcomScreen } from '../screens/WelcomScreen';
import { HandPoseScreen } from '../screens/HandPoseScreen';

export type StackParamList = {
  welcome: undefined;
  mobilenet: undefined;
  handpose: undefined;
};

const Stack = createStackNavigator<StackParamList>();

export const StackNavigator = () => {
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
