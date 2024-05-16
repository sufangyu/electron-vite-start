/* eslint-disable no-case-declarations */
import { WINDOW_NAME } from '@share/modules';
import { appSettingStore } from '@share/store';
import { events } from '@share/utils';
import {
  APP_EVENT_RENDERER_INVOKE,
  APP_IPC_CHANNEL,
  APP_IPC_CHANNEL_EVENT,
  APP_THEME,
  RequestProxyItem
} from '@share/modules/app';
import themeController from './theme.controller';
import commandController from './command.controller';
import requestProxyController from './request-proxy.controller';

console.log(`[STORE] appSetting: ${appSettingStore.path}`);

themeController.initTheme();

events?.on(WINDOW_NAME.APP, APP_IPC_CHANNEL, ({ event, data }) => {
  switch (event) {
    case APP_IPC_CHANNEL_EVENT.SET_THEME:
      const newTheme = data.detail as APP_THEME;
      themeController.setTheme(newTheme);
      break;
    case APP_IPC_CHANNEL_EVENT.SET_REQUEST_PROXY:
      const proxyConfigList = data.detail as RequestProxyItem[];
      requestProxyController.setRequestProxy(proxyConfigList ?? []);
      break;
  }
});

// 监控渲染进程触发的执行命令响应
events?.handle(WINDOW_NAME.ANY, APP_EVENT_RENDERER_INVOKE.RUN_COMMAND, (type, command = '') => {
  return commandController.run(type, command);
});
