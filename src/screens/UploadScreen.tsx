import React, { useState } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ImageInfo, launchImageLibraryAsync, MediaTypeOptions } from 'expo-image-picker';
import { Video } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import { Button, CheckBox, Text } from '@ui-kitten/components';
import * as yup from 'yup';
import { Form, FormActions, FormButton, FormInput } from '../components';
import { MediaWithMetadata, Navigation } from '../types';
import * as api from '../api';
import { petTag, postTag, toast } from '../utils';
import { useMedia, useUser } from '../hooks';

interface UploadFormValues {
  title: string;
  description: string;
}

const UploadScreen = () => {
  const { navigate } = useNavigation<Navigation.Upload>();
  const { t } = useTranslation();
  const currentUser = useUser();
  const { updateData } = useMedia();
  const [image, setImage] = useState<ImageInfo | null>(null);
  const [isMarket, setIsMarket] = useState(false);

  // Upload form initial value
  const uploadInitialValues: UploadFormValues = { title: '', description: '' };

  // Upload form validation schema
  const uploadSchema = yup.object().shape({
    title: yup.string().required(t('required.title')),
    description: yup.string(),
  });

  // Upload form submit handler
  const uploadOnSubmit = async (values: UploadFormValues, actions: FormActions<UploadFormValues>) => {
    if (!image) return toast.error(t('required.file'));
    try {
      const uri = image.uri.replace('file:/data', 'file:///data');
      const name = uri.slice(uri.lastIndexOf('/') + 1);
      const type = image.type + '/' + name.slice(name.lastIndexOf('.') + 1).replace('jpg', 'jpeg');
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('description', values.description);
      formData.append('file', { uri, name, type } as any);
      const response = await api.uploadMedia(formData);
      const tag = isMarket ? petTag : postTag;
      await api.addTagToMedia(response.file_id, tag);
      const media = await api.getMedia(response.file_id);
      const newMedia: MediaWithMetadata = { ...media, tag, user: currentUser, ratings: [], comments: [] };
      updateData(newMedia.file_id, newMedia);
      navigate(isMarket ? 'Market' : 'Posts');
      actions.resetForm();
      setImage(null);
      setIsMarket(false);
    } catch (error) {
      if (error?.response?.status === 400) {
        toast.error(t('error.fileSize'));
      } else {
        console.error(error?.response?.data || error);
        toast.error(t('error.unexpectedPrimary'), t('error.unexpectedSecondary'));
      }
    }
  };

  // Pick an image
  const pickImage = async () => {
    const result = await launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.All,
      allowsEditing: true,
      quality: 0.5,
    });
    if (!result.cancelled) setImage(result);
  };

  return (
    <KeyboardAwareScrollView viewIsInsideTabBar enableAutomaticScroll extraScrollHeight={50} style={styles.container}>
      <View style={styles.content}>
        <Form initialValues={uploadInitialValues} schema={uploadSchema} onSubmit={uploadOnSubmit}>
          {image?.type === 'image'
            ? <Image source={{ uri: image.uri }} style={styles.image} />
            : image?.type === 'video'
              ? <Video
                source={{ uri: image.uri }}
                style={styles.image}
                useNativeControls={true}
                resizeMode="cover"
                onError={err => {
                  console.error('video', err);
                }}
              />
              : null}
          <Button appearance="outline" onPress={pickImage}>{t('upload.pickImage')}</Button>
          <FormInput name="title" label={t('field.title')} />
          <CheckBox checked={isMarket} onChange={setIsMarket} style={styles.checkbox}>
            {() => <Text style={styles.checkboxText}>{t('upload.toMarket')}</Text>}
          </CheckBox>
          {isMarket
            ? <FormInput name="description" label={t('field.description')} multiline textStyle={styles.multiline} />
            : null}
          <FormButton>{t('upload.submit')}</FormButton>
        </Form>
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flex: 1,
    padding: 32,
  },
  multiline: { minHeight: 60, maxHeight: 60 },
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  checkbox: { marginVertical: 12 },
  checkboxText: {
    fontSize: 14,
    paddingStart: 8,
  },
  button: { marginVertical: 12 },
});

export default UploadScreen;
