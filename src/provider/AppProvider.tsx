import React, { useState, createContext, Dispatch, SetStateAction } from 'react';
import mobilenet from '@tensorflow-models/mobilenet';

type ContextProps = {
  model: mobilenet.MobileNet | null;
  setModel: Dispatch<SetStateAction<mobilenet.MobileNet | null>>;
};

export const AppContext = createContext<ContextProps>({} as ContextProps);

type Props = {
  children: React.ReactNode;
};
export const AppProvider: React.VFC<Props> = ({ children }: Props) => {
  const [model, setModel] = useState<mobilenet.MobileNet | null>(null);
  return <AppContext.Provider value={{ model, setModel }}>{children}</AppContext.Provider>;
};
