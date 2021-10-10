import React, { VFC } from 'react';
import { Box, Stack, Text, Heading, Link, VStack, Pressable, HStack } from 'native-base';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { DrawerParamList } from '../navigation/DrawerNavigation';

type Props = {
  navigation: DrawerNavigationProp<DrawerParamList, 'description'>;
};

export const DescriptionScreen: VFC<Props> = ({ navigation }: Props) => {
  return (
    <VStack flex={1} safeArea>
      <HStack pl={4} alignItems='center'>
        <Pressable onPress={() => navigation.openDrawer()}>
          <Text>←</Text>
        </Pressable>
        <Heading p={4} fontFamily='PatrickHand-Regular'>
          What's TensorFlow ?
        </Heading>
      </HStack>
      <VStack flexGrow={1}>
        <Text p={3} fontFamily='PatrickHand-Regular' fontSize={18}>
          Wikipedia
        </Text>
        <Text p={3} fontFamily='PatrickHand-Regular'>
          {
            'Googleが開発しオープンソースで公開している、機械学習に用いるためのソフトウェアライブラリである。 英語の発音のまま読んだ場合はテンサーフローだが、数学用語のtensorはテンソルと読むのでどちらの読み方もあっていると言える。'
          }
        </Text>
      </VStack>
      <Link
        p={3}
        href='https://ja.wikipedia.org/wiki/TensorFlow'
        _text={{ textAlign: 'right', fontFamily: 'PatrickHand-Regular' }}
      >
        https://ja.wikipedia.org/wiki/TensorFlow
      </Link>
    </VStack>
  );
};
