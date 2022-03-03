import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, View } from 'react-native';
import { Tab, TabBar, Text } from '@ui-kitten/components';
import { useRoute } from '@react-navigation/native';
import { User as UserIcon } from 'phosphor-react-native';
import { Media as IMedia, Route, User } from '../types';
import * as api from '../api';
import { avatarTag, mediaUrl, petTag, postTag } from '../utils';
import { useMedia } from '../hooks';
import { Divider, Media } from '../components';

enum Tabs { Posts, Pets }

const UserScreen = () => {
  const { params } = useRoute<Route.User>();
  const { data: posts } = useMedia(postTag);
  const { data: pets } = useMedia(petTag);
  const [isLoading, setIsLoading] = useState(true);
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

  if (isLoading || !user) return null;
  return (
    <FlatList
      style={styles.container}
      data={(tab === Tabs.Posts ? posts : pets).filter(x => x.user_id === user.user_id)}
      keyExtractor={item => item.file_id.toString()}
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
          <TabBar selectedIndex={tab} onSelect={index => setTab(index)}>
            <Tab title="Posts" />
            <Tab title="Pets" />
          </TabBar>
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
});

export default UserScreen;
