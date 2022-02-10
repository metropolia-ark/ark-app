import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Route } from '../types';

const PostScreen = () => {
  const { params } = useRoute<Route.Post>();
  return (
    <View style={styles.container}>
      <Text>Post: {params.postId}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PostScreen;
