import React from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Navigation } from '../types';

const SignUpScreen = () => {
  const { navigate } = useNavigation<Navigation.SignUp>();
  return (
    <View style={styles.container}>
      <Text>Sign up</Text>
      <TextInput style={styles.input} placeholder="User name"></TextInput>
      <TextInput style={styles.input} placeholder="Password" secureTextEntry={true}></TextInput>
      <TextInput style={styles.input} placeholder="Email"></TextInput>

      <Button title="Sign in instead" onPress={() => navigate('SignIn')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }, input: {
    height: 40,
    width: 120,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default SignUpScreen;
