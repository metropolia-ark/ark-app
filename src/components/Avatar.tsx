import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { User as UserIcon } from 'phosphor-react-native';
import { mediaUrl } from '../utils';
import { User } from '../types';

interface AvatarProps {
  user?: User;
  small?: boolean;
  large?: boolean;
}

const Avatar = ({ user, small }: AvatarProps) => {
  const iconSize = small ? 16 : 64;
  const style = small ? styles.avatarSmall : styles.avatarLarge;
  return (
    <View style={[styles.avatarContainer, style]}>
      {user?.avatar
        ? <Image source={{ uri: mediaUrl + user.avatar.filename }} style={style} />
        : <UserIcon size={iconSize} color="#ffffff" weight="fill" />}
    </View>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    backgroundColor: '#eeeeee',
    borderColor: '#eeeeee',
    borderWidth: 1,
    borderRadius: 64,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarSmall: {
    width: 32,
    height: 32,
  },
  avatarLarge: {
    width: 128,
    height: 128,
    marginVertical: 16,
  },
});

export { Avatar };
