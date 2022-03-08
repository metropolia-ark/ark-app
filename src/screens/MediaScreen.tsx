import React from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Media, Spinner } from '../components';
import { useMedia } from '../hooks';
import { Route } from '../types';

const MediaScreen = () => {
  const { params } = useRoute<Route.Media>();
  const { isLoading, isRefreshing, refresh, data } = useMedia();

  // Get one media with id
  const media = data[params.mediaId];

  if (isLoading || !media) return <Spinner />;
  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={() => refresh(media)} />}
    >
      <View style={styles.content}>
        <Media media={media} detailed />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
});

export default MediaScreen;
