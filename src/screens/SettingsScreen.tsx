import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text } from '@ui-kitten/components';
import { Formik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import { FormButton, FormInput } from '../components';

interface FormValues {
  email: string;
  username: string;
  password: string;
}

const SettingsScreen = () => {

  // Settings form initial values
  const initialValues: FormValues = { email: '', username: '', password: '' };

  // Settings form validation schema
  const schema = yup.object().shape({
    email: yup.string().required('The email address is required.').email('The email address is invalid.'),
    username: yup.string().required('The username is required.'),
    password: yup.string().required('The password is required.'),
  });

  // Settings form submit handler
  const onSubmit = async (values: FormValues, actions: FormikHelpers<FormValues>) => {
    console.log(values);
    await new Promise(resolve => setTimeout(resolve, 3000));
    actions.setFieldError('username', 'The username is in use already.');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text category="h6">Update profile</Text>
        <Formik initialValues={initialValues} validationSchema={schema} onSubmit={onSubmit}>
          <View>
            <FormInput name="username" label="New username" />
            <FormInput name="email" label="New email address" />
            <FormInput name="password" label="New password" secureTextEntry />
            <FormButton>Update</FormButton>
          </View>
        </Formik>
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
