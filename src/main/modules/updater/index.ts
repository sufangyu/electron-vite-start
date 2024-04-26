import { BrowserWindow } from 'electron';
import appUpdater from './updater.utils';

/**
 * 应用更新检查
 * @param win 窗口实例
 */
function appUpdaterCheck(win: BrowserWindow) {
  appUpdater.checkForUpdatesAndNotify(win);
}

export default appUpdaterCheck;
