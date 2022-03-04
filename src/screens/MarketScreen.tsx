import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Divider, Media } from '../components';
import { useMedia } from '../hooks';
import { petTag } from '../utils';

const MarketScreen = () => {
  const { isLoading, isRefreshing, refresh, data } = useMedia(petTag);
  if (isLoading) return null;
  return (
    <FlatList
      data={data}
      keyExtractor={item => item.file_id.toString()}
      refreshing={isRefreshing}
      onRefresh={refresh}
      style={styles.container}
      ItemSeparatorComponent={() => <Divider />}
      renderItem={({ item }) => <Media media={item} pet />}
    />
  );
};

const styles = StyleSheet.create({ container: { flex: 1 } });

export default MarketScreen;
