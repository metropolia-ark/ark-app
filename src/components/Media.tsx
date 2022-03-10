import React, { useCallback, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { MenuItem, OverflowMenu, Text } from '@ui-kitten/components';
import { Chat, DotsThreeOutlineVertical, Heart } from 'phosphor-react-native';
import { formatDistanceToNowStrict } from 'date-fns';
import * as api from '../api';
import { MediaWithMetadata, Navigation, Rating } from '../types';
import { useMedia, useUser } from '../hooks';
import { availableLanguages, mediaUrl, toast } from '../utils';
import { Avatar } from './Avatar';
import { File } from './File';

interface MediaProps {
  media: MediaWithMetadata;
  detailed?: boolean;
}

const Media = ({ media, detailed }: MediaProps) => {
  const { navigate, goBack } = useNavigation<Navigation.Media>();
  const { t, i18n } = useTranslation();
  const currentUser = useUser();
  const { updateData } = useMedia();
  const [visible, setVisible] = useState(false);

  // Check if the media has been rated by the current user
  const hasRatedAlready = () => !!media.ratings.find(r => r.user_id === currentUser?.user_id);

  // Rate the media
  const rate = async () => {
    try {
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
    } catch (error) {
      console.error(error?.response?.data || error);
      toast.error(t('error.unexpectedPrimary'), t('error.unexpectedSecondary'));
    }
  };

  // Handle pressing the media
  const onPressMedia = () => {
    if (!detailed) navigate('Media', { mediaId: media.file_id });
  };

  // Handle pressing the user
  const onPressUser = () => {
    navigate('User', { userId: media.user_id });
  };

  // Handle to delete posts
  const deletePost = async () => {
    try {
      await api.deleteMedia(media.file_id);
      updateData(media.file_id, undefined);
      if (detailed) goBack();
    } catch (error) {
      console.error(error?.response?.data || error);
      toast.error(t('error.unexpectedPrimary'), t('error.unexpectedSecondary'));
    }
  };

  // Format and localize the timestamp
  const formatTimestamp = useCallback(() => {
    const locale = availableLanguages[i18n.language].datefns;
    return formatDistanceToNowStrict(new Date(media.time_added), { addSuffix: true, locale });
  }, [i18n.language, media.time_added]);

  // Handle to show dropdown menu
  const renderToggleButton = () => (
    <Pressable onPress={() => setVisible(true)}>
      <DotsThreeOutlineVertical size={24} color="#cccccc" weight="fill" />
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onPressUser}>
          <Avatar small user={media.user} />
        </Pressable>
        <Pressable onPress={onPressUser}>
          <Text  style={styles.username}>
            {media.user.username.length > 20 ? media.user.username.slice(0, 20) + '...' : media.user.username}
          </Text>
        </Pressable>
        <Text style={styles.timestampPrefix}>•</Text>
        <Text style={styles.timestamp}>{formatTimestamp()}</Text>
        <OverflowMenu
          anchor={renderToggleButton}
          visible={visible}
          onBackdropPress={() => setVisible(false)}
        >
          <MenuItem title={t('media.report')} disabled />
          {media.user_id === currentUser.user_id
            ? <MenuItem title={t('media.delete')} onPress={deletePost} />
            : <></>}
        </OverflowMenu>
      </View>
      <Pressable onPress={onPressMedia} style={styles.content}>
        <Text style={(media.description && detailed) ? styles.title : styles.description}>{media.title}</Text>
        {(media.description && detailed)
          ? <Text style={styles.description}>{media.description}</Text>
          : null}
        <File uri={mediaUrl + media.filename} type={media.media_type} autoPlay={!!detailed} />
      </Pressable>
      <View style={styles.footer}>
        <Pressable onPress={rate} style={styles.actionContainer}>
          <Heart
            size={24}
            color={hasRatedAlready() ? '#ff3d71' : '#bbbbbb'}
            weight={hasRatedAlready() ? 'fill' : 'regular'}
          />
          <Text style={styles.actionCounter}>{media.ratings.length}</Text>
        </Pressable>
        <Pressable onPress={onPressMedia} style={styles.actionContainer}>
          <Chat size={24} color="#bbbbbb" weight="regular" />
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
    paddingVertical: 8,
    paddingHorizontal: 16,
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
    fontWeight: '700',
    paddingBottom: 8,
    paddingHorizontal: 16,
  },
  description: {
    paddingBottom: 8,
    paddingHorizontal: 16,
  },
  footer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionContainer: {
    flexDirection: 'row',
    marginEnd: 20,
  },
  actionCounter: {
    fontSize: 16,
    color: '#bbbbbb',
    paddingStart: 4,
  },
});

export { Media };
