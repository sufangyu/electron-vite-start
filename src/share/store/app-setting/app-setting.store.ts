import ElectronStore from 'electron-store';
import { APP_THEME, AppSetting } from '@share/types';
import { APP_SETTING_STORE_NAME, APP_SETTING_THEME_KEY } from './app-setting.constan';

export default new ElectronStore<AppSetting>({
  name: APP_SETTING_STORE_NAME,
  defaults: {
    [APP_SETTING_THEME_KEY]: APP_THEME.LIGHT
  }
});
