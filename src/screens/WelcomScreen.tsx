import React, { useContext, useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import { Text, VStack, useColorMode, Center } from 'native-base';
import { StatusBar } from 'expo-status-bar';
import { AdMobBanner, getPermissionsAsync, requestPermissionsAsync, PermissionStatus } from 'expo-ads-admob';
import { useColorScheme } from 'react-native-appearance';
import { StackNavigationProp } from '@react-navigation/stack';

import { StackParamList } from '../navigation/StackNavigator';
import { AppContext } from '../provider/AppProvider';
import { AppButton } from '../components/AppButton';
import { useTensorFlow } from '../hooks/useTensorFlow';

const unitId = Platform.select({
  ios: __DEV__ ? 'ca-app-pub-3940256099942544/2934735716' : 'ca-app-pub-7379270123809470/8398846802',
  android: __DEV__ ? 'ca-app-pub-3940256099942544/6300978111' : 'ca-app-pub-7379270123809470/1450295075',
});

type Props = {
  navigation: StackNavigationProp<StackParamList, 'welcome'>;
};

export const WelcomScreen: React.VFC<Props> = ({ navigation }: Props) => {
  // react-native-appearance
  const colorScheme = useColorScheme();
  // native-base
  const { colorMode, toggleColorMode } = useColorMode();

  const { mobileNetModel, setMobileNetModel, handPoseModel, setHandPoseModel } = useContext(AppContext);
  const { initialModel, cameraPermission } = useTensorFlow();

  const [canTracking, setCanTracking] = useState<boolean | null>(null);

  const trackingSetting = useCallback(async () => {
    const { status } = await getPermissionsAsync();

    if (status === PermissionStatus.GRANTED) {
      setCanTracking(true);
    } else {
      const { status: requestStatus } = await requestPermissionsAsync();
      if (requestStatus === PermissionStatus.GRANTED) {
        setCanTracking(true);
      } else {
        setCanTracking(false);
      }
    }

    setCanTracking(false);
  }, []);

  useEffect(() => {
    // tracking setting
    trackingSetting();
    // initial tensorflow model
    initialModel().then((data) => {
      setMobileNetModel(data.mobileNetModel);
      setHandPoseModel(data.handPoseModel);
    });
  }, []);

  if (canTracking === null) {
    return null;
  }

  return (
    <>
      <Center
        width='100%'
        height='100%'
        bg={{
          linearGradient: {
            colors: ['lightBlue.300', 'violet.800'],
            start: [0, 0],
            end: [1, 1],
          },
        }}
      >
        <AdMobBanner
          bannerSize='largeBanner'
          adUnitID={unitId}
          servePersonalizedAds={canTracking}
          onDidFailToReceiveAdWithError={(string: any) => console.log(string)}
        />
        <VStack flex={1} alignItems='center' pt={8}>
          <Text>{`react-native-appearance: ${colorScheme}`}</Text>
          <Text pb={2}>{`nativebase colorMode: ${colorMode ? colorMode : 'none'}`}</Text>
          <AppButton bg='red.500' onPress={toggleColorMode}>
            change theme
          </AppButton>
          <AppButton
            disabled={!!!mobileNetModel}
            isLoading={!!!mobileNetModel}
            onPress={() => navigation.navigate('mobilenet')}
          >
            picture analyze
          </AppButton>
          <AppButton
            bg='teal.400'
            disabled={!!!cameraPermission || !!!handPoseModel}
            isLoading={!!!handPoseModel}
            onPress={() => navigation.navigate('handpose')}
          >
            handpose analyze
          </AppButton>
        </VStack>
      </Center>
      <StatusBar style={colorMode === 'dark' ? 'light' : 'dark'} />
    </>
  );
};
