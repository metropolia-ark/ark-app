import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Navigation } from '../types';

const SignInScreen = () => {
  const { navigate } = useNavigation<Navigation.SignIn>();
  return (
    <View style={styles.container}>
      <Text>Sign in</Text>
      <Button title="Sign up insead" onPress={() => navigate('SignUp')} />
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

export default SignInScreen;
