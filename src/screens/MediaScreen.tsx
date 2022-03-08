import React from 'react';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useRoute } from '@react-navigation/native';
import { Comment, Media, NewComment, Spinner } from '../components';
import { useMedia } from '../hooks';
import { Route } from '../types';

const MediaScreen = () => {
  const { params } = useRoute<Route.Media>();
  const { isLoading, data } = useMedia();

  // Get one media with id
  const media = data[params.mediaId];

  if (isLoading || !media) return <Spinner />;
  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        viewIsInsideTabBar
        enableAutomaticScroll
        extraScrollHeight={50}
        style={styles.list}
      >
        <View style={styles.content}>
          <Media media={media} detailed />
          {media.comments.map(comment => (
            <Comment key={comment.comment_id} comment={comment} />
          ))}
        </View>
      </KeyboardAwareScrollView>
      <NewComment media={media} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
  list: {
    flex: 1,
    marginBottom: 48,
  },
});

export default MediaScreen;
