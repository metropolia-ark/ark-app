import React from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { launchImageLibraryAsync } from 'expo-image-picker';
import { Button, IndexPath, Select, SelectItem, Text } from '@ui-kitten/components';
import * as yup from 'yup';
import { Avatar, Flag, Form, FormActions, FormButton, FormInput } from '../components';
import { useAuth, useUser } from '../hooks';
import * as api from '../api';
import { availableLanguages, avatarTag } from '../utils';

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
    email: yup.string().email(t('emailInvalid')).required(),
    username: yup.string().required(),
    password: yup.string().required(),
  });

  // Pick and upload new avatar picture
  const updateAvatar = async () => {
    const image = await launchImageLibraryAsync({ allowsEditing: true, quality: 0.5 });
    if (!image.cancelled) {
      const uri = image.uri.replace('file:/data', 'file:///data');
      const name = uri.slice(uri.lastIndexOf('/') + 1);
      const type = image.type + '/' + name.slice(name.lastIndexOf('.') + 1).replace('jpg', 'jpeg');
      const formData = new FormData();
      formData.append('title', currentUser.username);
      formData.append('file', { uri, name, type } as any);
      const response = await api.uploadMedia(formData);
      await api.addTagToMedia(response.file_id, avatarTag + currentUser.user_id);
      if (currentUser.avatar) await api.deleteMedia(currentUser.avatar.file_id);
      const [avatar] = await api.getMediasByTag(avatarTag + currentUser.user_id);
      auth.updateData({ avatar });
    }
  };

  // Update profile data
  const updateProfile = async (values: FormValues, actions: FormActions<FormValues>) => {
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

  // Change the language of the app
  const changeLanguage = async (index: IndexPath) => {
    await i18n.changeLanguage(Object.keys(availableLanguages)[index.row]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.title}>Change avatar</Text>
          <View style={styles.avatarContainer}>
            <Avatar user={currentUser} />
          </View>
          <Button appearance="ghost" onPress={updateAvatar}>Change avatar</Button>
        </View>
        <View style={styles.section}>
          <Text style={styles.title}>App language</Text>
          <Select
            value={availableLanguages[i18n.language].title}
            onSelect={index => changeLanguage(index as IndexPath)}
            style={styles.select}
          >
            {Object.values(availableLanguages).map(({ key, title, flag }) => (
              <SelectItem key={key} title={title} accessoryLeft={() => <Flag country={flag} />} />
            ))}
          </Select>
        </View>
        <View style={styles.section}>
          <Text style={styles.title}>Update profile</Text>
          <Form initialValues={settingsInitialValues} schema={settingsSchema} onSubmit={updateProfile}>
            <FormInput name="username" label={t('newUsername')} />
            <FormInput name="email" label={t('newEmail')} />
            <FormInput name="password" label={t('newPassword')} secureTextEntry />
            <FormButton>{t('update')}</FormButton>
          </Form>
        </View>
        <Button appearance="ghost" onPress={() => auth.signout()}>{t('signOut')}</Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    flexDirection: 'column',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  avatarContainer: {
    width: '100%',
    alignItems: 'center',
  },
  select: { marginTop: 16 },
});

export default SettingsScreen;
