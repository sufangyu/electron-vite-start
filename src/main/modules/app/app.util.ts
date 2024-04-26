import { nativeTheme } from 'electron';
import { APP_SETTING_THEME_KEY, appSettingStore } from '@share/store';
import { APP_THEME } from '@share/types';

let theme: APP_THEME = appSettingStore.get(APP_SETTING_THEME_KEY, APP_THEME.LIGHT);
/**
 * 从本地缓存初始化主题
 */
export const initTheme = () => {
  nativeTheme.themeSource = theme;
};

/**
 * 设置主题
 * @param newTheme
 * @returns
 */
export const setTheme = (newTheme: APP_THEME) => {
  if (!theme || theme === newTheme) {
    return;
  }

  theme = newTheme;
  nativeTheme.themeSource = theme;
  appSettingStore.set(APP_SETTING_THEME_KEY, theme);
};
