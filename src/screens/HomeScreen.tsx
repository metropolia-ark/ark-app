import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Post } from '../components';
import { Navigation } from '../types';
import { useMedia } from '../hooks';
import { postTag } from '../utils';

const HomeScreen = () => {
  const { navigate } = useNavigation<Navigation.Home>();
  const { isLoading, isRefreshing, refresh, data } = useMedia(postTag);

  if (isLoading) return null;
  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={item => item.file_id.toString()}
        ItemSeparatorComponent={() => <View style={styles.divider} />}
        refreshing={isRefreshing}
        onRefresh={refresh}
        renderItem={({ item }) => (
          <Post
            post={item}
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
