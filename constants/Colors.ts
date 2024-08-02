/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    button: '#1D3557',
    buttonText: '#ECEDEE',
    chartBackground: '#f0f0f0',
    chartText: '#3c3c3c',
    inputBackground: '#D1DACE',
    listButtonBackground: '#C1CABE',
    toastText: '#000000',
    toastBackground: 'red',
    // toastBackground: '#f0f0f0',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    button: '#6200ee',
    buttonText: '#ECEDEE',
    chartBackground: '#333333',
    chartText: '#ffffff',
    inputBackground: '#323232',
    listButtonBackground: '#424242',
    toastText: '#303030',
    // toastBackground: '#ffffff',
    toastBackground: 'red',
  },
};
