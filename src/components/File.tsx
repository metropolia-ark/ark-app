import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { Video } from 'expo-av';

interface FileProps {
  uri: string;
  type?: string;
  autoPlay?: boolean;
  showControls?: boolean;
}

const File = ({ uri, type, autoPlay, showControls }: FileProps) => {
  switch (type) {
    case 'image': {
      return (
        <Image source={{ uri }} style={styles.file} />
      );
    }
    case 'video': {
      return (
        <Video
          source={{ uri }}
          style={styles.file}
          useNativeControls={showControls}
          shouldPlay={autoPlay}
          isLooping
          resizeMode="cover"
          onError={error => console.error('video', error)}
        />
      );
    }
    default: {
      return null;
    }
  }
};

const styles = StyleSheet.create({
  file: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
  },
});

export { File };
