import React, { useState } from 'react';
import { Keyboard, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { PaperPlaneRight } from 'phosphor-react-native';
import * as api from '../api';
import { useMedia, useUser } from '../hooks';
import { Comment, MediaWithMetadata } from '../types';
import { toast } from '../utils';
import { Spinner } from '@ui-kitten/components';

interface NewCommentProps {
  media: MediaWithMetadata;
}

const NewComment = ({ media }: NewCommentProps) => {
  const { t } = useTranslation();
  const currentUser = useUser();
  const { updateData } = useMedia();
  const [isPending, setIsPending] = useState(false);
  const [comment, setComment] = useState('');

  // Create a comment on a media
  const createComment = async () => {
    if (isPending || !comment) return;
    try {
      Keyboard.dismiss();
      setIsPending(true);
      const { comment_id } = await api.createComment(media.file_id, comment);
      const newComment: Comment = {
        comment_id,
        file_id: media.file_id,
        user_id: currentUser.user_id,
        comment,
        time_added: new Date().toISOString(),
      };
      const updatedMedia: MediaWithMetadata = { ...media, comments: [ ...media.comments, newComment ] };
      updateData(media.file_id, updatedMedia);
    } catch (error) {
      console.error(error?.response?.data || error);
      toast.error(t('error.unexpectedPrimary'), t('error.unexpectedSecondary'));
    } finally {
      setComment('');
      setIsPending(false);
    }
  };

  return (
    <View style={styles.newComment}>
      <TextInput
        value={comment}
        onChangeText={setComment}
        placeholder={t('media.sendComment')}
        style={styles.input}
      />
      <TouchableOpacity activeOpacity={0.5} onPress={createComment}>
        {isPending
          ? <Spinner size="medium" />
          : <PaperPlaneRight size={20} weight="bold" color="#3366ff" />}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  newComment: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 48,
    height: 48,
    width: '100%',
    left: 0,
    right: 0,
    bottom: 0,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderTopColor: '#eeeeee',
    borderTopWidth: 1,
    backgroundColor: '#ffffff',
  },
  input: {
    flex: 1,
    marginEnd: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
});

export { NewComment };
