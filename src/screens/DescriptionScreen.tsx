import React from 'react';
import { Box, Stack, Text, Heading, Link, Center, VStack } from 'native-base';

export const DescriptionScreen = () => {
  return (
    <VStack flex={1} justifyContent='flex-start' alignItems='center'>
      <Box flex={1} safeArea>
        <Heading p={4} fontFamily='PatrickHand-Regular'>
          What's TensorFlow ?
        </Heading>
        <VStack flex={1} flexGrow={1}>
          <Text p={3} fontFamily='PatrickHand-Regular'>
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
      </Box>
    </VStack>
  );
};
