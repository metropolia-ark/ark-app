import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Image, Pressable, StyleSheet, View } from 'react-native';
import { Text } from '@ui-kitten/components';
import { useRoute } from '@react-navigation/native';
import { User as UserIcon } from 'phosphor-react-native';
import { Media as IMedia, Route, User } from '../types';
import * as api from '../api';
import { Divider, Media } from '../components';
import { avatarTag, mediaUrl, petTag, postTag } from '../utils';
import { useMedia } from '../hooks';

enum Tabs { Posts, Pets }

const UserScreen = () => {
  const { params } = useRoute<Route.User>();
  const posts = useMedia(postTag);
  const pets = useMedia(petTag);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [user, setUser] = useState<User>();
  const [avatar, setAvatar] = useState<IMedia>();
  const [tab, setTab] = useState<Tabs>(Tabs.Posts);

  // Fecth user data and avatar
  const fetchUser = useCallback(async () => {
    const userResponse = await api.getUser(params.userId);
    const avatarResponse = await api.getMediasByTag(avatarTag + params.userId);
    setUser(userResponse);
    setAvatar(avatarResponse[0]);
  }, [params.userId]);

  // Fetch user data once
  useEffect(() => {
    fetchUser().then(() => setIsLoading(false));
  }, [fetchUser]);

  // Refresh user data, and posts or pets
  const refresh = async () => {
    setIsRefreshing(true);
    await fetchUser();
    await (tab === Tabs.Posts ? posts.refresh() : pets.refresh());
    setIsRefreshing(false);
  };

  if (isLoading || posts.isLoading || pets.isLoading || !user) return null;
  return (
    <FlatList
      style={styles.container}
      data={(tab === Tabs.Posts ? posts.data : pets.data).filter(x => x.user_id === user.user_id)}
      keyExtractor={item => item.file_id.toString()}
      refreshing={isRefreshing}
      onRefresh={refresh}
      ListHeaderComponent={() => (
        <View style={styles.content}>
          <View style={styles.user}>
            <View style={styles.avatarContainer}>
              {avatar
                ? <Image style={styles.avatarImage} source={{ uri: mediaUrl + avatar.filename }} />
                : <UserIcon size={64} color="#ffffff" weight="fill" />}
            </View>
            <Text style={styles.username}>{user.username}</Text>
          </View>
          <View style={styles.tabContainer}>
            <Pressable onPress={() => setTab(Tabs.Posts)} style={styles.tabItem}>
              <Text style={[styles.tabLabel, tab === Tabs.Posts && styles.tabLabelActive]}>Posts</Text>
              <View style={[styles.tabIndicator, tab === Tabs.Posts && styles.tabIndicatorActive]} />
            </Pressable>
            <Pressable onPress={() => setTab(Tabs.Pets)} style={styles.tabItem}>
              <Text style={[styles.tabLabel, tab === Tabs.Pets && styles.tabLabelActive]}>Pets</Text>
              <View style={[styles.tabIndicator, tab === Tabs.Pets && styles.tabIndicatorActive]} />
            </Pressable>
          </View>
        </View>
      )}
      ListEmptyComponent={() => (
        <Text style={styles.empty}>
          {tab === Tabs.Posts ? 'This user hasn\'t shared any posts.' : 'This user hasn\'t shared any pets.'}
        </Text>
      )}
      ItemSeparatorComponent={() => <Divider />}
      renderItem={({ item }) => <Media media={item} post={tab === Tabs.Posts} pet={tab === Tabs.Pets} />}
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
