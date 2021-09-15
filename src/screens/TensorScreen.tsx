/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useState, useLayoutEffect, useCallback } from 'react';
import {
  Box,
  HStack,
  Text,
  Center,
  Button,
  Heading,
  useColorMode,
  Spinner,
  ScrollView,
  Flex,
  Stack,
} from 'native-base';
import { StyleSheet, Image, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Camera, CameraProps } from 'expo-camera';
import { cameraWithTensors } from '@tensorflow/tfjs-react-native';
import { launchImageLibrary, Asset } from 'react-native-image-picker';

import { useTensorFlow } from '../hooks/useTensorFlow';
import { useColorScheme } from 'react-native-appearance';

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

  const [imageData, setImageData] = useState<Asset[] | undefined>(undefined);

  const onSelectImage = useCallback(() => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      // console.log(response.assets);
      if (response.errorMessage) {
        Alert.alert(response.errorMessage);
        return false;
      }
      if (!!!response.didCancel) {
        setImageData(response.assets);
      }
    });
  }, []);

  const onPrediction = useCallback(() => {
    if (imageData && imageData.length) {
      handlePrediction(imageData);
    }
  }, [imageData]);

  useLayoutEffect(() => {
    // system colorが変更された場合にはsystem colorへ統一する
    if (colorScheme !== colorMode) {
      toggleColorMode();
    }
  }, [colorScheme]);

  return (
    <>
      <Box flex={1}>
        <Box
          flex={1}
          bg={{
            linearGradient: {
              colors: ['lightBlue.300', 'violet.800'],
              start: [0, 0],
              end: [1, 1],
            },
          }}
        >
          <HStack flex={1} flexDirection='row' justifyContent='center' alignItems='center'>
            <Box px={1}>
              {cameraPermission === null ? (
                <Text>camera初期化中</Text>
              ) : cameraPermission === false ? (
                <Text>camera使用不可</Text>
              ) : (
                <Text>camera設定完了</Text>
              )}
            </Box>
            <Box px={1}>
              {loadedTensorflow === null ? (
                <Text>tensorflow初期化中</Text>
              ) : loadedTensorflow === false ? (
                <Text>tensorflow使用不可</Text>
              ) : (
                <Text>tensorflow設定完了</Text>
              )}
            </Box>
          </HStack>
          <HStack flex={2} flexDirection='row' justifyContent='center' alignItems='center'>
            <Button
              bg='blue.700'
              _text={{ color: '#fff' }}
              borderRadius={999}
              onPress={onSelectImage}
              disabled={!!!loadedTensorflow || predictioning}
            >
              写真選択
            </Button>
            <Button
              bg='blue.800'
              width={120}
              height={36}
              borderRadius={999}
              alignItems='center'
              py={0}
              m={2}
              disabled={!!!imageData || !!!cameraPermission || !!!loadedTensorflow || predictioning}
              onPress={onPrediction}
            >
              <Text color='white'>prediction</Text>
            </Button>
          </HStack>
        </Box>
      </Box>

      <Center flex={3}>
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
        {imageData && (
          <Image
            source={{ uri: imageData[0].uri }}
            resizeMode='cover'
            style={{ flex: 1, opacity: 1, width: '100%', height: '100%' }}
          />
        )}
      </Center>

      <Box flex={2} bgColor='emerald.500' w='100%' p='2'>
        <Heading m={1} size='sm'>
          result
        </Heading>
        <ScrollView>
          {prediction &&
            prediction.map(({ className, probability }) => (
              <HStack key={className} px='0' p={1} borderWidth={StyleSheet.hairlineWidth} borderColor='#ddd'>
                <Box w='75%'>
                  <Text color='white'>{className}</Text>
                </Box>
                <Text>確率：</Text>
                <Box w='15%'>
                  <Text textAlign='right' pr='3' color='white'>
                    {Math.round(probability * 1000) / 10}%
                  </Text>
                </Box>
              </HStack>
            ))}
        </ScrollView>
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
