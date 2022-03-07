import Toast from 'react-native-toast-message';

export const toast = {
  info: (text1: string, text2?: string) => Toast.show({ type: 'info', text1, text2, autoHide: true }),
  success: (text1: string, text2?: string) => Toast.show({ type: 'success', text1, text2, autoHide: true }),
  warn: (text1: string, text2?: string) => Toast.show({ type: 'warn', text1, text2, autoHide: true }),
  error: (text1: string, text2?: string) => Toast.show({ type: 'error', text1, text2, autoHide: true }),
};
