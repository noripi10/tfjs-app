/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from 'react';
import { Box, HStack, Text, Center, Button, Heading, VStack, useColorModeValue, useColorMode } from 'native-base';
import { StyleSheet, Image } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { Camera } from 'expo-camera';
import { cameraWithTensors } from '@tensorflow/tfjs-react-native';

import { useTensorFlow } from '../hooks/useTensorFlow';
import { useColorScheme } from 'react-native-appearance';
import { useLayoutEffect } from 'react';

const TensorCamera = cameraWithTensors(Camera);

export const TensorScreen: React.VFC = () => {
  const { cameraPermission, loadedTensorflow, handleCameraStream, prediction, handlePrediction, textureDimensions } =
    useTensorFlow();

  const colorScheme = useColorScheme();
  const { colorMode, toggleColorMode } = useColorMode();
  const bg: string = useColorModeValue('gray.200', 'gray.800');

  useLayoutEffect(() => {
    // system colorが変更された場合にはsystem colorへ統一する
    if (colorScheme !== colorMode) {
      toggleColorMode();
    }
  }, [colorScheme]);

  return (
    <>
      <Box flex={1} bg={bg} safeArea>
        <HStack flex={1} alignItems='center'>
          <Center
            flex={2}
            bg={{
              linearGradient: {
                colors: ['lightBlue.300', 'violet.800'],
                start: [0, 0],
                end: [1, 1],
              },
            }}
            height='100%'
          >
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

            {cameraPermission === null ? (
              <Text>camera初期化中</Text>
            ) : cameraPermission === false ? (
              <Text>camera使用不可</Text>
            ) : (
              <Text>camera設定完了</Text>
            )}
            {loadedTensorflow === null ? (
              <Text>tensorflow初期化中</Text>
            ) : loadedTensorflow === false ? (
              <Text>tensorflow使用不可</Text>
            ) : (
              <Text>tensorflow設定完了</Text>
            )}

            <Button
              bg='blue.800'
              width={120}
              height={36}
              borderRadius={999}
              alignItems='center'
              py={0}
              m={2}
              onPress={handlePrediction}
            >
              <Text color='white'>prediction</Text>
            </Button>
          </Center>
          <VStack flex={1} bgColor='red.800'>
            <Heading m={1} size='sm'>
              result
            </Heading>
            <ScrollView>
              <Text fontSize={11} color='#000'>
                {prediction && JSON.stringify(prediction, null, 1)}
              </Text>
            </ScrollView>
          </VStack>
        </HStack>
        <Center flex={1}>
          {/* <TensorCamera
          style={styles.camera}
          type={Camera.Constants.Type.front}
          cameraTextureHeight={textureDimensions.height}
          cameraTextureWidth={textureDimensions.width}
          resizeHeight={200}
          resizeWidth={152}
          resizeDepth={3}
          onReady={handleCameraStream}
          autorender={true}
        /> */}

          {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
          <Image source={require('../../assets/soccer.jpg')} resizeMode='cover' style={{ flex: 1, opacity: 1 }} />
        </Center>
      </Box>
      <StatusBar style={colorMode === 'dark' ? 'light' : 'dark'} />
    </>
  );
};

// const styles = StyleSheet.create({
//   camera: {
//     justifyContent: 'flex-start',
//     backgroundColor: 'blue',
//   },
// });
