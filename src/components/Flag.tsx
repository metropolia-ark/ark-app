import React from 'react';
import { Image, ImageRequireSource, StyleSheet } from 'react-native';

const flags: Record<string, ImageRequireSource> = {
  FI: require('../../assets/flags/FI.png'),
  HU: require('../../assets/flags/HU.png'),
  UA: require('../../assets/flags/UA.png'),
  UN: require('../../assets/flags/UN.png'),
};

interface FlagProps {
  country: string;
}

const Flag = ({ country }: FlagProps) => (
  <Image source={flags[country]} style={styles.flag} />
);

const styles = StyleSheet.create({
  flag: {
    width: 24,
    height: 24,
  },
});

export { Flag };
