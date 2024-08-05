import React from 'react';
import Toast, {
  BaseToast,
  ToastConfig,
  ToastProps,
} from 'react-native-toast-message';
import { useColorScheme } from 'react-native';
import { Colors } from '../constants/Colors'; // Adjust the import path as needed

const VISIBILITY_TIME = 1500;
const TOP_OFFSET = 50;

// Define custom toast styles using your color themes
export const ThemedToast = () => {
  const theme = useColorScheme() || 'light'; // Compute the theme once within the component

  // Move the toastConfig inside the component where the hook is used
  const toastConfig: ToastConfig = {
    success: (props: ToastProps) => (
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
    ),
    danger: (props: ToastProps) => (
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
    ),
    warning: (props: ToastProps) => (
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
    ),
    normal: (props: ToastProps) => (
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
    ),
  };

  return <Toast config={toastConfig} />;
};

// Function to show toast messages with different types and configurations
export const showToast = (
  type: 'success' | 'danger' | 'warning' | 'normal', // Type of toast to show
  text1: string // Primary text to display in the toast
) => {
  Toast.show({
    type: type, // Type of toast (success, danger, warning, normal)
    text1: text1, // Primary text to display
    position: 'top', // Position of the toast on the screen
    visibilityTime: VISIBILITY_TIME, // How long the toast is visible
    autoHide: true, // Whether the toast hides automatically
    topOffset: TOP_OFFSET, // Offset from the top of the screen
    swipeable: false, // Whether the toast can be dismissed by swiping
  });
};
