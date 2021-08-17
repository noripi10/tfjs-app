import { Camera } from 'expo-camera';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { Platform, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import * as tf from '@tensorflow/tfjs';
import { cameraWithTensors } from '@tensorflow/tfjs-react-native';

import { useCameraPermission } from './src/hooks/usePermission';

const TensorCamera = cameraWithTensors(Camera);

type TextureProps = { height: number; width: number };

export default function App() {
	const cameraPermission = useCameraPermission();

	let textureDims = {} as TextureProps;
	if (Platform.OS === 'ios') {
		textureDims = {
			...textureDims,
			height: 1920,
			width: 1080,
		};
	} else {
		textureDims = {
			height: 1200,
			width: 1600,
		};
	}

	const handleCameraStream = (
		images: IterableIterator<tf.Tensor3D>
		// updatePreview: () => void,
		// gl: WebGLTexture
	) => {
		const loop = async () => {
			const nextImageTensor = images.next().value;

			//
			// do something with tensor here
			//

			// if autorender is false you need the following two lines.
			// updatePreview();
			// gl.endFrameEXP();

			requestAnimationFrame(loop);
		};
		loop();
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.statusContainer}>
				{cameraPermission === null ? (
					<Text>camera & tensorflow 設定中</Text>
				) : cameraPermission === false ? (
					<Text>camera & tensorflow 使用不可</Text>
				) : (
					<Text>camera & tensorflow 設定完了</Text>
				)}
			</View>
			<View style={styles.cameraContainer}>
				<TensorCamera
					style={styles.camera}
					type={Camera.Constants.Type.front}
					cameraTextureHeight={textureDims.height}
					cameraTextureWidth={textureDims.width}
					resizeHeight={200}
					resizeWidth={152}
					resizeDepth={3}
					onReady={handleCameraStream}
					autorender={true}
				/>
			</View>
			<StatusBar style="auto" />
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	statusContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'red',
	},
	cameraContainer: {
		flex: 4,
		justifyContent: 'center',
		alignContent: 'center',
		backgroundColor: 'blue',
	},
	camera: {
		justifyContent: 'flex-start',
		backgroundColor: 'blue',
	},
});
