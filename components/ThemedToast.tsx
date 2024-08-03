import React from 'react';
import Toast, {
  BaseToast,
  ToastConfig,
  ToastProps,
} from 'react-native-toast-message';
import { useColorScheme } from 'react-native';
import { Colors } from '../constants/Colors'; // Adjust the import path as needed

// Define custom toast styles using your color themes
const toastConfig: ToastConfig = {
  success: (props: ToastProps) => {
    const theme = useColorScheme() || 'light';
    return (
      <BaseToast
        {...props}
        style={{
          borderLeftColor: Colors[theme].toastSuccessBackground,
          backgroundColor: Colors[theme].toastSuccessBackground,
        }}
        text1Style={{
          color: Colors[theme].toastSuccess,
        }}
      />
    );
  },
  danger: (props: ToastProps) => {
    const theme = useColorScheme() || 'light';
    return (
      <BaseToast
        {...props}
        style={{
          borderLeftColor: Colors[theme].toastDangerBackground,
          backgroundColor: Colors[theme].toastDangerBackground,
        }}
        text1Style={{
          color: Colors[theme].toastDanger,
        }}
      />
    );
  },
  warning: (props: ToastProps) => {
    const theme = useColorScheme() || 'light';
    return (
      <BaseToast
        {...props}
        style={{
          borderLeftColor: Colors[theme].toastWarningBackground,
          backgroundColor: Colors[theme].toastWarningBackground,
        }}
        text1Style={{
          color: Colors[theme].toastWarning,
        }}
      />
    );
  },
  normal: (props: ToastProps) => {
    const theme = useColorScheme() || 'light';
    return (
      <BaseToast
        {...props}
        style={{
          borderLeftColor: Colors[theme].toastNormalBackground,
          backgroundColor: Colors[theme].toastNormalBackground,
        }}
        text1Style={{
          color: Colors[theme].toastNormal,
        }}
      />
    );
  },
};

export function ThemedToast() {
  return <Toast config={toastConfig} />;
}

export const showToast = (
  type: 'success' | 'danger' | 'warning' | 'normal',
  text1: string
) => {
  Toast.show({
    type: type,
    text1: text1,
    position: 'top',
    visibilityTime: 1500,
    autoHide: true,
    topOffset: 50,
    swipeable: false,
  });
};
