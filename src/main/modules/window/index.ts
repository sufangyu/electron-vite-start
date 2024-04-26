import { WINDOW_NAME } from '@share/event';
import { WindowController } from './window.controller';

export function createAppWindow(): void {
  const windowController = WindowController.getInstance();
  windowController.createWindow({
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
