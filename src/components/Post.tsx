import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Text } from '@ui-kitten/components';
import {
  Chat as ChatIcon,
  DotsThreeOutlineVertical as MoreIcon,
  Heart as HeartIcon,
  User as UserIcon,
} from 'phosphor-react-native';
import { formatDistanceToNowStrict } from 'date-fns';
import { Post as IPost } from '../types';
import { mediaUrl } from '../utils/constants';

interface PostProps {
  post: IPost;
  onPressPost?: () => unknown;
  onPressUser?: () => unknown;
  onPressRate?: () => unknown;
}

const Post = ({ post, onPressPost, onPressUser, onPressRate }: PostProps) => {
  return (
    <View style={styles.postContainer}>
      <View style={styles.postHeader}>
        <Pressable onPress={onPressUser}>
          <View style={styles.postAvatar}>
            <UserIcon size={20} color="#ffffff" weight="fill" />
          </View>
        </Pressable>
        <Pressable onPress={onPressUser}>
          <Text style={styles.postUsername}>{post.user.username}</Text>
        </Pressable>
        <Text style={styles.postTimestampSeparator}>•</Text>
        <Text style={styles.postTimestamp}>
          {formatDistanceToNowStrict(new Date(post.time_added), { addSuffix: true })}
        </Text>
        <MoreIcon size={20} color="#bbbbbb" weight="fill" />
      </View>
      <Pressable onPress={onPressPost}>
        <View style={styles.postContent}>
          <Text style={styles.postTitle}>{post.title}</Text>
          <Image style={styles.postImage} source={{ uri: mediaUrl + post.filename }} />
        </View>
      </Pressable>
      <View style={styles.postFooter}>
        <Pressable onPress={onPressRate} style={styles.postActionGroup}>
          <HeartIcon
            size={20}
            color={post.hasRated ? '#ff3d71' : '#bbbbbb'}
            weight={post.hasRated ? 'fill' : 'regular'}
          />
          <Text style={styles.postCounter}>{post.ratings.length}</Text>
        </Pressable>
        <Pressable style={styles.postActionGroup}>
          <ChatIcon size={20} color="#bbbbbb" weight="regular" />
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
