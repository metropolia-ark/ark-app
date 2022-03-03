import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Text } from '@ui-kitten/components';
import { Chat, DotsThreeOutlineVertical, Heart, User } from 'phosphor-react-native';
import { formatDistanceToNowStrict } from 'date-fns';
import { MediaWithMetadata, Rating } from '../types';
import { mediaUrl } from '../utils';
import { useMedia, useUser } from '../hooks';
import * as api from '../api';

interface PostProps {
  post: MediaWithMetadata;
  onPressPost?: () => unknown;
  onPressUser?: () => unknown;
}

const Post = ({ post, onPressPost, onPressUser }: PostProps) => {
  const currentUser = useUser();
  const { updateData } = useMedia(post.tag);

  // Check if the post has been rated by the current user
  const hasRatedAlready = () => !!post.ratings.find(r => r.user_id === currentUser?.user_id);

  // Rate the post
  const rate = async () => {
    if (!currentUser) return;
    if (hasRatedAlready()) {
      await api.deleteRating(post.file_id);
      const newRatings: Rating[] = post.ratings.filter(r => r.user_id !== currentUser.user_id);
      const updatedPost: MediaWithMetadata = { ...post, ratings: newRatings };
      updateData(post.file_id, updatedPost);
    } else {
      const { rating_id } = await api.createRating(post.file_id, 1);
      const newRating: Rating = { rating_id, file_id: post.file_id, user_id: currentUser.user_id, rating: 1 };
      const updatedPost: MediaWithMetadata = { ...post, ratings: [ ...post.ratings, newRating ] };
      updateData(post.file_id, updatedPost);
    }
  };

  return (
    <View style={styles.postContainer}>
      <View style={styles.postHeader}>
        <Pressable onPress={onPressUser}>
          <View style={styles.postAvatar}>
            {post.avatar
              ? <Image style={styles.postAvatarImage} source={{ uri: mediaUrl + post.avatar.filename }} />
              : <User size={20} color="#ffffff" weight="fill" />}
          </View>
        </Pressable>
        <Pressable onPress={onPressUser}>
          <Text style={styles.postUsername}>{post.user.username}</Text>
        </Pressable>
        <Text style={styles.postTimestampSeparator}>•</Text>
        <Text style={styles.postTimestamp}>
          {formatDistanceToNowStrict(new Date(post.time_added), { addSuffix: true })}
        </Text>
        <DotsThreeOutlineVertical size={20} color="#bbbbbb" weight="fill" />
      </View>
      <Pressable onPress={onPressPost}>
        <View style={styles.postContent}>
          <Text style={styles.postTitle}>{post.title}</Text>
          <Image style={styles.postImage} source={{ uri: mediaUrl + post.filename }} />
        </View>
      </Pressable>
      <View style={styles.postFooter}>
        <Pressable onPress={rate} style={styles.postActionGroup}>
          <Heart
            size={20}
            color={hasRatedAlready() ? '#ff3d71' : '#bbbbbb'}
            weight={hasRatedAlready() ? 'fill' : 'regular'}
          />
          <Text style={styles.postCounter}>{post.ratings.length}</Text>
        </Pressable>
        <Pressable style={styles.postActionGroup}>
          <Chat size={20} color="#bbbbbb" weight="regular" />
          <Text style={styles.postCounter}>{post.comments.length}</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  postContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  postAvatar: {
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
  postAvatarImage: {
    width: 32,
    height: 32,
  },
  postIconAvatar: {
    width: 24,
    height: 24,
    padding: 4,
  },
  postUsername: {
    fontWeight: 'bold',
    paddingStart: 12,
  },
  postTimestampSeparator: {
    fontSize: 12,
    color: '#bbbbbb',
    paddingTop: 2,
    paddingHorizontal: 6,
  },
  postTimestamp: {
    flex: 1,
    fontSize: 12,
    color: '#bbbbbb',
    paddingEnd: 8,
    paddingTop: 2,
  },
  postIconMore: {
    width: 24,
    height: 24,
  },
  postContent: {},
  postTitle: {
    paddingBottom: 8,
    paddingHorizontal: 8,
  },
  postImage: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
  },
  postFooter: {
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  postActionGroup: {
    flexDirection: 'row',
    marginEnd: 12,
  },
  postCounter: {
    fontSize: 16,
    color: '#bbbbbb',
    paddingStart: 4,
  },
});

export { Post };
