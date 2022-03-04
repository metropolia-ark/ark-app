import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, IndexPath, Select, SelectItem, Text } from '@ui-kitten/components';
import * as yup from 'yup';
import { Form, FormActions, FormButton, FormInput } from '../components';
import { useAuth } from '../hooks';
import { useTranslation } from 'react-i18next';
import { availableLanguages } from '../translations/i18n';

interface FormValues {
  email: string;
  username: string;
  password: string;
}

const SettingsScreen = () => {
  const auth = useAuth();
  const {
    t,
    i18n,
  } = useTranslation();

  // Settings form initial values
  const settingsInitialValues: FormValues = {
    email: '',
    username: '',
    password: '',
  };

  // Settings form validation schema
  const settingsSchema = yup.object().shape({
    email: yup.string().email(t('emailInvalid')),
    username: yup.string(),
    password: yup.string(),
  });

  // Settings form submit handler
  const settingsOnSubmit = async (values: FormValues, actions: FormActions<FormValues>) => {
    console.log(values);
    await new Promise(resolve => setTimeout(resolve, 3000));
    actions.setFieldError('username', 'The username is in use already.');
  };
  const changeLanguage = (e: any) => {
    const current:number = e.row;
    if (current === 0){
      i18n.changeLanguage('en');
    } else if (current === 1){
      i18n.changeLanguage('fi');
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
        <Select value={i18n.language} onSelect={e => changeLanguage(e)}>
          {availableLanguages.map(language => (
            <SelectItem key={language} title={language}/>
          ))}
        </Select>
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
