import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Route } from '../types';

const UserScreen = () => {
  const { params } = useRoute<Route.User>();
  return (
    <View style={styles.container}>
      <Text>User: {params.userId}</Text>
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

export default UserScreen;
