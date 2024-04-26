/* eslint-disable no-case-declarations */
import { WINDOW_NAME } from '@share/modules';
import { appSettingStore } from '@share/store';
import { events } from '@share/utils';
import themeController from './theme.controller';
import { APP_IPC_CHANNEL, APP_IPC_CHANNEL_EVENT, APP_THEME } from '@share/modules/app';

console.log(`
  ------------------------------------
   [STORE] appSetting: ${appSettingStore.path}
  ------------------------------------
`);

themeController.initTheme();

events?.on(WINDOW_NAME.APP, APP_IPC_CHANNEL, ({ event, data }) => {
  switch (event) {
    case APP_IPC_CHANNEL_EVENT.SET_THEME:
      const newTheme = data.detail as APP_THEME;
      themeController.setTheme(newTheme);
      break;
  }
});
