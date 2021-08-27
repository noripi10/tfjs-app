import { useState, useEffect, useCallback } from 'react';
import { Alert, Platform, Image } from 'react-native';
import { Camera, PermissionResponse } from 'expo-camera';
// import Constants from 'expo-constants';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import { fetch, decodeJpeg } from '@tensorflow/tfjs-react-native';
import '@tensorflow/tfjs-backend-webgl';
import { useMemo } from 'react';

type TextureProps = { height: number; width: number };

type Result = {
  cameraPermission: boolean | null;
  loadedTensorflow: boolean | null;
  handleCameraStream: (image: IterableIterator<tf.Tensor3D>) => void;
  prediction:
    | {
        className: string;
        probability: number;
      }[]
    | null;
  handlePrediction: () => Promise<void>;
  textureDimensions: { height: number; width: number };
};

export const useTensorFlow = (): Result => {
  const [loadedTensorflow, setLoadedTensorflow] = useState<boolean | null>(null);
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const [prediction, setPrediction] = useState<
    | {
        className: string;
        probability: number;
      }[]
    | null
  >(null);

  const textureDimensions = useMemo(() => {
    let texture = {} as TextureProps;
    if (Platform.OS === 'ios') {
      texture = {
        height: 1920,
        width: 1080,
      };
    } else {
      texture = {
        height: 1200,
        width: 1600,
      };
    }

    return texture;
  }, []);

  // camera permission
  const permissionHandler = async () => {
    try {
      // if (!Constants.isDevice) {
      //   throw new Error();
      // }
      const { status: getStatus }: PermissionResponse = await Camera.getCameraPermissionsAsync();
      if (getStatus === 'granted') {
        setCameraPermission(true);
        return true;
      } else {
        const { status: requestStatus }: PermissionResponse = await Camera.requestCameraPermissionsAsync();
        if (requestStatus === 'granted') {
          setCameraPermission(true);
          return true;
        }
      }
      setCameraPermission(false);
      return false;
    } catch (error) {
      console.warn(error);
      setCameraPermission(false);
      Alert.alert('Permission Error', 'デバイスを確認してください');
    }
  };

  // tensorFlow init
  const initialSetting = async () => {
    // tensorflow初期化
    await tf.ready();

    setLoadedTensorflow(true);
  };

  const handleCameraStream = (
    images: IterableIterator<tf.Tensor3D>
    // updatePreview: () => void,
    // gl: ExpoWebGLRenderingContext,
    // cameraTexture: WebGLTexture
  ) => {
    const loop = async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const nextImageTensor = images.next().value;
      console.info(nextImageTensor);

      //
      // do something with tensor here
      //

      // if autoRender is false you need the following two lines.
      // updatePreview();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      // gl.endFrameEXP();
      const log = await new Promise((resolve) => {
        setTimeout(() => resolve('ok'), [0]);
      });
      console.info(log);

      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      requestAnimationFrame(loop);
    };
    void loop();
  };

  const handlePrediction = useCallback(async () => {
    // decodeできるサイズは4096x4096まで
    const model = await mobilenet.load();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const image = require('../../assets/soccer.jpg/');

    // 画像サイズを取得{width, height}
    const imageAssetsPath = Image.resolveAssetSource(image);

    console.info({ imageAssetsPath });

    // byte arrayへ変換
    const response = await fetch(imageAssetsPath.uri, {}, { isBinary: true });
    const imageBuffer = await response.arrayBuffer();
    const imageData = new Uint8Array(imageBuffer);

    const imageTensor = decodeJpeg(imageData);
    const prediction = await model.classify(imageTensor);
    console.info({ prediction });
    setPrediction(prediction);
  }, []);

  useEffect(() => {
    void permissionHandler();
    void initialSetting();
  }, []);

  return { cameraPermission, loadedTensorflow, handleCameraStream, prediction, handlePrediction, textureDimensions };
};
