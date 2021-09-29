import React from 'react';
import { Text } from 'native-base';

type Props = {
  children: string;
  fontSize?: number;
  textAlign?: 'left' | 'center' | 'right';
  pr?: number;
};

const AppText: React.VFC<Props> = ({ children, fontSize = 16, textAlign = 'left', pr = 0 }) => (
  <Text fontFamily='PatrickHand-Regular' {...{ fontSize, textAlign, pr }}>
    {children}
  </Text>
);

export default AppText;
