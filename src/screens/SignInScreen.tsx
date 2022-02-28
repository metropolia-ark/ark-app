import React, { useEffect, useState } from 'react';
import {  StyleSheet, TextInput, View } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { Navigation } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, Button } from '@ui-kitten/components';
import { Form, FormButton, FormInput } from '../components';
import * as yup from 'yup';
import axios from 'axios';
import { signIn } from '../api/SignIn';

interface FormValues {
  username: string;
  password: string;
}

const REACT_APP_BASE_URL = 'https://media.mw.metropolia.fi/wbma/';

const SignInScreen = () => {

  // sign in form initial values
  const signInInitialValues: FormValues = { username: '', password: '' };

  // function that check is user already logged in
  const checkToken = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    console.log('token value in async storage', userToken);
    // TODO: allow authorization and navigate to "Home"
  };

  // function that will fetch user data and will add token to storage
  const loggedIn = async (values: FormValues) => {
    console.log('Submit button pressed');
    signIn(values.username, values.password);
    // TODO: allow authorization and navigate to "Home"
  };

  useEffect(() => {
    checkToken();
  }, []);

  // Settings form validation schema
  const signInSchema = yup.object().shape({
    username: yup.string().required('The username is required.'),
    password: yup.string().required('The password is required.'),
  });

  const { navigate } = useNavigation<Navigation.SignIn>();
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Sign in</Text>
      <Form initialValues={signInInitialValues} schema={signInSchema} onSubmit={loggedIn}>
        <FormInput name="username" label="Your login"  />
        <FormInput name="password" label="Your password" secureTextEntry />
        <FormButton>Submit</FormButton>
        <Text style={styles.text}>Dont have account yet?</Text>
        <Button onPress={() => navigate('SignUp')}>Sign up</Button>
      </Form>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 50,
    margin: 10,
  },
  text: {
    margin: 20,
    alignItems: 'center',
  },
});

export default SignInScreen;
