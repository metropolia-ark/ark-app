import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Navigation } from '../types';

const MarketScreen = () => {
  const { navigate } = useNavigation<Navigation.Market>();
  return (
    <View style={styles.container}>
      <Text>Market</Text>
      <Button title="Go to pet 456" onPress={() => navigate('Pet', { petId: 456 })} />
      <Button title="Go to user 789" onPress={() => navigate('User', { userId: 789 })} />
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

export default MarketScreen;
