/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useState, useLayoutEffect, useCallback } from 'react';
import { Box, HStack, VStack, Center, Heading, useColorMode, Spinner, ScrollView, Stack, Divider } from 'native-base';
import { StyleSheet, Image, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { launchImageLibrary, Asset } from 'react-native-image-picker';

import { useTensorFlow } from '../hooks/useTensorFlow';
// import { useColorScheme } from 'react-native-appearance';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../navigation/StackNavigator';
import { AppButton, AppText } from '../components';

type Props = {
  navigation: StackNavigationProp<StackParamList, 'mobilenet'>;
};

export const MobilenetScreen: React.VFC<Props> = ({ navigation }: Props) => {
  const { cameraPermission, loadedTensorflow, prediction, handlePrediction, predictioning } = useTensorFlow();
  // const colorScheme = useColorScheme();
  const { colorMode } = useColorMode();

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
    navigation.setOptions({
      headerBackTitle: 'back',
      headerTitle: 'tensoflow ☆mobilenet☆',
    });
  }, [navigation]);

  return (
    <>
      <Box flex={1}>
        <Stack flex={1}>
          <VStack flex={1} alignItems='center' display='flex' my={2}>
            <Box px={1}>
              {cameraPermission === null ? (
                <AppText>camera initializing...</AppText>
              ) : cameraPermission === false ? (
                <AppText>camera can't use</AppText>
              ) : (
                <AppText>camera initialize complete</AppText>
              )}
            </Box>
            <Box px={1}>
              {loadedTensorflow === null ? (
                <AppText>tensorflow initializing...</AppText>
              ) : loadedTensorflow === false ? (
                <AppText>tensorflow can't use</AppText>
              ) : (
                <AppText>tensorflow initialze complete</AppText>
              )}
            </Box>
          </VStack>
          <HStack flex={1} justifyContent='center' alignItems='center' my={2}>
            <AppButton
              bg='indigo.500'
              onPress={onSelectImage}
              disabled={!!!loadedTensorflow || predictioning}
              pressedColor='indigo.300'
            >
              picture select
            </AppButton>
            <AppButton
              bg='rose.500'
              disabled={!!!imageData || !!!cameraPermission || !!!loadedTensorflow || predictioning}
              onPress={onPrediction}
              pressedColor='rose.300'
            >
              execute
            </AppButton>
          </HStack>
        </Stack>
      </Box>

      <Center flex={3}>
        {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
        {imageData && (
          <Image
            source={{ uri: imageData[0].uri }}
            resizeMode='cover'
            style={{ flex: 1, opacity: 1, width: '100%', height: '100%' }}
          />
        )}
      </Center>

      <Divider />
      <Box flex={2} w='100%' p='2'>
        <Heading m={1} size='sm'>
          <AppText>result</AppText>
        </Heading>
        <ScrollView>
          {prediction &&
            prediction.map(({ className, probability }) => (
              <HStack key={className} px='0' p={1} borderWidth={StyleSheet.hairlineWidth} borderColor='#ddd'>
                <Box w='65%'>
                  <AppText>{className}</AppText>
                </Box>
                <AppText>prediction：</AppText>
                <Box w='15%'>
                  <AppText textAlign='right' pr={3}>
                    {`${Math.round(probability * 1000) / 10}%`}
                  </AppText>
                </Box>
              </HStack>
            ))}
        </ScrollView>
      </Box>

      {predictioning && (
        <Center position='absolute' top={0} left={0} right={0} bottom={0} bgColor={'rgba(0,0,0,.5)'}>
          <Spinner color='blue.500' size='large' />
        </Center>
      )}
    </>
  );
};
