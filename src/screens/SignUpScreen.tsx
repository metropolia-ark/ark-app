import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Navigation } from '../types';

const SignUpScreen = () => {
  const { navigate } = useNavigation<Navigation.SignUp>();
  return (
    <View style={styles.container}>
      <Text>Sign up</Text>
      <Button title="Sign in instead" onPress={() => navigate('SignIn')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SignUpScreen;
