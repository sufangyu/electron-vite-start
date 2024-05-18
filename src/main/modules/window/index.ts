import { BrowserWindow } from 'electron';

import { WINDOW_NAME } from '@share/modules';

import { WindowController } from './window.controller';

export function createAppWindow(): BrowserWindow {
  const windowController = WindowController.getInstance();
  return windowController.createWindow({
    module: WINDOW_NAME.APP,
    url: '/',
    width: 1000,
    height: 680,
    minWidth: 960,
    minHeight: 640,
    titleBarStyle: 'hiddenInset',
    autoHideMenuBar: true,
    center: true
  });
}
