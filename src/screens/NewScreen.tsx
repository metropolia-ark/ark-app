import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Image, KeyboardAvoidingView } from 'react-native';
import { useTranslation } from 'react-i18next';
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import { Button, Toggle } from '@ui-kitten/components';
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

const NewScreen = () => {
  const { navigate } = useNavigation<Navigation.New>();
  const { t } = useTranslation();
  const currentUser = useUser();
  const { updateData } = useMedia();

  // Setting state for image, type, checked marked and if the image is selected
  const [image, setImage] = useState('');
  const [type, setType] = useState('');
  const [checked, setChecked] = useState(false);
  const [imageSelected, setImageSelected] = useState(false);

  // Upload form initial value
  const uploadInitialValues: UploadFormValues = { title: '', description: '' };

  // Image picker
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 0.5,
    });

    if (!result.cancelled) {
      setImage(result.uri as string);
      setType(result.type as string);
      setImageSelected(true);
    }
  };

  // Upload form validation schema
  const uploadSchema = yup.object().shape({
    title: yup.string().required(t('required.title')),
    description: yup.string(),
  });

  // Upload form submit handler
  const uploadOnSubmit = async (values: UploadFormValues, actions: FormActions<UploadFormValues>) => {
    // If the image is not selected alert
    if (!imageSelected) {
      toast.error(t('required.file'));
      return;
    }

    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('description', values.description);

    const imageUri = image.replace('file:/data', 'file:///data');
    const filename = image.split('/').pop();
    let fileExtension = filename?.split('.').pop();
    fileExtension = fileExtension === 'jpg' ? 'jpeg' : fileExtension;

    formData.append('file', {
      uri: imageUri,
      name: filename,
      type: type + '/' + fileExtension,
    } as any);

    try {
      // upload media
      const response = await api.uploadMedia(formData);
      const tag = checked ? petTag : postTag;
      await api.addTagToMedia(response.file_id, tag);
      const media = await api.getMedia(response.file_id);
      const newMedia: MediaWithMetadata = { ...media, tag, user: currentUser, ratings: [], comments: [] };
      updateData(media.file_id, newMedia);
      navigate(checked ? 'Market' : 'Home');
      // to reset everything
      actions.resetForm();
      setType('');
      setImage('');
      setChecked(false);
      setImageSelected(false);
    } catch (e) {
      if (e?.response?.status === 400) {
        toast.error(t('error.fileSize'));
      } else {
        console.error(e?.response?.data || e);
        toast.error(t('error.unexpectedPrimary'), t('error.unexpectedSecondary'));
      }
    }
  };

  const onCheckedChange = (isChecked: boolean) => {
    // to check what tag to put
    setChecked(isChecked);
  };

  return (
    <ScrollView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        keyboardVerticalOffset={100}
        behavior="position"
      >
        <View style={styles.content}>
          <Form initialValues={uploadInitialValues} schema={uploadSchema} onSubmit={uploadOnSubmit}>
            {type === 'image' ?
              (<Image source={{ uri: image }} style={styles.image}/>) :
              type === 'video' ?
                (<Video
                  source={{ uri: image }}
                  style={styles.image}
                  useNativeControls={true}
                  resizeMode="cover"
                  onError={err => {
                    console.error('video', err);
                  }}
                />
                ) : null}
            <Button onPress={pickImage}>{t('new.pickImage')}</Button>
            <FormInput name="title" label={t('field.title')}/>
            {checked ? <FormInput name="description" label={t('field.description')}
              multiline={true} textStyle={styles.multiline}/>  : null }
            <View style={styles.layout}>
              <Toggle checked={checked} onChange={onCheckedChange}>
                {checked ? t('new.market') : t('new.post')}
              </Toggle>
              <FormButton>{t('new.upload')}</FormButton>
            </View>
          </Form>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flex: 1,
    padding: 32,
  },
  layout: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
  },
  multiline: { minHeight: 60, maxHeight: 60 },
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  button: { marginVertical: 12 },
});

export default NewScreen;
