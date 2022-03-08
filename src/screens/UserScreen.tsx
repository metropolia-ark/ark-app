import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text } from '@ui-kitten/components';
import { useRoute } from '@react-navigation/native';
import { Avatar, Divider, Media, Spinner } from '../components';
import * as api from '../api';
import { useMedia, useUser } from '../hooks';
import { Route, User } from '../types';
import { avatarTag, filter, petTag, postTag, toast } from '../utils';

enum Tab { Posts, Pets }

const UserScreen = () => {
  const { params } = useRoute<Route.User | Route.Profile>();
  const { t } = useTranslation();
  const media = useMedia();
  const currentUser = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [tab, setTab] = useState<Tab>(Tab.Posts);
  const [user, setUser] = useState<User>();

  // Fecth user data and avatar
  const fetchUser = useCallback(async () => {
    try {
      if (!params?.userId) return setUser(currentUser);
      const response = await api.getUser(params.userId);
      const [avatar] = await api.getMediasByTag(avatarTag + params.userId);
      setUser({ ...response, avatar });
    } catch (error) {
      console.error(error);
      toast.error(t('error.unexpectedPrimary'), t('error.unexpectedSecondary'));
    }
  }, [currentUser, params?.userId, t]);

  // Fetch user data once
  useEffect(() => {
    fetchUser().then(() => setIsLoading(false));
  }, [fetchUser]);

  // Refresh user data, and posts or market
  const refresh = async () => {
    setIsRefreshing(true);
    await fetchUser();
    await media.refresh();
    setIsRefreshing(false);
  };

  // Get all media by tag and user id
  const mediaList = filter(media.data, { tag: tab === Tab.Posts ? postTag : petTag, user_id: user?.user_id });

  if (isLoading || media.isLoading || !user) return <Spinner />;
  return (
    <FlatList
      style={styles.container}
      data={mediaList}
      keyExtractor={item => item.file_id.toString()}
      refreshing={isRefreshing}
      onRefresh={refresh}
      ListHeaderComponent={() => (
        <View style={styles.content}>
          <View style={styles.user}>
            <Avatar large user={user} />
            <Text style={styles.username}>{user.username}</Text>
          </View>
          <View style={styles.tabContainer}>
            <Pressable onPress={() => setTab(Tab.Posts)} style={styles.tabItem}>
              <Text style={[styles.tabLabel, tab === Tab.Posts && styles.tabLabelActive]}>{t('user.postsTab')}</Text>
              <View style={[styles.tabIndicator, tab === Tab.Posts && styles.tabIndicatorActive]} />
            </Pressable>
            <Pressable onPress={() => setTab(Tab.Pets)} style={styles.tabItem}>
              <Text style={[styles.tabLabel, tab === Tab.Pets && styles.tabLabelActive]}>{t('user.marketTab')}</Text>
              <View style={[styles.tabIndicator, tab === Tab.Pets && styles.tabIndicatorActive]} />
            </Pressable>
          </View>
        </View>
      )}
      ListEmptyComponent={() => <Text style={styles.empty}>{t('user.empty')}</Text>}
      ItemSeparatorComponent={() => <Divider />}
      renderItem={({ item }) => <Media media={item} />}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    padding: 8,
  },
  user: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  empty: {
    padding: 8,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  tabContainer: { flexDirection: 'row' },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#999999',
    paddingBottom: 6,
  },
  tabLabelActive: { color: '#3366ff' },
  tabIndicator: {
    height: 4,
    width: '100%',
    borderRadius: 1,
    backgroundColor: '#ffffff',
  },
  tabIndicatorActive: { backgroundColor: '#3366ff' },
});

export default UserScreen;
