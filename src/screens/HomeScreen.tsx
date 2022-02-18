import React from 'react';
import { Button, StyleSheet, Text, View  } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Navigation } from '../types';

const HomeScreen = () => {
  const { navigate } = useNavigation<Navigation.Home>();

  return (
    <View style={styles.container}>
      <Text>Home</Text>
      <Button title="Go to post 123" onPress={() => navigate('Post', { postId: '123' })} />
      <Button title="Go to user 789" onPress={() => navigate('User', { userId: '789' })} />
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

export default HomeScreen;
