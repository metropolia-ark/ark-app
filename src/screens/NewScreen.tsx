import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Image, KeyboardAvoidingView } from 'react-native';
import { Button, Toggle } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';
import { Navigation } from '../types';
import * as yup from 'yup';
import { Form, FormActions, FormButton, FormInput } from '../components';
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';
import { postMedia } from '../api/PostMedia';
import { tempToken } from '../ultis/variables';

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

  const [image, setImage] = useState('');
  const [type, setType] = useState('');
  const [checked, setChecked] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 0.5,
    });

    if (!result.cancelled) {
      setImage(result.uri as string);
      setType(result.type as string);
    }
  };

  // upload form validation schema
  const uploadSchema = yup.object().shape({ title: yup.string().required('Please add Title') });

  // upload form submit handler
  const uploadOnSubmit = async (values: FormValues, actions: FormActions<FormValues>) => {
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('description', values.description);
    const filename  = image?.split('/').pop();
    let fileExtension = filename?.split('.').pop();
    fileExtension = fileExtension === 'jpg' ? 'jpeg' : fileExtension;
    console.log(image);
    formData.append(
      'file',
      {
        uri: image,
        name: filename,
        type: type + '/' + fileExtension,
      },
    );
    const response = await postMedia(tempToken, formData);
    console.log(response);
    /*     const tagResponse = await postTag(
      { file_id: response.file_id, tag: appId },
      token,
    );  */
    actions.resetForm();
    setType('');
    setImage('');
    setChecked(false);
    navigate('Home');
  };
  const onCheckedChange = (isChecked: boolean) => {
    console.log(isChecked);
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
