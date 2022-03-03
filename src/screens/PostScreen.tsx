import React from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Post } from '../components';
import { useMedia } from '../hooks';
import { Navigation, Route } from '../types';
import { postTag } from '../utils';

const PostScreen = () => {
  const { params } = useRoute<Route.Post>();
  const { navigate } = useNavigation<Navigation.Post>();
  const { isLoading, isRefreshing, refresh, data } = useMedia(postTag);

  const post = data.find(p => p.file_id === params.postId);

  if (isLoading || !post) return null;
  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={() => refresh(post.file_id)} />}
    >
      <View style={styles.content}>
        <Post
          post={post}
          onPressUser={() => navigate('User', { userId: post.user_id })}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
});

export default PostScreen;
