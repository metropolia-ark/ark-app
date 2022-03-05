import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Text } from '@ui-kitten/components';
import { Chat, DotsThreeOutlineVertical, Heart, User } from 'phosphor-react-native';
import { formatDistanceToNowStrict } from 'date-fns';
import { MediaWithMetadata, Navigation, Rating } from '../types';
import { mediaUrl } from '../utils';
import { useMedia, useUser } from '../hooks';
import * as api from '../api';
import { useNavigation } from '@react-navigation/native';
import { Video } from 'expo-av';

interface MediaProps {
  media: MediaWithMetadata;
  post?: boolean;
  pet?: boolean;
  detailed?: boolean;
}

const Media = ({ media, post, pet, detailed }: MediaProps) => {
  const currentUser = useUser();
  const { navigate } = useNavigation<Navigation.Media>();
  const { updateData } = useMedia(media.tag);

  // Check if the media has been rated by the current user
  const hasRatedAlready = () => !!media.ratings.find(r => r.user_id === currentUser?.user_id);

  // Rate the media
  const rate = async () => {
    if (!currentUser) return;
    if (hasRatedAlready()) {
      await api.deleteRating(media.file_id);
      const newRatings: Rating[] = media.ratings.filter(r => r.user_id !== currentUser.user_id);
      const updatedMedia: MediaWithMetadata = { ...media, ratings: newRatings };
      updateData(media.file_id, updatedMedia);
    } else {
      const { rating_id } = await api.createRating(media.file_id, 1);
      const newRating: Rating = { rating_id, file_id: media.file_id, user_id: currentUser.user_id, rating: 1 };
      const updatedMedia: MediaWithMetadata = { ...media, ratings: [ ...media.ratings, newRating ] };
      updateData(media.file_id, updatedMedia);
    }
  };

  // Handle pressing the media
  const onPressMedia = () => {
    if (detailed) return;
    if (pet) navigate('Pet', { petId: media.file_id });
    if (post) navigate('Post', { postId: media.file_id });
  };

  // Handle pressing the user
  const onPressUser = () => {
    navigate('User', { userId: media.user_id });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onPressUser}>
          <View style={styles.avatar}>
            {media.avatar
              ? <Image style={styles.avatarImage} source={{ uri: mediaUrl + media.avatar.filename }} />
              : <User size={20} color="#ffffff" weight="fill" />}
          </View>
        </Pressable>
        <Pressable onPress={onPressUser}>
          <Text style={styles.username}>{media.user.username}</Text>
        </Pressable>
        <Text style={styles.timestampPrefix}>•</Text>
        <Text style={styles.timestamp}>
          {formatDistanceToNowStrict(new Date(media.time_added), { addSuffix: true })}
        </Text>
        <DotsThreeOutlineVertical size={20} color="#bbbbbb" weight="fill" />
      </View>
      <Pressable onPress={onPressMedia} style={styles.content}>
        <Text style={styles.title}>{media.title}</Text>
        {media.media_type === 'image' ?
          (<Image source={{ uri: mediaUrl + media.filename }} style={styles.image}/>) :
          media.media_type ?
            (<Video
              source={{ uri: mediaUrl + media.filename }}
              style={styles.image}
              shouldPlay={true}
              isLooping
              resizeMode="contain"
              onError={err => {
                console.error('video', err);
              }}
            />
            ) : null }
      </Pressable>
      <View style={styles.footer}>
        <Pressable onPress={rate} style={styles.actionContainer}>
          <Heart
            size={20}
            color={hasRatedAlready() ? '#ff3d71' : '#bbbbbb'}
            weight={hasRatedAlready() ? 'fill' : 'regular'}
          />
          <Text style={styles.actionCounter}>{media.ratings.length}</Text>
        </Pressable>
        <Pressable style={styles.actionContainer}>
          <Chat size={20} color="#bbbbbb" weight="regular" />
          <Text style={styles.actionCounter}>{media.comments.length}</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    backgroundColor: '#eeeeee',
    borderColor: '#eeeeee',
    borderWidth: 1,
    borderRadius: 16,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: 32,
    height: 32,
  },
  username: {
    fontWeight: 'bold',
    paddingStart: 12,
  },
  timestampPrefix: {
    fontSize: 12,
    color: '#bbbbbb',
    paddingTop: 2,
    paddingHorizontal: 6,
  },
  timestamp: {
    flex: 1,
    fontSize: 12,
    color: '#bbbbbb',
    paddingEnd: 8,
    paddingTop: 2,
  },
  content: {},
  title: {
    paddingBottom: 8,
    paddingHorizontal: 8,
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
  },
  footer: {
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionContainer: {
    flexDirection: 'row',
    marginEnd: 12,
  },
  actionCounter: {
    fontSize: 16,
    color: '#bbbbbb',
    paddingStart: 4,
  },
});

export { Media };
