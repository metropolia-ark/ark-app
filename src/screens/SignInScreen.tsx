import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text, Button } from '@ui-kitten/components';
import * as yup from 'yup';
import { Form, FormButton, FormInput } from '../components';
import { Navigation } from '../types';
import { useAuth } from '../hooks';
import * as api from '../api';
import { useTranslation } from 'react-i18next';

interface SignInFormValues {
  username: string;
  password: string;
}

const SignInScreen = () => {
  const auth = useAuth();
  const navigator = useNavigation<Navigation.SignIn>();
  const { t } = useTranslation();

  // Sign in form initial values
  const signInInitialValues: SignInFormValues = { username: '', password: '' };

  // Sign in form validation schema
  const signInSchema = yup.object().shape({
    username: yup.string().required(t('errorUsername')),
    password: yup.string().required(t('errorPassword')),
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
        <Text category="h1" style={styles.text}>{t('signIn').toString()}</Text>
        <Form initialValues={signInInitialValues} schema={signInSchema} onSubmit={signInOnSubmit}>
          <FormInput name="username" label={t('username')} />
          <FormInput name="password" label={t('password').toString()} secureTextEntry />
          <FormButton>{t('signIn').toString()}</FormButton>
        </Form>
        <Text style={styles.text}>{t('noAccount').toString()}</Text>
        <Button appearance='ghost' onPress={() => navigator.navigate('SignUp')}>{t('signUp').toString()}</Button>
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
