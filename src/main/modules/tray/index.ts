import { BrowserWindow } from 'electron';
import trayController from './tray.controller';

/**
 * 创建托盘
 *
 * @export
 * @param {BrowserWindow} win 主窗口实例
 */
export default function createTray(win: BrowserWindow) {
  trayController.create(win);
}
