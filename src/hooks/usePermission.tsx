import { useState, useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import { Camera, PermissionResponse } from 'expo-camera';
import Constants from 'expo-constants';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';

export const useCameraPermission = (): boolean | null => {
	const [permission, setPermission] = useState<boolean | null>(null);

	const permissionHandler = async () => {
		try {
			if (!Constants.isDevice) {
				throw new Error();
			}

			// initialize tensorflow
			(async () => {
				try {
					await tf.ready();
				} catch (error) {
					console.log('error');
				}
			})();

			// camera　permission
			const { status }: PermissionResponse =
				await Camera.getCameraPermissionsAsync();
			if (status === 'granted') {
				setPermission(true);
				return true;
			} else {
				const { status }: PermissionResponse =
					await Camera.requestCameraPermissionsAsync();
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
		permissionHandler();
	}, []);

	return permission;
};
