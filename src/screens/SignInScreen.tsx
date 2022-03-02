import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text, Button } from '@ui-kitten/components';
import * as yup from 'yup';
import { Form, FormButton, FormInput } from '../components';
import { Navigation } from '../types';
import { useAuth } from '../hooks/useAuth';
import * as api from '../api';

interface SignInFormValues {
  username: string;
  password: string;
}

const SignInScreen = () => {
  const auth = useAuth();
  const navigator = useNavigation<Navigation.SignIn>();

  // Sign in form initial values
  const signInInitialValues: SignInFormValues = { username: '', password: '' };

  // Sign in form validation schema
  const signInSchema = yup.object().shape({
    username: yup.string().required('The username is required.'),
    password: yup.string().required('The password is required.'),
  });

  // Sign in form submit handler
  const signInOnSubmit = async (values: SignInFormValues) => {
    try {
      const { token, user } = await api.signIn(values.username, values.password);
      auth.signin(token, user);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text category="h1" style={styles.text}>Sign in</Text>
        <Form initialValues={signInInitialValues} schema={signInSchema} onSubmit={signInOnSubmit}>
          <FormInput name="username" label="Username" />
          <FormInput name="password" label="Password" secureTextEntry />
          <FormButton>Sign in</FormButton>
        </Form>
        <Text style={styles.text}>Dont have account yet?</Text>
        <Button appearance='ghost' onPress={() => navigator.navigate('SignUp')}>Sign up</Button>
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

export default SignInScreen;
