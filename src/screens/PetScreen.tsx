import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Route } from '../types';

const PetScreen = () => {
  const { params } = useRoute<Route.Pet>();
  return (
    <View style={styles.container}>
      <Text>Pet: {params.petId}</Text>
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

export default PetScreen;
