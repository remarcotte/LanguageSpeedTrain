// Colors.ts

/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    textCorrect: "green",
    textIncorrect: "red",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
    button: "#1D3557",
    buttonText: "#ECEDEE",
    chartBackground: "#f0f0f0",
    chartText: "#3c3c3c",
    inputBackground: "#D1DACE",
    listButtonBackground: "#C1CABE",
    toastSuccess: "#DFF0D8",
    toastDanger: "#F2DEDE",
    toastWarning: "#FCF8E3",
    toastNormal: "#F5F5F5",
    toastSuccessBackground: "#3C763D",
    toastDangerBackground: "#A94442",
    toastWarningBackground: "#8A6D3B",
    toastNormalBackground: "#333333",
  },
  dark: {
    text: "#ECEDEE",
    textCorrect: "lightgreen",
    textIncorrect: "lightcoral",
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    button: "#6200ee",
    buttonText: "#ECEDEE",
    chartBackground: "#333333",
    chartText: "#ffffff",
    inputBackground: "#323232",
    listButtonBackground: "#424242",
    toastSuccess: "#DFF0D8",
    toastDanger: "#F2DEDE",
    toastWarning: "#FCF8E3",
    toastNormal: "#F5F5F5",
    toastSuccessBackground: "#3C763D",
    toastDangerBackground: "#A94442",
    toastWarningBackground: "#8A6D3B",
    toastNormalBackground: "#333333",
  },
};
