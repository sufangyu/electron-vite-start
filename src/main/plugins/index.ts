import { app } from 'electron';
import appController from './app/app.controller';
import apiProxyController from './app/api-proxy.controller';
import networkController from './app/network.controller';
import loggerController from './logger/logger.controller';
import extensionController from './extension/extension.controller';

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
