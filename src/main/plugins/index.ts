import { app } from 'electron';

import apiProxyController from './app/api-proxy.controller';
import appController from './app/app.controller';
import networkController from './app/network.controller';
import extensionController from './extension/extension.controller';
import loggerController from './logger/logger.controller';

loggerController.init();

app.whenReady().then(() => {
  // 网络检查
  networkController.check('baidu.com');

  // 请求代理
  apiProxyController.proxy();

  // 安装 Vue.js DevTools
  extensionController.installPresets('VUEJS_DEVTOOLS');

  // 监听APP生命周期
  appController.onLifecycle();
});
