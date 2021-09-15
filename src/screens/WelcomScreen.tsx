import React from 'react';
import { Box, HStack, Text, Button, VStack, useColorMode } from 'native-base';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native-appearance';
import { StackNavigationProp } from '@react-navigation/stack';

import { StackParamList } from '../navigation/StackNavigator';

type Props = {
  navigation: StackNavigationProp<StackParamList, 'welcome'>;
};

export const WelcomScreen: React.VFC<Props> = ({ navigation }: Props) => {
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
          <Button
            bg='red.800'
            width={120}
            height={36}
            borderRadius={999}
            alignItems='center'
            py={0}
            m={2}
            onPress={toggleColorMode}
          >
            <Text color='white'>toggle color</Text>
          </Button>

          <Button borderRadius={999} onPress={() => navigation.navigate('main')}>
            goto main page
          </Button>
        </VStack>
      </HStack>
      <StatusBar style={colorMode === 'dark' ? 'light' : 'dark'} />
    </>
  );
};
