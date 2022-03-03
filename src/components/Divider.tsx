import React from 'react';
import { StyleSheet, View } from 'react-native';

const Divider = () => (
  <View style={styles.divider} />
);

const styles = StyleSheet.create({
  divider: {
    borderTopColor: '#dddddd',
    borderTopWidth: 1,
    borderBottomColor: '#eeeeee',
    borderBottomWidth: 6,
  },
});

export { Divider };
