import React, { useState, createContext, Dispatch, SetStateAction } from 'react';
import mobilenet from '@tensorflow-models/mobilenet';

type ContextProps = {
  mobile: mobilenet.MobileNet | null;
  setMobile: Dispatch<SetStateAction<mobilenet.MobileNet | null>>;
};

export const AppContext = createContext<ContextProps>({} as ContextProps);

type Props = {
  children: React.ReactNode;
};
export const AppProvider: React.VFC<Props> = ({ children }: Props) => {
  const [mobile, setMobile] = useState<mobilenet.MobileNet | null>(null);
  return <AppContext.Provider value={{ mobile, setMobile }}>{children}</AppContext.Provider>;
};
