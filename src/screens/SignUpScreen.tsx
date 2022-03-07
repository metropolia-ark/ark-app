import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button, Text } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';
import * as yup from 'yup';
import { Form, FormActions, FormButton, FormInput } from '../components';
import * as api from '../api';
import { Navigation } from '../types';
import { useAuth } from '../hooks';
import { toast } from '../utils';

interface SignUpFormValues {
  username: string;
  password: string;
  confirm: string;
  email: string;
  full_name: string;
}

const SignUpScreen = () => {
  const auth = useAuth();
  const { navigate } = useNavigation<Navigation.SignUp>();
  const { t } = useTranslation();

  // Sign up form initial values
  const signUpInitialValues: SignUpFormValues = { username: '', password: '', confirm: '', email: '', full_name: '' };

  // Sign up form validation schema
  const signUpSchema = yup.object().shape({
    username: yup.string().required(t('required.username')),
    email: yup.string().email(t('error.emailInvalid')).required(t('required.email')),
    password: yup.string().required(t('required.password')),
    confirm: yup.string()
      .oneOf([yup.ref('password'), null], t('error.passwordMatch'))
      .required(t('required.confirm')),
  });

  // Sign up form submit handler
  const signUpOnSubmit = async (values: SignUpFormValues, actions: FormActions<SignUpFormValues>) => {
    try {
      const { available } = await api.getUsername(values.username);
      if (!available) return actions.setFieldError('username', t('error.usernameInUse'));
      await api.signUp(values.username, values.password, values.email, values.full_name);
      const { token } = await api.signIn(values.username, values.password);
      await auth.signin(token);
    } catch (error) {
      console.error(error);
      toast.error(t('error.unexpectedPrimary'), t('error.unexpectedSecondary'));
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text category="h1" style={styles.text}>{t('signup.signUp')}</Text>
        <Form initialValues={signUpInitialValues} schema={signUpSchema} onSubmit={signUpOnSubmit}>
          <FormInput name="username" label={t('field.username')} />
          <FormInput name="full_name" label={t('field.fullname')} />
          <FormInput name="email" label={t('field.email')} />
          <FormInput name="password" label={t('field.password')} secureTextEntry />
          <FormInput name="confirm" label={t('field.confirm')} secureTextEntry />
          <FormButton>{t('signup.signUp')}</FormButton>
        </Form>
        <Text style={styles.text}>{t('signup.alreadyHaveAccount')}</Text>
        <Button appearance='ghost' onPress={() => navigate('SignIn')}>{t('signup.signInInstead')}</Button>
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
