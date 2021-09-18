import React, { useCallback, useContext, useEffect, useState, useRef } from 'react';
import { useWindowDimensions } from 'react-native';
import { Box, Text, Button } from 'native-base';
import Svg, { Circle } from 'react-native-svg';
import Constants from 'expo-constants';
import { Camera, CameraProps } from 'expo-camera';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../navigation/StackNavigator';
import { RouteProp } from '@react-navigation/core';

import * as tf from '@tensorflow/tfjs';
import { cameraWithTensors } from '@tensorflow/tfjs-react-native';
import { Coords3D } from '@tensorflow-models/handpose/dist/pipeline';

import { useTensorFlow } from '../hooks/useTensorFlow';
import { StyleSheet } from 'react-native';
import { AppContext } from '../provider/AppProvider';

const TensorCamera = cameraWithTensors<CameraProps>(Camera);

type Props = {
  navigation: StackNavigationProp<StackParamList, 'handpose'>;
  route: RouteProp<StackParamList, 'handpose'>;
};

const fingerJoints = {
  thumb: [0, 1, 2, 3, 4],
  indexFinger: [0, 5, 6, 7, 8],
  middleFinger: [0, 9, 10, 11, 12],
  ringFinger: [0, 13, 14, 15, 16],
  pinky: [0, 17, 18, 19, 20],
};

export const HandPoseScreen: React.VFC<Props> = ({ navigation }: Props) => {
  const { handPoseModel } = useContext(AppContext);
  const { textureDimensions } = useTensorFlow();

  const { width, height } = useWindowDimensions();

  const [canRender, setCanRender] = useState(false);
  const [landmarks, setLandmarks] = useState<Coords3D>();
  const timerRef = useRef<NodeJS.Timer>();
  const animatioRef = useRef<number | null>(null);

  const handleCameraStream = useCallback(
    (
      images: IterableIterator<tf.Tensor3D>
      // updatePreview: () => void,
      // gl: ExpoWebGLRenderingContext,
      // cameraTexture: WebGLTexture
    ) => {
      const loop = async () => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const nextImageTensor = images.next().value;
        //
        // do something with tensor here
        //
        const predictions = await handPoseModel!.estimateHands(nextImageTensor);
        if (predictions.length) {
          // console.log('exist hand (^ ^)!!! prediction:' + predictions.length);
          predictions.forEach(({ landmarks }) => {
            // for (let j = 0; Object.keys(fingerJoints).length; j++) {
            //   const finger = Object.keys(fingerJoints)[j];
            //   for (let k = 0; k < fingerJoints[finger].length - 1; k++) {
            //     const firstJointIndex = fingerJoints[finger][k];
            //     const secondJointIndex = fingerJoints[finger][k + 1];
            //     console.log({ firstJointIndex });
            //     console.log({ secondJointIndex });
            //   }
            // }
            setLandmarks(landmarks);
            // if (animatioRef.current) cancelAnimationFrame(animatioRef.current);
            // if (timerRef.current) clearInterval(timerRef.current);
            // console.log(landmarks);
          });

          // console.log(predictions[0].landmarks);
        } else {
          console.log('no hand (> <)');
          if (landmarks && landmarks.length) {
            setLandmarks([] as Coords3D);
          }
        }
        // if autoRender is false you need the following two lines.
        // updatePreview();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        // gl.endFrameEXP();

        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        animatioRef.current = requestAnimationFrame(loop);

        // if (timerRef.current) clearInterval(timerRef.current);
        // timerRef.current = setInterval(loop, 1000);
      };
      void loop();
    },
    []
  );

  useEffect(() => {
    setCanRender(true);

    return () => {
      if (animatioRef.current) {
        cancelAnimationFrame(animatioRef.current);
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setCanRender(false);
    };
  }, []);

  return (
    <Box flex={1}>
      {Constants.isDevice ? (
        <>
          <TensorCamera
            style={styles.camera}
            type={Camera.Constants.Type.back}
            cameraTextureHeight={textureDimensions.height}
            cameraTextureWidth={textureDimensions.width}
            resizeHeight={400}
            resizeWidth={304}
            resizeDepth={3}
            onReady={handleCameraStream}
            autorender={canRender}
          />
          {/* <Svg height='100%' width='100%'>
            {landmarks &&
              landmarks.map((landmark, index) => (
                <Circle
                  key={`handmark-${index.toString()}`}
                  cx={landmark[0]}
                  cy={landmark[1]}
                  r={3}
                  stroke='#000'
                  strokeWidth='1'
                  fill='#3399ff'
                />
              ))}
          </Svg> */}
          {landmarks?.length
            ? landmarks.map((landmark, index) => (
                <Box
                  bgColor={'#0c7a5b'}
                  key={`handmark-${index.toString()}`}
                  position='absolute'
                  top={landmark[1]}
                  left={landmark[0]}
                  width={3}
                  height={3}
                  borderRadius={999}
                  borderColor={'#000'}
                  borderWidth={StyleSheet.hairlineWidth}
                  zIndex={999}
                />
              ))
            : null}
        </>
      ) : (
        // <Camera style={styles.camera}>
        //   <Button bgColor='green.800' width={100} height={100} borderRadius={999}>
        //     撮影
        //   </Button>
        // </Camera>
        <Text>camera can't use. only real device</Text>
      )}
    </Box>
  );
};

const styles = StyleSheet.create({
  camera: {
    flex: 1,
    zIndex: -1,
  },
});
