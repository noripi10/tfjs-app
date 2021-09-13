/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from 'react';
import {
  Box,
  HStack,
  Text,
  Center,
  Button,
  Heading,
  VStack,
  useColorModeValue,
  useColorMode,
  Spinner,
} from 'native-base';
import { StyleSheet, Image } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { Camera, CameraProps } from 'expo-camera';
import { cameraWithTensors } from '@tensorflow/tfjs-react-native';

import { useTensorFlow } from '../hooks/useTensorFlow';
import { useColorScheme } from 'react-native-appearance';
import { useLayoutEffect } from 'react';

const TensorCamera = cameraWithTensors<CameraProps>(Camera);

export const TensorScreen: React.VFC = () => {
  const {
    cameraPermission,
    loadedTensorflow,
    handleCameraStream,
    prediction,
    handlePrediction,
    predictioning,
    textureDimensions,
  } = useTensorFlow();

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
        <VStack flex={1} alignItems='center'>
          <Center
            justifyContent='center'
            bg={{
              linearGradient: {
                colors: ['lightBlue.300', 'violet.800'],
                start: [0, 0],
                end: [1, 1],
              },
            }}
            w='100%'
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
              onPress={() => handlePrediction(require('../../assets/dog.jpeg'))}
            >
              <Text color='white'>prediction</Text>
            </Button>
          </Center>
          <VStack flex={1} bgColor='emerald.500' w='100%' p='2'>
            <Heading m={1} size='sm'>
              result
            </Heading>
            <ScrollView>
              {prediction &&
                prediction.map(({ className, probability }) => (
                  <Text key={className} color='white'>{`${className} 確率: ${Math.floor(probability * 100)}% `}</Text>
                ))}
            </ScrollView>
          </VStack>
        </VStack>
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
          <Image source={require('../../assets/dog.jpeg')} resizeMode='contain' style={{ flex: 1, opacity: 1 }} />
        </Center>
      </Box>
      {predictioning && (
        <Center position='absolute' top={0} left={0} right={0} bottom={0}>
          <Spinner color='blue.500' size='large' />
        </Center>
      )}
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
