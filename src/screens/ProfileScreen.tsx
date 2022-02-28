import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useUser } from '../hooks';

const ProfileScreen = () => {
  const user = useUser();
  return (
    <View style={styles.container}>
      <Text>{user.username}</Text>
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

export default ProfileScreen;
