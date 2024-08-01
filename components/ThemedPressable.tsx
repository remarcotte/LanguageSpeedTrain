import { Text, Pressable, PressableProps, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedPressableProps = PressableProps & {
  title: string,
  lightColor?: string;
  darkColor?: string;
  fontSize?: number;
};

export function ThemedPressable({
  title,
  fontSize,
  disabled,
  lightColor,
  darkColor,
  ...props
}: ThemedPressableProps) {
  const buttonBackgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'button');
  const buttonTextColor = useThemeColor({ light: lightColor, dark: darkColor }, 'buttonText');

  return (
    <Pressable
      style={[styles.button, { backgroundColor: buttonBackgroundColor }]}
       {...props}>
      <Text
        style={[styles.buttonText, { backgroundColor: buttonBackgroundColor, color: buttonTextColor, fontSize }]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: 320,
    height: 68,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
  },
  button: {
    padding: 8,
    margin: 2,
    borderRadius: 5,
    alignItems: 'center',
    // justifyContent: 'center',
    // paddingVertical: 12,
    // paddingHorizontal: 32,
    // borderRadius: 4,
    // elevation: 3,
  },
  buttonText: {
    fontSize: 16,
    // lineHeight: 21,
    // fontWeight: 'bold',
    // letterSpacing: 0.25,
  },
});
