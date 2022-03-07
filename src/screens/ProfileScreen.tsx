import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useIsFocused } from '@react-navigation/native';
import { Button } from '@ui-kitten/components';
import { avatarTag, mediaUrl } from '../utils';
import { useUser } from '../hooks';
import * as api from '../api';
import { useTranslation } from 'react-i18next';

const ProfileScreen = () => {
  const user = useUser();
  const isFocused = useIsFocused();
  const { t } = useTranslation();
  const [avatar, setAvatar] = useState('https://placedog.net/640/480?random');

  const [image, setImage] = useState('');
  const [type, setType] = useState('');
  const [imageSelected, setImageSelected] = useState(false);

  // image picker
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.5,
    });

    if (!result.cancelled) {
      setImage(result.uri as string);
      setType(result.type as string);
      setImageSelected(true);
    }
  };

  // upload profile pic
  const uploadProfileSubmit = useCallback(async () => {
    if (!user) return;
    // if the image is not selected alert
    if (!imageSelected){
      Alert.alert(t('imageNotSelected'));
      return;
    }

    const formData = new FormData();
    formData.append('title', user.username);
    formData.append('description', '');

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
      await api.addTagToMedia(response.file_id, avatarTag + user.user_id);
      setType('');
      setImage('');
      setImageSelected(false);
    } catch (e) {
      console.error(e);
    }
  }, [user, imageSelected, image, type, t]);

  const fetchAvatar = useCallback(
    async () => {
      if (!user) return;
      try {
        const avatarArray = await api.getMediasByTag(avatarTag + user.user_id);
        if (!(avatarArray.length === 0)){
          const avatars = avatarArray.pop();
          setAvatar(mediaUrl + avatars?.filename);
        } else {
          setAvatar('https://placedog.net/640/480?random');
        }
      } catch (error) {
        console.error(error.message);
      }
    },
    [user],
  );

  useEffect(() => {
    fetchAvatar();
  }, [fetchAvatar, isFocused, uploadProfileSubmit]);

  return (
    <View style={styles.container}>
      <Image  style={styles.avatar}  source={{ uri: avatar }}/>
      <Text>{user?.username}</Text>
      {type === 'image' ?
        (<Image source={{ uri: image }} style={styles.image}/>) : null }
      <Button onPress={pickImage}>{t('imagePick').toString()}</Button>
      <Button onPress={uploadProfileSubmit}>{t('save').toString()}</Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  button: { marginVertical: 12 },
  avatar: {
    margin: 8,
    height: 100,
    width: 100,
    overflow: 'hidden',
    borderRadius: 60,
    borderWidth: 3,
    borderColor: 'black',
  },
});

export default ProfileScreen;
