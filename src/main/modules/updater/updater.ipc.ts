import { UPDATER_EVENT_RENDERER_INVOKE, WINDOW_NAME } from '@share/event';
import { events } from '@share/utils';
import appUpdaterController from './updater.controller';

// 更新检查
events?.handle(
  WINDOW_NAME.ANY,
  UPDATER_EVENT_RENDERER_INVOKE.CHECK,
  ({ isBackground, isAutoDownload }) => {
    return appUpdaterController.checkForUpdatesAndNotify(isBackground, isAutoDownload);
  }
);

// 手动下载更新
events?.handle(
  WINDOW_NAME.ANY,
  UPDATER_EVENT_RENDERER_INVOKE.DOWNLOAD_UPDATE,
  (cancellationToken) => appUpdaterController.downloadUpdate(cancellationToken)
);

// 手动安装
events?.handle(
  WINDOW_NAME.ANY,
  UPDATER_EVENT_RENDERER_INVOKE.QUIT_AND_INSTALL,
  ({ isSilent, isForceRunAfter }) => appUpdaterController.quitAndInstall(isSilent, isForceRunAfter)
);
