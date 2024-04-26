import { UPDATER_EVENT_RENDERER_INVOKE, WINDOW_NAME } from '@share/event';
import appUpdater from './updater.utils';
import { events, windowPool } from '@share/utils';
// import { events, windowPool } from '../../utils';

// 更新检查
events?.handle(
  WINDOW_NAME.ANY,
  UPDATER_EVENT_RENDERER_INVOKE.CHECK,
  ({ isBackground, isAutoDownload }) => {
    const curWindowName = windowPool.get(WINDOW_NAME.APP);
    return appUpdater.checkForUpdatesAndNotify(curWindowName!, isBackground, isAutoDownload);
  }
);

// 手动下载更新
events?.handle(
  WINDOW_NAME.ANY,
  UPDATER_EVENT_RENDERER_INVOKE.DOWNLOAD_UPDATE,
  (cancellationToken) => appUpdater.downloadUpdate(cancellationToken)
);

// 手动安装
events?.handle(
  WINDOW_NAME.ANY,
  UPDATER_EVENT_RENDERER_INVOKE.QUIT_AND_INSTALL,
  ({ isSilent, isForceRunAfter }) => appUpdater.quitAndInstall(isSilent, isForceRunAfter)
);
