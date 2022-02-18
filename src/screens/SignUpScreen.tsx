import React from 'react';
import {  ScrollView, StyleSheet,  View } from 'react-native';
import { Button } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';
import { Navigation } from '../types';
import * as yup from 'yup';
import { Form, FormActions, FormButton, FormInput } from '../components';
import axios from 'axios';
import { baseUrl } from '../ultis/variables';
import { signUp } from '../Api/SignUp';

interface FormValues{
  username: string,
  password: string,
  confirmPassword: string,
  email: string,
  full_name: string,
}

const SignUpScreen = () => {
  const { navigate } = useNavigation<Navigation.SignUp>();

  // Sign up form initial values
  const signUpInitialValues: FormValues = {
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    full_name: '',
  };

  // Sign up form validation schema
  const signUpSchema = yup.object().shape({
    email: yup.string().required('The email address is required.').email('The email address is invalid.'),
    username: yup.string().required('The username is required.'),
    password: yup.string().required('The password is required.'),
    confirmPassword: yup.string()
      .oneOf([yup.ref('password'), null], 'Password must match')
      .required('Please confirm your password'),
  });

  // Sign up form submit handler
  const signUpOnSubmit = async (values: FormValues, actions: FormActions<FormValues>) => {
    // check the username if it exists it will not continue
    await axios.get(baseUrl + `/users/username/${values.username}`).then(response => {
      if (response.data.available === true){
        signUp(values.username, values.password, values.email, values.full_name);
        navigate('SignIn');
      } else {
        actions.setFieldError('username', 'The username is in use already.');
      }
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Form initialValues={signUpInitialValues} schema={signUpSchema} onSubmit={signUpOnSubmit}>
          <FormInput name="username" label="Username"/>
          <FormInput name="full_name" label="Full name"/>
          <FormInput name="email" label="Email"/>
          <FormInput name="password" label="Password" secureTextEntry/>
          <FormInput name="confirmPassword" label="Confirm Password" secureTextEntry/>
          <FormButton>Sign up</FormButton>
        </Form>
        <Button onPress={() => navigate('SignIn')}>Sign in instead</Button>
      </View>
    </ScrollView>
  );

};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flex: 1,
    padding: 32,
  },
});

export default SignUpScreen;
