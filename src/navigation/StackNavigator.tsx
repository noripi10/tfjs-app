import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TensorScreen } from '../screens/TensorScreen';
import { WelcomScreen } from '../screens/WelcomScreen';

export type StackParamList = {
  welcome: undefined;
  mobilenet: undefined;
};

const Stack = createStackNavigator<StackParamList>();

export const StackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name='welcome' component={WelcomScreen} />
      <Stack.Screen name='mobilenet' component={TensorScreen} />
    </Stack.Navigator>
  );
};
