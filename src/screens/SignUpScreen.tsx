import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';
import * as yup from 'yup';
import { Form, FormActions, FormButton, FormInput } from '../components';
import { Navigation } from '../types';
import { useAuth } from '../hooks';
import * as api from '../api';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

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
    email: yup.string().required(t('errorEmail')).email(t('emailInvalid')),
    username: yup.string().required(t('errorUsername')),
    password: yup.string().required(t('errorPassword')),
    confirmPassword: yup.string()
      .oneOf([yup.ref('password'), null], t('passwordMatch'))
      .required(t('errorConfirmPassword')),
  });

  // Sign up form submit handler
  const signUpOnSubmit = async (values: SignUpFormValues, actions: FormActions<SignUpFormValues>) => {
    try {
      const { available } = await api.getUsername(values.username);
      if (!available) {
        actions.setFieldError('username', t('usernameIsAlreadyUse'));
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
        <Text category="h1" style={styles.text}>{t('signUp').toString()}</Text>
        <Form initialValues={signUpInitialValues} schema={signUpSchema} onSubmit={signUpOnSubmit}>
          <FormInput name="username" label={t('username')} />
          <FormInput name="full_name" label={t('fullName')} />
          <FormInput name="email" label={t('email')} />
          <FormInput name="password" label={t('password')} secureTextEntry />
          <FormInput name="confirmPassword" label={t('confirmPassword')} secureTextEntry />
          <FormButton>{t('signUpOtherTerm').toString()}</FormButton>
        </Form>
        <Text style={styles.text}>{t('alreadyHaveAccount').toString()}</Text>
        <Button appearance='ghost' onPress={() => navigator.navigate('SignIn')}>{t('signIn').toString()}</Button>
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
