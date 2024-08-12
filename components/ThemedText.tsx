// ThemedText.tsx

import { Text, type TextProps, StyleSheet } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextProps = TextProps & {
  type?:
    | 'head1'
    | 'head2'
    | 'smaller'
    | 'normal'
    | 'normal-bold'
    | 'list-item-title'
    | 'list-item'
    | 'bigger'
    | 'huge';
  lightColor?: string;
  darkColor?: string;
};

export function ThemedText({
  type = 'normal',
  style = {},
  lightColor,
  darkColor,
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        type === 'head1' ? styles.head1 : undefined,
        type === 'head2' ? styles.head2 : undefined,
        type === 'smaller' ? styles.smaller : undefined,
        type === 'normal' ? styles.normal : undefined,
        type === 'normal-bold' ? styles.normalBold : undefined,
        type === 'list-item-title' ? styles.listItemTitle : undefined,
        type === 'list-item' ? styles.listItem : undefined,
        type === 'bigger' ? styles.bigger : undefined,
        type === 'huge' ? styles.huge : undefined,
        { color },
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  head1: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  head2: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  smaller: {
    fontSize: 14,
  },
  normal: {
    fontSize: 16,
    marginBottom: 8,
    marginTop: 8,
    marginLeft: 25,
    marginRight: 25,
  },
  normalBold: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  listItemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  listItem: {
    fontSize: 14,
    marginTop: 4,
    textAlign: 'left',
  },
  bigger: {
    fontSize: 24,
    textAlign: 'center',
    marginVertical: 10,
  },
  huge: {
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
});
