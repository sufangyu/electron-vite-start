import appUpdaterController from './updater.controller';

/**
 * 应用更新检查
 * @param win 窗口实例
 */
function appUpdaterCheck() {
  appUpdaterController.checkForUpdatesAndNotify();
}

export default appUpdaterCheck;
