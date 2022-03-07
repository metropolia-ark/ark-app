import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Image, Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text } from '@ui-kitten/components';
import { useRoute } from '@react-navigation/native';
import { User as UserIcon } from 'phosphor-react-native';
import { Divider, Media } from '../components';
import * as api from '../api';
import { useMedia, useUser } from '../hooks';
import { Route, User } from '../types';
import { avatarTag, filter, mediaUrl, petTag, postTag } from '../utils';

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
    const userId = params?.userId ?? currentUser.user_id;
    const response = await api.getUser(userId);
    const [avatar] = await api.getMediasByTag(avatarTag + userId);
    setUser({ ...response, avatar });
  }, [currentUser.user_id, params]);

  // Fetch user data once
  useEffect(() => {
    fetchUser().then(() => setIsLoading(false));
  }, [fetchUser]);

  // Refresh user data, and posts or market
  const refresh = async () => {
    setIsRefreshing(true);
    await fetchUser();
    await media.refresh(tab === Tab.Posts ? postTag : petTag);
    setIsRefreshing(false);
  };

  // Get all media by tag and user id
  const mediaList = filter(media.data, { tag: tab === Tab.Posts ? postTag : petTag, user_id: user?.user_id });

  if (isLoading || media.isLoading || !user) return null;
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
            <View style={styles.avatarContainer}>
              {user.avatar
                ? <Image style={styles.avatarImage} source={{ uri: mediaUrl + user.avatar.filename }} />
                : <UserIcon size={64} color="#ffffff" weight="fill" />}
            </View>
            <Text style={styles.username}>{user.username}</Text>
          </View>
          <View style={styles.tabContainer}>
            <Pressable onPress={() => setTab(Tab.Posts)} style={styles.tabItem}>
              <Text style={[styles.tabLabel, tab === Tab.Posts && styles.tabLabelActive]}>{t('posts')}</Text>
              <View style={[styles.tabIndicator, tab === Tab.Posts && styles.tabIndicatorActive]} />
            </Pressable>
            <Pressable onPress={() => setTab(Tab.Pets)} style={styles.tabItem}>
              <Text style={[styles.tabLabel, tab === Tab.Pets && styles.tabLabelActive]}>{t('market')}</Text>
              <View style={[styles.tabIndicator, tab === Tab.Pets && styles.tabIndicatorActive]} />
            </Pressable>
          </View>
        </View>
      )}
      ListEmptyComponent={() => (
        <Text style={styles.empty}>
          {tab === Tab.Posts
            ? user.user_id === currentUser.user_id ? t('noPostsSelf') : t('noPosts', { username: user.username })
            : user.user_id === currentUser.user_id ? t('noPetsSelf') : t('noPets', { username: user.username })}
        </Text>
      )}
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
  avatarContainer: {
    width: 128,
    height: 128,
    marginVertical: 16,
    backgroundColor: '#eeeeee',
    borderColor: '#eeeeee',
    borderWidth: 1,
    borderRadius: 64,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: 128,
    height: 128,
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
