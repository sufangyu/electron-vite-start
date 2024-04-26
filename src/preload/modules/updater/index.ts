import { CancellationToken, UpdateCheckResult } from 'electron-updater';
import { UPDATER_EVENT_RENDERER_INVOKE, WINDOW_NAME } from '@share/event';
import { events } from '@share/utils';

export const updaterApi: UpdaterApi = {
  updaterCheck: (isBackground = true, isAutoDownload = false) => {
    return events?.invokeTo(WINDOW_NAME.MAIN, UPDATER_EVENT_RENDERER_INVOKE.CHECK, {
      isBackground,
      isAutoDownload
    });
  },
  downloadUpdate: (cancellationToken) => {
    return events?.invokeTo(
      WINDOW_NAME.MAIN,
      UPDATER_EVENT_RENDERER_INVOKE.DOWNLOAD_UPDATE,
      cancellationToken
    );
  },
  quitAndInstall: (isSilent, isForceRunAfter) => {
    return events?.invokeTo(WINDOW_NAME.MAIN, UPDATER_EVENT_RENDERER_INVOKE.QUIT_AND_INSTALL, {
      isSilent,
      isForceRunAfter
    });
  }
};

export interface UpdaterApi {
  /**
   * 检查更新
   * @param isBackground 是否后台检查。默认 true
   * @param isAutoDownload 是否自动下载。默认 false
   * @returns
   */
  updaterCheck?: (
    isBackground: boolean,
    isAutoDownload?: boolean
  ) => Promise<UpdateCheckResult | null>;

  /**
   * 手动下载更新
   * @returns
   */
  downloadUpdate?: (cancellationToken?: CancellationToken) => Promise<void>;

  /**
   * 手动安装更新
   * @param isSilent
   * @param isForceRunAfter
   * @returns
   */
  quitAndInstall?: (isSilent?: boolean, isForceRunAfter?: boolean) => void;
}
