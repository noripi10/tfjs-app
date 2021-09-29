import React, { useContext, useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import { VStack, useColorMode, Center, Stack, Box } from 'native-base';
import { AdMobBanner, getPermissionsAsync, requestPermissionsAsync, PermissionStatus } from 'expo-ads-admob';
import LottieView from 'lottie-react-native';
import { useColorScheme } from 'react-native-appearance';
import { StackNavigationProp } from '@react-navigation/stack';

import { useTensorFlow } from '../hooks/useTensorFlow';
import { AppContext } from '../provider/AppProvider';
import { StackParamList } from '../navigation/StackNavigator';
import { AppButton, AppText } from '../components';

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
    <Center
      width='100%'
      height='100%'
      bg={{
        linearGradient: {
          colors: ['orange.300', 'orange.500'],
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
        <AppText>{`react-native-appearance: ${colorScheme}`}</AppText>
        <AppText>{`nativebase colorMode: ${colorMode ? colorMode : 'none'}`}</AppText>
        <AppButton bg='pink.600' onPress={toggleColorMode}>
          change theme
        </AppButton>
        <AppButton
          bg='orange.600'
          disabled={!!!mobileNetModel}
          isLoading={!!!mobileNetModel}
          onPress={() => navigation.navigate('mobilenet')}
        >
          picture analyze
        </AppButton>
        <AppButton
          bg='red.600'
          disabled={!!!cameraPermission || !!!handPoseModel}
          isLoading={!!!handPoseModel}
          onPress={() => navigation.navigate('handpose')}
        >
          handpose analyze
        </AppButton>
      </VStack>
      <VStack flex={1} alignItems='flex-end'>
        <LottieView source={require('../../assets/tsconfig.json')} autoPlay loop style={{ width: 200, height: 200 }} />
      </VStack>
    </Center>
  );
};
