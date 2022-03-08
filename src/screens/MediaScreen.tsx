import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Comment, Media, NewComment, Spinner } from '../components';
import { useMedia } from '../hooks';
import { Route } from '../types';

const MediaScreen = () => {
  const { params } = useRoute<Route.Media>();
  const { isLoading, isRefreshing, refresh, data } = useMedia();

  // Get one media with id
  const media = data[params.mediaId];

  if (isLoading || !media) return <Spinner />;
  return (
    <View style={styles.container}>
      <FlatList
        style={styles.list}
        data={media.comments}
        keyExtractor={item => item.comment_id.toString()}
        refreshing={isRefreshing}
        onRefresh={() => refresh(media)}
        ListHeaderComponent={() => <Media media={media} detailed />}
        renderItem={({ item }) => <Comment comment={item} />}
      />
      <NewComment media={media} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: {
    flex: 1,
    marginBottom: 48,
  },
});

export default MediaScreen;
