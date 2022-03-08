import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Spinner as UIKittenSpinner, SpinnerProps } from '@ui-kitten/components';

const Spinner = ({ ...props }: SpinnerProps) => {
  return (
    <View style={styles.spinnerContainer}>
      <UIKittenSpinner {...props} />
    </View>
  );
};

const styles = StyleSheet.create({
  spinnerContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    padding: 32,
  },
});

export { Spinner };
