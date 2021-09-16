import React, { useContext } from 'react';
import { Box, HStack, Text, Button, VStack, useColorMode } from 'native-base';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native-appearance';
import { StackNavigationProp } from '@react-navigation/stack';

import { StackParamList } from '../navigation/StackNavigator';
import { AppContext } from '../provider/AppProvider';
import { AppButton } from '../components/AppButton';

type Props = {
  navigation: StackNavigationProp<StackParamList, 'welcome'>;
};

export const WelcomScreen: React.VFC<Props> = ({ navigation }: Props) => {
  const { model } = useContext(AppContext);
  const colorScheme = useColorScheme();
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <>
      <HStack
        flex={1}
        bg={{
          linearGradient: {
            colors: ['lightBlue.300', 'violet.800'],
            start: [0, 0],
            end: [1, 1],
          },
        }}
      >
        <VStack flex={1} alignItems='center' pt={8}>
          <Text>{`react-native-appearance: ${colorScheme}`}</Text>
          <Text pb={2}>{`nativebase colorMode: ${colorMode ? colorMode : 'none'}`}</Text>
          <AppButton bg='red.500' onPress={toggleColorMode}>
            change theme
          </AppButton>
          <AppButton disabled={!!!model} isLoading={!!!model} onPress={() => navigation.navigate('main')}>
            picture analyze
          </AppButton>
        </VStack>
      </HStack>
      <StatusBar style={colorMode === 'dark' ? 'light' : 'dark'} />
    </>
  );
};
