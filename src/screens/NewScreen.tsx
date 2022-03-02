import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Image, KeyboardAvoidingView, Alert } from 'react-native';
import { Button, Toggle } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';
import { Navigation } from '../types';
import * as yup from 'yup';
import { Form, FormActions, FormButton, FormInput } from '../components';
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { postMedia } from '../api/postMedia';
import { market, media } from '../utils/constants';
import { postTag } from '../api/postTag';

interface FormValues{
  title: string,
  description: string,
}

const NewScreen = () => {
  // To navigate to home when uploaded
  const { navigate } = useNavigation<Navigation.Home>();

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
  const uploadSchema = yup.object().shape({ title: yup.string().required('Please add Title') });

  // upload form submit handler
  const uploadOnSubmit = async (values: FormValues, actions: FormActions<FormValues>) => {
    // if the image is not selected alert
    if (!imageSelected){
      Alert.alert('Please, select a file');
      return;
    }

    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('description', values.description);

    const filename  = image?.split('/').pop();
    let fileExtension = filename?.split('.').pop();
    fileExtension = fileExtension === 'jpg' ? 'jpeg' : fileExtension;

    formData.append(
      'file',
      {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        uri: image,
        name: filename,
        type: type + '/' + fileExtension,
      },
    );
    try {
      // gets the token
      const token = await AsyncStorage.getItem('token');
      const response = await postMedia(token, formData);

      // if the checked is false it will but the media tag
      if (!checked){
        const log = await postTag(response.file_id, media, token);
        console.log(log);
        navigate('Home');
      } else {
        // sets the market tag
        const log = await postTag(response.file_id, market, token);
        console.log(log);
        navigate('Market');
      }
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
            <Button onPress={pickImage}>Pick an image from camera roll</Button>
            <FormInput name="title" label="Title"/>
            <FormInput name="description" label="Description" multiline={true} textStyle={styles.multiline}/>
            <View style={styles.layout}>
              <Toggle checked={checked} onChange={onCheckedChange}>
                {checked ? 'Market' : 'Media'}
              </Toggle>
              <FormButton>Submit</FormButton>
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
