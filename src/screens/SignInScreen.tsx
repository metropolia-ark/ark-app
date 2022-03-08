import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { Text, Button } from '@ui-kitten/components';
import * as yup from 'yup';
import { Form, FormButton, FormInput } from '../components';
import * as api from '../api';
import { Navigation } from '../types';
import { useAuth } from '../hooks';
import { toast } from '../utils';

interface SignInFormValues {
  username: string;
  password: string;
}

const SignInScreen = () => {
  const auth = useAuth();
  const { navigate } = useNavigation<Navigation.SignIn>();
  const { t } = useTranslation();

  // Sign in form initial values
  const signInInitialValues: SignInFormValues = { username: '', password: '' };

  // Sign in form validation schema
  const signInSchema = yup.object().shape({
    username: yup.string().required(t('required.username')),
    password: yup.string().required(t('required.password')),
  });

  // Sign in form submit handler
  const signInOnSubmit = async (values: SignInFormValues) => {
    try {
      const { token } = await api.signIn(values.username, values.password);
      await auth.signin(token);
    } catch (error) {
      if (error?.response?.status === 401) {
        toast.error(t('error.invalidCredentials'));
      } else {
        console.error(error);
        toast.error(t('error.unexpectedPrimary'), t('error.unexpectedSecondary'));
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text category="h1" style={styles.text}>{t('signin.signIn')}</Text>
        <Form initialValues={signInInitialValues} schema={signInSchema} onSubmit={signInOnSubmit}>
          <FormInput name="username" label={t('field.username')} />
          <FormInput name="password" label={t('field.password')} secureTextEntry />
          <FormButton>{t('signin.signIn')}</FormButton>
        </Form>
        <Text style={styles.text}>{t('signin.noAccountYet')}</Text>
        <Button appearance='ghost' onPress={() => navigate('SignUp')}>{t('signin.signUpInstead')}</Button>
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
