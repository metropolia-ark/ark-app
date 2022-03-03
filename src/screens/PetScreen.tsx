import React from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Navigation, Route } from '../types';
import { useMedia } from '../hooks';
import { petTag } from '../utils';
import { Media } from '../components';

const PetScreen = () => {
  const { params } = useRoute<Route.Pet>();
  const { navigate } = useNavigation<Navigation.Pet>();
  const { isLoading, isRefreshing, refresh, data } = useMedia(petTag);

  const pet = data.find(p => p.file_id === params.petId);

  if (isLoading || !pet) return null;
  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={() => refresh(pet.file_id)} />}
    >
      <View style={styles.content}>
        <Media
          media={pet}
          onPressUser={() => navigate('User', { userId: pet.user_id })}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
});

export default PetScreen;
