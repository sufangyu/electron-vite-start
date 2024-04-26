import { nativeTheme } from 'electron';
import { appSettingStore } from '@share/store';
import { APP_SETTING_THEME_KEY, APP_THEME } from '@share/modules/app';

class ThemeController {
  private theme: APP_THEME;
  constructor() {
    this.theme = appSettingStore.get(APP_SETTING_THEME_KEY, APP_THEME.LIGHT);
  }

  initTheme() {
    nativeTheme.themeSource = this.theme;
  }

  setTheme(newTheme: APP_THEME) {
    if (!this.theme || this.theme === newTheme) {
      return;
    }

    this.theme = newTheme;
    nativeTheme.themeSource = this.theme;
    appSettingStore.set(APP_SETTING_THEME_KEY, this.theme);
  }
}

export default new ThemeController();
