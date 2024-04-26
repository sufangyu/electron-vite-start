import { app, BrowserWindow } from 'electron';
import { electronApp, optimizer } from '@electron-toolkit/utils';
import ElectronStore from 'electron-store';
import createAppMenu from './modules/menus';
import { createAppWindow } from './modules/window';
import './ipc';

ElectronStore.initRenderer();

app.whenReady().then(() => {
  // 设置应用程序的用户模型标识符（App User Model ID）
  electronApp.setAppUserModelId('com.electron');

  // 在开发中默认使用F12打开或关闭DevTools，而在生产中忽略commandcontrol + R
  // 更多查看 https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  createAppWindow();
  createAppMenu();

  app.on('activate', function () {
    // macOS系统下，当点击dock图标时，如果没有其他窗口打开，则重新创建窗口
    if (BrowserWindow.getAllWindows().length === 0) {
      createAppWindow();
    }
  });
});

// 非macOS系统关闭所有窗口时会退出应用。而在 macOS 上，当应用程序的所有窗口都被关闭后，
// 应用程序本身和它在菜单栏通常会保持活跃状态，直到用户通过按下 Cmd + Q 组合键来退出应用程序。
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
