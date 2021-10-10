import React, { useState, createContext, Dispatch, SetStateAction } from 'react';
import mobilenet from '@tensorflow-models/mobilenet';
import handPose from '@tensorflow-models/handpose';
import cocoSsd from '@tensorflow-models/coco-ssd';

type ContextProps = {
  mobileNetModel: mobilenet.MobileNet | null;
  setMobileNetModel: Dispatch<SetStateAction<mobilenet.MobileNet | null>>;
  handPoseModel: handPose.HandPose | null;
  setHandPoseModel: Dispatch<SetStateAction<handPose.HandPose | null>>;
  cocoSsdModel: cocoSsd.ObjectDetection | null;
  setCocoSsdModel: Dispatch<SetStateAction<cocoSsd.ObjectDetection | null>>;
};

export const AppContext = createContext<ContextProps>({} as ContextProps);

type Props = {
  children: React.ReactNode;
};
export const AppProvider: React.VFC<Props> = ({ children }: Props) => {
  // tensorFlowのモデル群
  const [mobileNetModel, setMobileNetModel] = useState<mobilenet.MobileNet | null>(null);
  const [handPoseModel, setHandPoseModel] = useState<handPose.HandPose | null>(null);
  const [cocoSsdModel, setCocoSsdModel] = useState<cocoSsd.ObjectDetection | null>(null);
  return (
    <AppContext.Provider
      value={{ mobileNetModel, setMobileNetModel, handPoseModel, setHandPoseModel, cocoSsdModel, setCocoSsdModel }}
    >
      {children}
    </AppContext.Provider>
  );
};
