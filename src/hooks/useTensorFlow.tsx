import { useState, useEffect, useCallback, useMemo, useContext } from 'react';
import { Alert, Platform, Image } from 'react-native';
import { Camera, PermissionResponse } from 'expo-camera';
// import Constants from 'expo-constants';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import * as hondPose from '@tensorflow-models/handpose';
import { fetch, decodeJpeg } from '@tensorflow/tfjs-react-native';
import { Asset } from 'react-native-image-picker';
import { AppContext } from '../provider/AppProvider';
import { ExpoWebGLRenderingContext } from 'expo-gl';
// import '@tensorflow/tfjs-backend-webgl';

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
  handlePrediction: (image: any) => Promise<void>;
  predictioning: boolean;
  textureDimensions: { height: number; width: number };
  initialModel: () => Promise<{ mobileNetModel: mobilenet.MobileNet; handPoseModel: hondPose.HandPose }>;
};

export const useTensorFlow = (): Result => {
  const { mobileNetModel } = useContext(AppContext);

  const [loadedTensorflow, setLoadedTensorflow] = useState<boolean | null>(null);
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const [prediction, setPrediction] = useState<
    | {
        className: string;
        probability: number;
      }[]
    | null
  >(null);
  const [predictioning, setPredictioning] = useState(false);

  // modelはAppContextへ保存する（めちゃ遅いから起動時一発のみに抑える）
  // const [model, setModel] = useState<mobilenet.MobileNet | null>(null);

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

  // tensorFlow初期化
  const initialSetting = async () => {
    // tensorflow初期化
    await tf.ready();
    setLoadedTensorflow(true);
  };

  // 各モデルの初期化＋モデルを返却
  const initialModel = async () => {
    const mobileNetModel = await mobilenet.load();
    const handPoseModel = await hondPose.load();
    return { mobileNetModel, handPoseModel };
  };

  const handleCameraStream = useCallback(
    (
      images: IterableIterator<tf.Tensor3D>
      // updatePreview: () => void,
      // gl: ExpoWebGLRenderingContext,
      // cameraTexture: WebGLTexture
    ) => {
      hondPose.load().then((model) => {
        const loop = async () => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const nextImageTensor = images.next().value;
          console.info(nextImageTensor);
          const predictions = await model.estimateHands(nextImageTensor);
          console.log(predictions);
          //
          // do something with tensor here
          //
          // if autoRender is false you need the following two lines.
          // updatePreview();
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          // gl.endFrameEXP();

          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          requestAnimationFrame(loop);
        };
        void loop();
      });
    },
    []
  );

  const handlePrediction = useCallback(async (assets: Asset[]) => {
    try {
      if (!!!mobileNetModel) {
        throw new Error('モデルの初期化ができていません');
      }
      if (predictioning) {
        return;
      }
      setPredictioning(true);

      // 画像サイズを取得{width, height}
      // decodeできるサイズは4096x4096までみたい
      // const imageAssetsPath = Image.resolveAssetSource(image);
      // console.info({ imageAssetsPath });
      // byte arrayへ変換
      // const response = await fetch(require('../assets/**.jpg'), {}, { isBinary: true });
      // const response = await fetch(imageAssetsPath.uri, {}, { isBinary: true });

      const response = await fetch(assets[0].uri!, {}, { isBinary: true });
      const imageBuffer = await response.arrayBuffer();
      const imageData = new Uint8Array(imageBuffer);

      const imageTensor = decodeJpeg(imageData);
      if (mobileNetModel) {
        const prediction = await mobileNetModel.classify(imageTensor);
        console.info({ prediction });
        setPrediction(prediction);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    } finally {
      setPredictioning(false);
    }
  }, []);

  useEffect(() => {
    void permissionHandler();
    void initialSetting();
  }, []);

  return {
    cameraPermission,
    loadedTensorflow,
    handleCameraStream,
    prediction,
    handlePrediction,
    predictioning,
    textureDimensions,
    initialModel,
  };
};
