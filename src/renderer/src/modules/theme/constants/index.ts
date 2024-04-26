import { APP_THEME } from '@share/modules';

export const themeOptions: { label: string; value: APP_THEME }[] = [
  { label: '浅色', value: APP_THEME.LIGHT },
  { label: '深色', value: APP_THEME.DARK },
  { label: '系统', value: APP_THEME.SYSTEM }
];
