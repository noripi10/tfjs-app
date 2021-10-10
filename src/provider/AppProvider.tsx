import React, { useState, createContext, Dispatch, SetStateAction } from 'react';
import mobilenet from '@tensorflow-models/mobilenet';
import handPose from '@tensorflow-models/handpose';

type ContextProps = {
  mobileNetModel: mobilenet.MobileNet | null;
  setMobileNetModel: Dispatch<SetStateAction<mobilenet.MobileNet | null>>;
  handPoseModel: handPose.HandPose | null;
  setHandPoseModel: Dispatch<SetStateAction<handPose.HandPose | null>>;
};

export const AppContext = createContext<ContextProps>({} as ContextProps);

type Props = {
  children: React.ReactNode;
};
export const AppProvider: React.VFC<Props> = ({ children }: Props) => {
  // drawer navigation のコントロール
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  // tensorFlowのモデル群
  const [mobileNetModel, setMobileNetModel] = useState<mobilenet.MobileNet | null>(null);
  const [handPoseModel, setHandPoseModel] = useState<handPose.HandPose | null>(null);
  return (
    <AppContext.Provider value={{ mobileNetModel, setMobileNetModel, handPoseModel, setHandPoseModel }}>
      {children}
    </AppContext.Provider>
  );
};
