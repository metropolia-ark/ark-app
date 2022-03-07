import React from 'react';
import { Alert, Image, ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button, IndexPath, Select, SelectItem, Text } from '@ui-kitten/components';
import * as yup from 'yup';
import { Flag, Form, FormActions, FormButton, FormInput } from '../components';
import { useAuth, useUser } from '../hooks';
import * as api from '../api';
import { availableLanguages, avatarTag, mediaUrl } from '../utils';

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

    }
  };

  // Change the language of the app
  const changeLanguage = async (index: IndexPath) => {
    await i18n.changeLanguage(Object.keys(availableLanguages)[index.row]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Update profile</Text>
        <Form initialValues={settingsInitialValues} schema={settingsSchema} onSubmit={settingsOnSubmit}>
          <FormInput name="username" label={t('newUsername')} />
          <FormInput name="email" label={t('newEmail')} />
          <FormInput name="password" label={t('newPassword')} secureTextEntry />
          <FormButton>{t('update')}</FormButton>
        </Form>
        <Text style={styles.title}>Update language</Text>
        <Select value={availableLanguages[i18n.language].title} onSelect={index => changeLanguage(index as IndexPath)}>
          {Object.values(availableLanguages).map(({ key, title, flag }) => (
            <SelectItem key={key} title={title} accessoryLeft={() => <Flag country={flag} style={styles.flag} />} />
          ))}
        </Select>
        <Button appearance='ghost' onPress={() => auth.signout()}>{t('signOut')}</Button>
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
  title: {
    fontSize: 20,
    fontWeight: 'normal',
    paddingVertical: 8,
  },
  flag: {
    width: 24,
    height: 24,
  },
});

export default SettingsScreen;
