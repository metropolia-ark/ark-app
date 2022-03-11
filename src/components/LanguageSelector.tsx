import React, { useState } from 'react';
import { Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Modal, Text } from '@ui-kitten/components';
import { useTranslation } from 'react-i18next';
import { availableLanguages, toast } from '../utils';
import { Flag } from './Flag';

const LanguageSelector = () => {
  const { t, i18n } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Change the language of the app
  const changeLanguage = async (lang: string) => {
    try {
      await i18n.changeLanguage(lang);
      setIsModalVisible(false);
    } catch (error) {
      console.error(error?.response?.data || error);
      toast.error(t('error.unexpectedPrimary'), t('error.unexpectedSecondary'));
    }
  };

  return (
    <>
      <Pressable onPress={() => setIsModalVisible(true)}>
        <Text style={styles.text}>{availableLanguages[i18n.language].title}</Text>
      </Pressable>
      <Modal
        visible={isModalVisible}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setIsModalVisible(false)}>
        <View style={styles.modal}>
          {Object.values(availableLanguages).map(({ key, title, flag }) => (
            <TouchableOpacity style={styles.modalButton} key={key} onPress={() => changeLanguage(key)}>
              <Flag country={flag} />
              <Text style={styles.modalText}>{title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  text: {
    margin: 20,
    textAlign: 'center',
  },
  backdrop: {  backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modal: {
    backgroundColor: '#ffffff',
    padding: 16,
  },
  modalButton: {
    flexDirection: 'row',
    padding: 10,
  },
  modalText: { paddingLeft: 6 },
});

export { LanguageSelector };
