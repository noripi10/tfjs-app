import React, { useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Alert, Platform, TouchableOpacity } from 'react-native';
import { AlertDialog, VStack, useColorMode, Center, IconButton, Icon, useDisclose, Divider } from 'native-base';
import { AdMobBanner, getPermissionsAsync, requestPermissionsAsync, PermissionStatus } from 'expo-ads-admob';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { useColorScheme } from 'react-native-appearance';

import { useTensorFlow } from '../hooks/useTensorFlow';
import { AppContext } from '../provider/AppProvider';
import { AppButton, AppText } from '../components';
import { DrawerParamList } from '../navigation/DrawerNavigation';
import { DrawerNavigationProp, useDrawerStatus } from '@react-navigation/drawer';

const unitId = Platform.select({
  ios: __DEV__ ? 'ca-app-pub-3940256099942544/2934735716' : 'ca-app-pub-7379270123809470/8398846802',
  android: __DEV__ ? 'ca-app-pub-3940256099942544/6300978111' : 'ca-app-pub-7379270123809470/1450295075',
});

type Props = {
  navigation: DrawerNavigationProp<DrawerParamList, 'main'>;
};

export const WelcomScreen: React.VFC<Props> = ({ navigation }: Props) => {
  const cancelRef = useRef<TouchableOpacity | null>(null);
  // drawerNavigation
  const isDrawerOpen = useDrawerStatus() === 'open';
  // react-native-appearance
  const colorScheme = useColorScheme();
  // native-base
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onToggle } = useDisclose();

  const { mobileNetModel, setMobileNetModel, handPoseModel, setHandPoseModel, cocoSsdModel, setCocoSsdModel } =
    useContext(AppContext);
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
    // Drawer表示用アイコン生成
    navigation.setOptions({
      headerLeft: () => (
        <IconButton
          // ここに書くとOpenを感知できない。。。
          icon={<Icon as={AntDesign} size='sm' name={isDrawerOpen ? 'menufold' : 'menuunfold'} />}
          _pressed={{
            backgroundColor: '#383838',
          }}
          onPress={() => navigation.openDrawer()}
        />
      ),
    });
  }, [navigation, isDrawerOpen]);

  useEffect(() => {
    // tracking setting
    trackingSetting();
    // initial tensorflow model
    initialModel()
      .then((data) => {
        setMobileNetModel(data.mobileNetModel);
        setHandPoseModel(data.handPoseModel);
        setCocoSsdModel(data.cocoSsdModel);
      })
      .catch((error) => {
        if (error instanceof Error) {
          Alert.alert(error.message);
        }
      });
  }, []);

  if (canTracking === null) {
    return null;
  }

  return (
    <Center
      flex={1}
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
        onDidFailToReceiveAdWithError={(string: any) => console.error(string)}
      />
      <VStack flex={1} alignItems='center' pt={8}>
        <AppText>{`react-native-appearance: ${colorScheme}`}</AppText>
        <AppText>{`nativebase colorMode: ${colorMode ? colorMode : 'none'}`}</AppText>

        <AppButton bg='pink.600' onPress={toggleColorMode} width={240} pressedColor='pink.500'>
          change theme
        </AppButton>

        <AppButton
          bg='red.600'
          disabled={!!!mobileNetModel}
          isLoading={!!!mobileNetModel}
          onPress={() => navigation.navigate('main', { screen: 'mobilenet' })}
          width={240}
          pressedColor='red.500'
        >
          picture analyze
        </AppButton>

        <AppButton
          bg='red.600'
          disabled={!!!cameraPermission || !!!handPoseModel}
          isLoading={!!!handPoseModel}
          onPress={() => navigation.navigate('main', { screen: 'handpose' })}
          width={240}
          pressedColor='red.500'
        >
          handpose analyze
        </AppButton>

        <AppButton
          bg='red.600'
          disabled={!!!cocoSsdModel}
          isLoading={!!!cocoSsdModel}
          onPress={onToggle}
          width={240}
          pressedColor='red.500'
        >
          cocoSsd analyze
        </AppButton>
      </VStack>
      <VStack flex={1} justifyContent='flex-end' mb={4}>
        <LottieView source={require('../../assets/tensor.json')} autoPlay loop style={{ width: 200, height: 200 }} />
      </VStack>
      <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={onToggle}>
        <AlertDialog.Content>
          <AlertDialog.CloseButton onPress={onToggle} icon={<FontAwesome name='close' size={16} color='#ddd' />} />
          <AlertDialog.Header> Oppo !!</AlertDialog.Header>
          <AlertDialog.Body>{'Sorry This menu is preparing (> <)'}</AlertDialog.Body>
        </AlertDialog.Content>
      </AlertDialog>
    </Center>
  );
};
