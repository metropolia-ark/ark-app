import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';
import * as yup from 'yup';
import { Form, FormActions, FormButton, FormInput } from '../components';
import { Navigation } from '../types';
import { useAuth } from '../hooks/useAuth';
import * as api from '../api';

interface SignUpFormValues {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  full_name: string;
}

const SignUpScreen = () => {
  const auth = useAuth();
  const navigator = useNavigation<Navigation.SignUp>();

  // Sign up form initial values
  const signUpInitialValues: SignUpFormValues = {
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
  const signUpOnSubmit = async (values: SignUpFormValues, actions: FormActions<SignUpFormValues>) => {
    try {
      const { available } = await api.getUsername(values.username);
      if (!available) {
        actions.setFieldError('username', 'The username is in use already.');
      } else {
        await api.signUp(values.username, values.password, values.email, values.full_name);
        const { token, user } = await api.signIn(values.username, values.password);
        auth.signin(token, user);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text category="h1" style={styles.text}>Sign up</Text>
        <Form initialValues={signUpInitialValues} schema={signUpSchema} onSubmit={signUpOnSubmit}>
          <FormInput name="username" label="Username" />
          <FormInput name="full_name" label="Full name" />
          <FormInput name="email" label="Email" />
          <FormInput name="password" label="Password" secureTextEntry />
          <FormInput name="confirmPassword" label="Confirm Password" secureTextEntry />
          <FormButton>Sign up</FormButton>
        </Form>
        <Text style={styles.text}>Already have an account?</Text>
        <Button appearance='ghost' onPress={() => navigator.navigate('SignIn')}>Sign in</Button>
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
  text: {
    margin: 20,
    textAlign: 'center',
  },
});

export default SignUpScreen;
