import React from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Select, SelectItem, Text } from '@ui-kitten/components';
import * as yup from 'yup';
import { Form, FormActions, FormButton, FormInput } from '../components';
import { useAuth, useUser } from '../hooks';
import * as api from '../api';
import { useTranslation } from 'react-i18next';
import { availableLanguages } from '../translations/i18n';

interface FormValues {
  email: string;
  username: string;
  password: string;
}

const SettingsScreen = () => {
  const auth = useAuth();
  const currentUser = useUser();
  const { t, i18n } = useTranslation();

  // Settings form initial values
  const settingsInitialValues: FormValues = { email: currentUser.email, username: currentUser.username, password: '' };

  // Settings form validation schema
  const settingsSchema = yup.object().shape({
    email: yup.string().email(t('emailInvalid')),
    username: yup.string(),
    password: yup.string(),
  });

  // Settings form submit handler
  const settingsOnSubmit = async (values: FormValues, actions: FormActions<FormValues>) => {
    try {
      const { available } = await api.getUsername(values.username);
      if (!available) {
        actions.setFieldError('username', t('usernameIsAlreadyUse'));
      } else {
        await api.updateUser(values.username, values.password, values.email);
        Alert.alert(t('dataUpdate'));
        const { token, user } = await api.signIn(values.username, values.password);
        auth.signin(token, user);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const changeLanguage = async (index: any) => {
    const current = index.row;
    if (current === 0) {
      await i18n.changeLanguage('en');
    } else if (current === 1) {
      await i18n.changeLanguage('fi');
    } else if (current === 2) {
      await i18n.changeLanguage('ua');
    } else if (current === 3) {
      await i18n.changeLanguage('hu');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text category="h6">{t('updateProfile').toString()}</Text>
        <Form initialValues={settingsInitialValues} schema={settingsSchema} onSubmit={settingsOnSubmit}>
          <FormInput name="username" label={t('newUsername')} />
          <FormInput name="email" label={t('newEmail')} />
          <FormInput name="password" label={t('newPassword')} secureTextEntry />
          <FormButton>{t('update')}</FormButton>
        </Form>
        <Button appearance='ghost' onPress={() => auth.signout()}>{t('signOut').toString()}</Button>
        <Select value={i18n.language} onSelect={index => changeLanguage(index)}>
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
