import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { launchImageLibraryAsync } from 'expo-image-picker';
import { Button, IndexPath, Select, SelectItem, Text } from '@ui-kitten/components';
import * as yup from 'yup';
import { Avatar, Flag, Form, FormActions, FormButton, FormInput } from '../components';
import { useAuth, useUser } from '../hooks';
import * as api from '../api';
import { availableLanguages, avatarTag, toast } from '../utils';

interface ProfileFormValues {
  username: string;
  email: string;
}

interface PasswordFormValues {
  password: string;
  confirm: string;
}

const SettingsScreen = () => {
  const auth = useAuth();
  const currentUser = useUser();
  const { t, i18n } = useTranslation();

  // Profile form initial values
  const profileInitialValues: ProfileFormValues = { username: currentUser.username, email: currentUser.email };
  const passwordInitialValues: PasswordFormValues = { password: '', confirm: '' };

  // Profile form validation schema
  const profileSchema = yup.object().shape({
    username: yup.string().min(5, t('error.usernameTooShort')).required(t('required.username')),
    email: yup.string().email(t('error.emailInvalid')).required(t('required.email')),
  });

  // Password form validation schema
  const passwordSchema = yup.object().shape({
    password: yup.string()
      .required(t('required.password'))
      .min(5, t('error.usernameTooShort'))
      .matches(/[0-9]/, t('required.numberPassword')),
    confirm: yup.string()
      .oneOf([yup.ref('password'), null], t('error.passwordMatch'))
      .required(t('required.confirm')),
  });

  // Pick and upload new avatar picture
  const updateAvatar = async () => {
    try {
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
    } catch (error) {
      console.error(error?.response?.data || error);
      toast.error(t('error.unexpectedPrimary'), t('error.unexpectedSecondary'));
    }
  };

  // Update profile
  const updateProfile = async (values: ProfileFormValues, actions: FormActions<ProfileFormValues>) => {
    try {
      if (values.username === currentUser.username && values.email === currentUser.email) return;
      const { available } = await api.getUsername(values.username);
      if (!available) return actions.setFieldError('username', t('error.usernameInUse'));
      await api.updateUserProfile(values.username, values.email);
      auth.updateData({ username: values.username, email: values.email });
      toast.success(t('success.profileUpdated'));
    } catch (error) {
      console.error(error?.response?.data || error);
      toast.error(t('error.unexpectedPrimary'), t('error.unexpectedSecondary'));
    }
  };

  // Update password
  const updatePassword = async (values: PasswordFormValues, actions: FormActions<PasswordFormValues>) => {
    try {
      await api.updateUserPassword(values.password);
      actions.resetForm();
      toast.success(t('success.passwordUpdated'));
    } catch (error) {
      console.error(error?.response?.data || error);
      toast.error(t('error.unexpectedPrimary'), t('error.unexpectedSecondary'));
    }
  };

  // Change the language of the app
  const changeLanguage = async (index: IndexPath) => {
    try {
      await i18n.changeLanguage(Object.keys(availableLanguages)[index.row]);
    } catch (error) {
      console.error(error?.response?.data || error);
      toast.error(t('error.unexpectedPrimary'), t('error.unexpectedSecondary'));
    }
  };

  return (
    <KeyboardAwareScrollView viewIsInsideTabBar enableAutomaticScroll extraScrollHeight={50} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.title}>{t('settings.avatar')}</Text>
          <View style={styles.avatarContainer}>
            <Avatar large user={currentUser} />
          </View>
          <Button appearance="ghost" onPress={updateAvatar}>{t('settings.updateAvatar')}</Button>
        </View>
        <View style={styles.section}>
          <Text style={styles.title}>{t('settings.language')}</Text>
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
          <Text style={styles.title}>{t('settings.account')}</Text>
          <Form initialValues={profileInitialValues} schema={profileSchema} onSubmit={updateProfile}>
            <FormInput name="username" label={t('field.newUsername')} />
            <FormInput name="email" label={t('field.newEmail')} />
            <FormButton>{t('settings.updateProfile')}</FormButton>
          </Form>
        </View>
        <View style={styles.section}>
          <Text style={styles.title}>{t('settings.security')}</Text>
          <Form initialValues={passwordInitialValues} schema={passwordSchema} onSubmit={updatePassword}>
            <FormInput name="password" label={t('field.newPassword')} secureTextEntry />
            <FormInput name="confirm" label={t('field.confirm')} secureTextEntry />
            <FormButton>{t('settings.updatePassword')}</FormButton>
          </Form>
        </View>
        <Button appearance="ghost" onPress={() => auth.signout()}>{t('settings.signOut')}</Button>
      </View>
    </KeyboardAwareScrollView>
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
