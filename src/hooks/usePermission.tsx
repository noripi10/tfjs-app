import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { Camera, PermissionResponse } from 'expo-camera';
import Constants from 'expo-constants';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';

export const useCameraPermission = (): boolean | null => {
  const [permission, setPermission] = useState<boolean | null>(null);

  const loadingTensorFlow = async (): Promise<void> => {
    try {
      await tf.ready();
    } catch (error) {
      console.log('error');
    }
  };

  const permissionHandler = async () => {
    try {
      if (!Constants.isDevice) {
        throw new Error();
      }

      // initialize tensorflow
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      loadingTensorFlow();

      // camera permission
      const { status }: PermissionResponse = await Camera.getCameraPermissionsAsync();
      if (status === 'granted') {
        setPermission(true);
        return true;
      } else {
        const { status }: PermissionResponse = await Camera.requestCameraPermissionsAsync();
        if (status === 'granted') {
          setPermission(true);
          return true;
        }
      }
      setPermission(false);
      return false;
    } catch (error) {
      setPermission(false);
      Alert.alert('Permission Error', 'デバイスを確認してください');
    }
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    permissionHandler();
  }, []);

  return permission;
};
