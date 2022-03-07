import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { User as UserIcon } from 'phosphor-react-native';
import { mediaUrl } from '../utils';
import { User } from '../types';

interface AvatarProps {
  user: User;
}

const Avatar = ({ user }: AvatarProps) => {
  return (
    <View style={styles.avatarContainer}>
      {user.avatar
        ? <Image style={styles.avatarImage} source={{ uri: mediaUrl + user.avatar.filename }} />
        : <UserIcon size={64} color="#ffffff" weight="fill" />}
    </View>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    width: 128,
    height: 128,
    marginVertical: 16,
    backgroundColor: '#eeeeee',
    borderColor: '#eeeeee',
    borderWidth: 1,
    borderRadius: 64,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: 128,
    height: 128,
  },
});

export { Avatar };
