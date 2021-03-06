import React from 'react';
import { Button, Text } from 'native-base';
import { AppText } from './index';

type Props = {
  bg?: string;
  width?: number;
  height?: number;
  onPress: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  pressedColor?: string;
  children: string;
};

const AppButton: React.VFC<Props> = ({
  bg = 'primary.400',
  width = 175,
  height = 36,
  onPress,
  disabled = false,
  isLoading = false,
  pressedColor,
  children = 'orange.300',
}: Props) => {
  return (
    <Button
      bg={bg}
      width={width}
      height={height}
      onPress={onPress}
      disabled={disabled}
      isLoading={isLoading}
      borderRadius={999}
      alignItems='center'
      py={0}
      m={2}
      style={{
        shadowColor: '#3b3b3b',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 3,
        shadowRadius: 4,
      }}
      _pressed={{ backgroundColor: pressedColor }}
    >
      <AppText>{children}</AppText>
    </Button>
  );
};

export default AppButton;
