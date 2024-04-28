import appUpdaterController from './updater.controller';

/**
 * 应用更新检查
 * @param win 窗口实例
 */
function appUpdaterCheck(isBackground = true, isAutoDownload = false) {
  appUpdaterController.checkForUpdatesAndNotify(isBackground, isAutoDownload);
}

export default appUpdaterCheck;
