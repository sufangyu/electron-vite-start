/* eslint-disable no-case-declarations */
import { APP_IPC_CHANNEL, APP_IPC_CHANNEL_EVENT, WINDOW_NAME } from '@share/event';
import { appSettingStore } from '@share/store';
import { initTheme, setTheme } from './app.util';
import { APP_THEME } from '@share/types';
import { events } from '@share/utils';

console.log(`
  ------------------------------------
   [STORE] appSetting: ${appSettingStore.path}
  ------------------------------------
`);

initTheme();

events.on(WINDOW_NAME.APP, APP_IPC_CHANNEL, ({ event, data }) => {
  switch (event) {
    case APP_IPC_CHANNEL_EVENT.SET_THEME:
      const newTheme = data.detail as APP_THEME;
      setTheme(newTheme);
      break;
  }
});
