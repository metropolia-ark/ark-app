import React, { useState } from 'react';
import {  ScrollView, StyleSheet,  View, Image } from 'react-native';
import { Button } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';
import { Navigation } from '../types';
import * as yup from 'yup';
import { Form, FormActions, FormButton, FormInput } from '../components';
import * as ImagePicker from 'expo-image-picker';

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
  const [image, setImage] = useState();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });
    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  // upload form validation schema
  const uploadSchema = yup.object().shape({ title: yup.string().required('Please add Title') });

  // upload form submit handler
  const uploadOnSubmit = async (values: FormValues, actions: FormActions<FormValues>) => {
    console.log(values);
    console.log(image);

  };
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>

        <Form initialValues={uploadInitialValues} schema={uploadSchema} onSubmit={uploadOnSubmit}>
          {image && <Image source={{ uri: image }}/>}
          <Button onPress={pickImage}>Pick an image from camera roll</Button>
          <FormInput name="title" label="Title"/>
          <FormInput name="description" label="Description" multiline={true} style={{ minHeight: 64 }}/>
          <FormButton>Submit</FormButton>
        </Form>
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

export default NewScreen;
