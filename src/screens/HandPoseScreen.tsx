import React, { useCallback, useContext, useEffect, useState, useRef, useLayoutEffect } from 'react';
import { useWindowDimensions } from 'react-native';
import { Box, Text, IconButton, Center } from 'native-base';
import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
// import Svg, { Circle } from 'react-native-svg';
import Constants from 'expo-constants';
import { Camera, CameraProps } from 'expo-camera';
import { CameraType } from 'expo-camera/build/Camera.types';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../navigation/StackNavigator';
import { RouteProp } from '@react-navigation/core';

import * as tf from '@tensorflow/tfjs';
import { cameraWithTensors } from '@tensorflow/tfjs-react-native';
import { Coords3D } from '@tensorflow-models/handpose/dist/pipeline';

import { useTensorFlow } from '../hooks/useTensorFlow';
import { StyleSheet } from 'react-native';
import { AppContext } from '../provider/AppProvider';
import { AppText } from '../components';

const TensorCamera = cameraWithTensors<CameraProps>(Camera);

type Props = {
  navigation: StackNavigationProp<StackParamList, 'handpose'>;
  route: RouteProp<StackParamList, 'handpose'>;
};

// const fingerJoints = {
//   thumb: [0, 1, 2, 3, 4],
//   indexFinger: [0, 5, 6, 7, 8],
//   middleFinger: [0, 9, 10, 11, 12],
//   ringFinger: [0, 13, 14, 15, 16],
//   pinky: [0, 17, 18, 19, 20],
// };
// const fingerColor = [
//   [...Array(5).keys()].map((num) => ({ num, color: 'primary.400' })),
//   [...Array(5).keys()].map((num) => ({ num, color: 'primary.400' })),
//   [...Array(5).keys()].map((num) => ({ num, color: 'primary.400' })),
//   [...Array(5).keys()].map((num) => ({ num, color: 'primary.400' })),
//   [...Array(5).keys()].map((num) => ({ num, color: 'primary.400' })),
// ];

export const HandPoseScreen: React.VFC<Props> = ({ navigation }: Props) => {
  const { handPoseModel } = useContext(AppContext);
  const { textureDimensions } = useTensorFlow();
  const [cameraDirection, setCameraDirection] = useState<CameraType>(Camera.Constants.Type.front);

  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  const [canRender, setCanRender] = useState(false);
  const [landmarks, setLandmarks] = useState<Coords3D | null>();
  const [handBox, setHandBox] = useState<{
    topLeft: [number, number];
    bottomRight: [number, number];
    boxHeight: number;
    boxWidth: number;
  } | null>();
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
          // const prediction = predictions[0];
          // const {
          //   boundingBox: { topLeft, bottomRight },
          // } = prediction;

          // const boxHeight = bottomRight[0] - topLeft[0];
          // const boxWidth = bottomRight[1] - topLeft[1];
          // setHandBox({ topLeft, bottomRight, boxHeight, boxWidth });

          // ランドマークの設定はここをコメントアウト
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
          // console.log('no hand (> <)');
          // setHandBox(null);

          // ランドマークの設定はここをコメントアウト
          setLandmarks(null);
          // if (landmarks && landmarks.length) {
          //   setLandmarks([] as Coords3D);
          // }
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

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'tensoflow ★handpose★',
    });
  }, []);

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
            type={cameraDirection}
            cameraTextureHeight={textureDimensions.height}
            cameraTextureWidth={textureDimensions.width}
            resizeHeight={400}
            resizeWidth={300}
            resizeDepth={3}
            onReady={handleCameraStream}
            autorender={canRender}
            zoom={0}
          />
          <Box position='absolute' top={30} right={15} zIndex={10} justifyContent='center' alignItems='center'>
            <>
              <IconButton
                variant='ghost'
                icon={
                  <MaterialCommunityIcons
                    name={cameraDirection === Camera.Constants.Type.back ? 'camera-front' : 'camera-rear-variant'}
                    color='white'
                    size={32}
                    onPress={() =>
                      setCameraDirection((prev) =>
                        prev === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back
                      )
                    }
                  />
                }
              />
              <AppText fontSize={10}>{cameraDirection === Camera.Constants.Type.back ? 'front→' : 'back→'}</AppText>
            </>
          </Box>

          {/* svg api で描画 */}
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

          {/* ✋のランドマークを点で描画 */}
          {landmarks?.length
            ? landmarks.map((landmark, index) => (
                <Box
                  bgColor={
                    index <= 4
                      ? 'primary.400'
                      : index <= 8
                      ? 'secondary.400'
                      : index <= 12
                      ? 'tertiary.400'
                      : index <= 16
                      ? 'violet.400'
                      : 'blue.400'
                  }
                  key={`handmark-${index.toString()}`}
                  position='absolute'
                  top={landmark[1]}
                  left={landmark[0]}
                  width={3}
                  height={3}
                  borderRadius={100}
                  borderColor={'#000'}
                  borderWidth={StyleSheet.hairlineWidth}
                  zIndex={999}
                />
              ))
            : null}

          {/* ✋の位置をボックス描画 */}
          {/* <Box
            position='absolute'
            top={handBox?.topLeft[1]}
            left={handBox?.topLeft[1]}
            height={handBox?.boxHeight}
            width={handBox?.boxWidth}
            borderWidth={2}
            borderColor='red.800'
            zIndex={100}
          /> */}

          {/* <Box
            flex={1}
            flexDirection='column'
            justifyContent='center'
            alignItems='center'
            position='absolute'
            top={0}
            left={0}
            width='100%'
            height='100%'
            zIndex={999}
          >
            <FontAwesome name='hand-grab-o' size={64} color='#fbbf24' />
            <FontAwesome name='hand-peace-o' size={64} color='#fbbf24' />
            <FontAwesome name='hand-paper-o' size={64} color='#fbbf24' />
          </Box> */}
        </>
      ) : (
        <Center height='50%'>
          <Text>camera can't use. only real device</Text>
        </Center>
      )}
    </Box>
  );
};

const styles = StyleSheet.create({
  camera: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    zIndex: -1,
  },
});
