import React from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text } from '@ui-kitten/components';
import * as yup from 'yup';
import { Form, FormActions, FormButton, FormInput } from '../components';
import { useAuth, useUser } from '../hooks';
import * as api from '../api';

interface FormValues {
  email: string;
  username: string;
  password: string;
}

const SettingsScreen = () => {
  const auth = useAuth();
  const currentUser = useUser();

  // Settings form initial values
  const settingsInitialValues: FormValues = { email: currentUser.email, username: currentUser.username, password: '' };

  // Settings form validation schema
  const settingsSchema = yup.object().shape({
    email: yup.string().email('The email address is invalid.'),
    username: yup.string(),
    password: yup.string(),
  });

  // Settings form submit handler
  const settingsOnSubmit = async (values: FormValues, actions: FormActions<FormValues>) => {
    console.log(values);
    try {
      const { available } = await api.getUsername(values.username);
      if (!available) {
        actions.setFieldError('username', 'The username is in use already.');
      } else {
        await api.updateUser(values.username, values.password, values.email,);
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
