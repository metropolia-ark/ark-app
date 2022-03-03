import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Image, KeyboardAvoidingView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import { Button, Toggle } from '@ui-kitten/components';
import * as yup from 'yup';
import { Form, FormActions, FormButton, FormInput } from '../components';
import { Navigation } from '../types';
import * as api from  '../api';
import { petTag, postTag } from '../utils';
import { useTranslation } from 'react-i18next';

interface FormValues {
  title: string;
  description: string;
}

const NewScreen = () => {
  // To navigate to home when uploaded
  const { navigate } = useNavigation<Navigation.New>();

  // upload initial value
  const uploadInitialValues: FormValues = {
    title: '',
    description: '',
  };

  // setting state for image,type,checked marked and if the image is selected
  const [image, setImage] = useState('');
  const [type, setType] = useState('');
  const [checked, setChecked] = useState(false);
  const [imageSelected, setImageSelected] = useState(false);
  const { t } = useTranslation();

  // image picker
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

  // upload form validation schema
  const uploadSchema = yup.object().shape({ title: yup.string().required(t('errorTitle')) });

  // upload form submit handler
  const uploadOnSubmit = async (values: FormValues, actions: FormActions<FormValues>) => {
    // if the image is not selected alert
    if (!imageSelected){
      Alert.alert(t('imageNotSelected'));
      return;
    }

    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('description', values.description);

    const imageUri = image.replace('file:/data', 'file:///data');
    const filename  = image.split('/').pop();
    let fileExtension = filename?.split('.').pop();
    fileExtension = fileExtension === 'jpg' ? 'jpeg' : fileExtension;

    formData.append('file', {
      uri: imageUri,
      name: filename,
      type: type + '/' + fileExtension,
    } as any);

    try {
      // gets the token
      const response = await api.uploadMedia(formData);

      // if the checked is false it will but the media tag
      if (!checked){
        await api.addTagToMedia(response.file_id, postTag);
        navigate('Home');
      } else {
        // sets the market tag
        await api.addTagToMedia(response.file_id, petTag);
        navigate('Market');
      }
      // to reset everything
      actions.resetForm();
      setType('');
      setImage('');
      setChecked(false);
      setImageSelected(false);
    } catch (e) {
      console.error(e);
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
        behavior={'position'}
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
                ) : null }
            <Button onPress={pickImage}>{t('imagePick').toString()}</Button>
            <FormInput name="title" label={t('title')}/>
            <FormInput name="description" label={t('description')} multiline={true} textStyle={styles.multiline}/>
            <View style={styles.layout}>
              <Toggle checked={checked} onChange={onCheckedChange}>
                {checked ? `${t('market')}` : `${t('media')}`}
              </Toggle>
              <FormButton>{t('submit')}</FormButton>
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
  multiline: { minHeight: 60, maxHeight: 60  },
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
