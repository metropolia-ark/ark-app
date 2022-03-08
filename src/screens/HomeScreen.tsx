import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Divider, Media, Spinner } from '../components';
import { useMedia } from '../hooks';
import { filter, postTag } from '../utils';

const HomeScreen = () => {
  const { isLoading, isRefreshing, refresh, data } = useMedia();

  // Get all media with post tag
  const mediaList = filter(data, { tag: postTag });

  if (isLoading) return <Spinner />;
  return (
    <FlatList
      data={mediaList}
      keyExtractor={item => item.file_id.toString()}
      refreshing={isRefreshing}
      onRefresh={() => refresh(postTag)}
      style={styles.container}
      ItemSeparatorComponent={() => <Divider />}
      renderItem={({ item }) => <Media media={item} />}
    />
  );
};

const styles = StyleSheet.create({ container: { flex: 1 } });

export default HomeScreen;
