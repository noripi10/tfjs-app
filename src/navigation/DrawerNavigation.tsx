import React from 'react';
import { View, Text } from 'react-native';
import { createDrawerNavigator, DrawerContentComponentProps } from '@react-navigation/drawer';
import { StackNavigator, StackParamList } from './StackNavigator';
import { DescriptionScreen } from '../screens/DescriptionScreen';
import { NavigatorScreenParams } from '@react-navigation/core';
import { HStack, VStack, Badge, Heading, Pressable } from 'native-base';

export type DrawerParamList = {
  main: NavigatorScreenParams<StackParamList>;
  description: undefined;
};

const Drawer = createDrawerNavigator<DrawerParamList>();

const menuSetting = {
  main: 'TensorFlow 機能',
  description: "What's TensorFlow ?",
};

export const DrawerNavigation = () => {
  return (
    <Drawer.Navigator
      screenOptions={{ headerShown: false }}
      drawerContent={(props: DrawerContentComponentProps) => (
        <VStack safeArea space={2}>
          <Heading pl={2} fontFamily='PatrickHand-Regular'>
            - menu -
          </Heading>
          {props.state.routes.map((route) => (
            <Pressable key={route.key} onPress={() => props.navigation.navigate(route.name)}>
              <Badge p={2} colorScheme='info' _text={{ fontFamily: 'PatrickHand-Regular' }}>
                {menuSetting[route.name]}
              </Badge>
            </Pressable>
          ))}
        </VStack>
      )}
    >
      <Drawer.Screen name='main' component={StackNavigator} />
      <Drawer.Screen name='description' component={DescriptionScreen} />
    </Drawer.Navigator>
  );
};
