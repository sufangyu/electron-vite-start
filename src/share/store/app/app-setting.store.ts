import ElectronStore from 'electron-store';
import {
  APP_SETTING_STORE_NAME,
  APP_SETTING_THEME_KEY,
  APP_THEME,
  type AppSetting
} from '@share/modules';

export default new ElectronStore<AppSetting>({
  name: APP_SETTING_STORE_NAME,
  defaults: {
    [APP_SETTING_THEME_KEY]: APP_THEME.LIGHT
  }
});
