import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Post } from '../components';
import { usePosts } from '../hooks/usePosts';
import { Navigation } from '../types';

const HomeScreen = () => {
  const { navigate } = useNavigation<Navigation.Home>();
  const { isLoading, posts, rate } = usePosts();

  if (isLoading) return null;
  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={item => item.file_id.toString()}
        ItemSeparatorComponent={() => <View style={styles.divider} />}
        renderItem={({ item }) => (
          <Post
            post={item}
            onPressRate={() => rate(item.file_id)}
            onPressPost={() => navigate('Post', { postId: item.file_id })}
            onPressUser={() => navigate('User', { userId: item.user_id })}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  divider: {
    borderTopColor: '#dddddd',
    borderTopWidth: 1,
    borderBottomColor: '#eeeeee',
    borderBottomWidth: 6,
  },
});

export default HomeScreen;
