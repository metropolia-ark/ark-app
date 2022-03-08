import React, { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import LottieView from 'lottie-react-native';

const Spinner = () => {
  const animation = useRef<LottieView | null>();

  // Handle playing and hiding animation
  useEffect(() => {
    animation.current?.play();
    return () => animation.current?.reset();
  }, []);

  return (
    <View style={styles.spinnerContainer}>
      <LottieView
        ref={reference => animation.current = reference}
        style={styles.lottieSpinner}
        source={require('../../assets/animation/animal-care-loading.json')}
        loop
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
