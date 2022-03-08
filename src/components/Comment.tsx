import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text } from '@ui-kitten/components';
import { formatDistanceToNowStrict } from 'date-fns';
import { Comment as IComment, User } from '../types';
import { Avatar } from './Avatar';
import { availableLanguages, avatarTag } from '../utils';
import * as api from '../api';

interface CommentProps {
  comment: IComment;
}

const Comment = ({ comment }: CommentProps) => {
  const { i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User>();

  // Fetch user data of the commentor
  const fetchUser = useCallback(async () => {
    const response = await api.getUser(comment.user_id);
    const [avatar] = await api.getMediasByTag(avatarTag + response.user_id);
    setUser({ ...response, avatar });
  }, [comment]);

  // Fetch user data once
  useEffect(() => {
    fetchUser().then(() => setIsLoading(false));
  }, [fetchUser]);

  // Format and localize the timestamp
  const formatTimestamp = useCallback((timestamp: string) => {
    const locale = availableLanguages[i18n.language].datefns;
    return formatDistanceToNowStrict(new Date(timestamp), { addSuffix: true, locale });
  }, [i18n.language]);

  if (isLoading || !user) return null;
  return (
    <View key={comment.comment_id} style={styles.comment}>
      <Avatar small user={user} />
      <View style={styles.commentContent}>
        <View style={styles.header}>
          <Text style={styles.username}>{user.username}</Text>
          <Text style={styles.timestampPrefix}>•</Text>
          <Text style={styles.timestamp}>{formatTimestamp(comment.time_added)}</Text>
        </View>
        <Text>{comment.comment}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  comment: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: '#eeeeee',
    backgroundColor: '#ffffff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
  },
  commentContent: {
    flex: 1,
    marginHorizontal: 12,
  },
  username: { fontWeight: 'bold' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
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
  },
});

export { Comment };