import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Media } from '../components';
import { Navigation } from '../types';
import { useMedia } from '../hooks';
import { petTag } from '../utils';

const MarketScreen = () => {
  const { navigate } = useNavigation<Navigation.Market>();
  const { isLoading, isRefreshing, refresh, data } = useMedia(petTag);

  if (isLoading) return null;
  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={item => item.file_id.toString()}
        ItemSeparatorComponent={() => <View style={styles.divider} />}
        refreshing={isRefreshing}
        onRefresh={refresh}
        renderItem={({ item }) => (
          <Media
            media={item}
            onPressMedia={() => navigate('Pet', { petId: item.file_id })}
            onPressUser={() => navigate('User', { userId: item.user_id })}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  divider: {
    borderTopColor: '#dddddd',
    borderTopWidth: 1,
    borderBottomColor: '#eeeeee',
    borderBottomWidth: 6,
  },
});

export default MarketScreen;
