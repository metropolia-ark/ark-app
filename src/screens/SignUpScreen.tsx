import React, { useState } from 'react';
import {  Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Navigation } from '../types';
import { signUp } from '../Api/SignUp';

const SignUpScreen = () => {
  const { navigate } = useNavigation<Navigation.SignUp>();
  const [state, setState] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    full_name: '',
  });

  const validation = (
    username: string,
    password: string,
    confirmPassword: string,
    email: string,
    fullname?: string,
  ) => {
    if (password == confirmPassword && password != ''){
      console.log('succes');
      signUp(username, password, email, fullname);
      navigate('SignIn');
    } else {
      console.log('failed');
    }

  };

  return (
    <View style={styles.container}>
      <Text>Sign up</Text>
      <TextInput
        style={styles.input}
        placeholder="User name"
        onChangeText={value => setState({ ...state, username: value })}/>
      <TextInput
        style={styles.input}
        placeholder={'Full Name'}
        onChangeText={value => setState({ ...state, full_name: value })}/>
      <TextInput
        style={styles.input}
        placeholder={'Email'}
        onChangeText={value => setState({ ...state, email: value })}/>
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        onChangeText={value => setState({ ...state, password: value })}/>
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry={true}
        onChangeText={value => setState({ ...state, confirmPassword: value })}/>
      <Button
        title="Sign up"
        onPress={() => validation(
          state.username,
          state.password,
          state.confirmPassword,
          state.email,
          state.full_name,
        ) } />
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
