import React from 'react';
import { StyleSheet, View } from 'react-native';
import LottieView from 'lottie-react-native';

const Spinner = () => {
  return (
    <View style={styles.spinnerContainer}>
      <LottieView
        style={styles.lottieSpinner}
        source={require('../../assets/animation/animal-care-loading.json')}
        autoPlay={true}
        loop={true}
        speed={6}
      />
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
  lottieSpinner: {
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export { Spinner };
