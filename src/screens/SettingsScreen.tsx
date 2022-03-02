import React from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text } from '@ui-kitten/components';
import * as yup from 'yup';
import { Form, FormActions, FormButton, FormInput } from '../components';
import { useAuth } from '../hooks';
import * as api from '../api';

interface FormValues {
  email: string;
  username: string;
  password: string;
  full_name: string,
}

const SettingsScreen = () => {
  const auth = useAuth();

  // Settings form initial values
  const settingsInitialValues: FormValues = { email: '', username: '', password: '', full_name: '' };

  // Settings form validation schema
  const settingsSchema = yup.object().shape({
    email: yup.string().email('The email address is invalid.'),
    username: yup.string().required('The username is required.'),
    password: yup.string().required('The password is required.'),
  });

  // Settings form submit handler
  const settingsOnSubmit = async (values: FormValues, actions: FormActions<FormValues>) => {
    console.log(values);
    /* await new Promise(resolve => setTimeout(resolve, 3000));
    actions.setFieldError('username', 'The username is in use already.'); */
    try {
      const { available } = await api.getUsername(values.username);
      if (!available) {
        actions.setFieldError('username', 'The username is in use already.');
      } else {
        await api.signUp(values.username, values.password, values.email, values.full_name);
        Alert.alert('User data updated');
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
        <Text category="h6">Update profile</Text>
        <Form initialValues={settingsInitialValues} schema={settingsSchema} onSubmit={settingsOnSubmit}>
          <FormInput name="username" label="New username" />
          <FormInput name="email" label="New email address" />
          <FormInput name="password" label="New password" secureTextEntry />
          <FormButton>Update</FormButton>
        </Form>
        <Button appearance='ghost' onPress={() => auth.signout()}>Sign out</Button>
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

export default SettingsScreen;
