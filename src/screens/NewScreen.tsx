import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Image, KeyboardAvoidingView } from 'react-native';
import { Button } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';
import { Navigation } from '../types';
import * as yup from 'yup';
import { Form, FormActions, FormButton, FormInput } from '../components';
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';
import { useFormik, useFormikContext } from 'formik';

interface FormValues{
  title: string,
  description: string,
  token: string,
}

const NewScreen = () => {
  // To navigate to home when uploaded
  const { navigate } = useNavigation<Navigation.Home>();

  // upload initial value
  const uploadInitialValues: FormValues = {
    title: '',
    description: '',
    token: '',
  };
  const [image, setImage] = useState('');
  const [type, setType] = useState('');

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
    console.log(values);
    const filename = image.split('/').pop();
    const fileExtension = filename?.split('.').pop();
    console.log(fileExtension);
    actions.resetForm();

  };
  const reset = () => {
    setImage('');
    setType('');

  };
  console.log('type', type);
  return (
    <ScrollView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
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

              <Button  onPress={reset} style={styles.button}>Reset</Button>
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
  multiline: { minHeight: 60, maxHeight: 60  },
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
    marginBottom: 10,
    resizeMode: 'contain',
  }, layout: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
  }, button: { marginVertical: 12 },
});

export default NewScreen;
