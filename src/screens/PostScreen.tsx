import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Post from '../components/Post';
import { usePosts } from '../hooks/usePosts';
import { Navigation, Route } from '../types';

const PostScreen = () => {
  const { params } = useRoute<Route.Post>();
  const { navigate } = useNavigation<Navigation.Post>();
  const { isLoading, posts, rate } = usePosts();
  const post = posts.find(p => p.file_id === params.postId);

  if (isLoading || !post) return null;
  return (
    <View style={styles.container}>
      <Post
        post={post}
        onPressRate={() => rate(post.file_id)}
        onPressUser={() => navigate('User', { userId: post.user_id })}
      />
    </View>
  );
};

const styles = StyleSheet.create({ container: { flex: 1 } });

export default PostScreen;
