import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Divider, Media, Spinner } from '../components';
import { useMedia } from '../hooks';
import { filter, petTag } from '../utils';

const MarketScreen = () => {
  const { isLoading, isRefreshing, refresh, data } = useMedia();

  // Get all media with pet tag
  const mediaList = filter(data, { tag: petTag });

  if (isLoading) return <Spinner />;
  return (
    <FlatList
      data={mediaList}
      keyExtractor={item => item.file_id.toString()}
      refreshing={isRefreshing}
      onRefresh={() => refresh()}
      style={styles.container}
      ItemSeparatorComponent={() => <Divider />}
      renderItem={({ item }) => <Media media={item} />}
    />
  );
};

const styles = StyleSheet.create({ container: { flex: 1 } });

export default MarketScreen;
