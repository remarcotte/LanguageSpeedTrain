import React, { useEffect } from 'react';
import Toast from 'react-native-root-toast';
import { useThemeColor } from '@/hooks/useThemeColor';

interface ThemedToastProps {
  title: string;
  duration?: number;
  lightColor?: string;
  darkColor?: string;
}

export const ThemedToast: React.FC<ThemedToastProps> = ({
  title,
  duration,
  lightColor,
  darkColor
})  => {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'toastText');
  const background = useThemeColor({ light: lightColor, dark: darkColor }, 'toastBackground');

  useEffect(() => {
    const toast = Toast.show(title, {
      duration: duration,
      position: Toast.positions.BOTTOM,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
      backgroundColor: background,
      textColor: color,
      shadowColor: color
    });

    return () => {
      Toast.hide(toast);
    };
  }, [title, duration, color, background]);

  return null;
}
