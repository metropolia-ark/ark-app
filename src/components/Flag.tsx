import React from 'react';
import { Image, ImageProps, ImageRequireSource } from 'react-native';

const flags: Record<string, ImageRequireSource> = {
  FI: require('../../assets/flags/FI.png'),
  HU: require('../../assets/flags/HU.png'),
  UA: require('../../assets/flags/UA.png'),
  UN: require('../../assets/flags/UN.png'),
};

interface FlagProps extends Omit<ImageProps, 'source'> {
  country: string;
}

const Flag = ({ country, ...props }: FlagProps) => (
  <Image {...props} source={flags[country]} />
);

export { Flag };
