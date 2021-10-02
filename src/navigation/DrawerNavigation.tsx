import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { StackNavigator, StackParamList } from './StackNavigator';
import { DescriptionScreen } from '../screens/DescriptionScreen';
import { NavigatorScreenParams } from '@react-navigation/core';
import { Box, Text } from 'native-base';

export type DrawerParamList = {
  main: NavigatorScreenParams<StackParamList>;
  description: undefined;
};

const Drawer = createDrawerNavigator<DrawerParamList>();

export const DrawerNavigation = () => {
  return (
    <Drawer.Navigator screenOptions={{ headerShown: false }}>
      <Drawer.Screen name='main' component={StackNavigator} />
      <Drawer.Screen name='description' component={DescriptionScreen} />
    </Drawer.Navigator>
  );
};
