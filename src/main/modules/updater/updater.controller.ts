import { is } from '@electron-toolkit/utils';
import { CancellationToken, UpdateCheckResult, autoUpdater } from 'electron-updater';
import _ from 'lodash';
import { UPDATER_IPC_CHANNEL, UPDATER_IPC_CHANNEL_EVENT, WINDOW_NAME } from '@share/modules';
import { IpcData } from '@share/types';
import { events } from '@share/utils';

class AppUpdaterController {
  private isAutoDownload: boolean;
  private isBackground: boolean;

  constructor() {
    this.isAutoDownload = false;
    this.isBackground = false;

    this.onLifeCycleEvents();
  }

  /**
   * 检查更新
   *
   * @param {BrowserWindow} win
   * @param {boolean} [isBackground=false] 是否背景下载。默认为 false
   * @param {boolean} [isAutoDownload=false] 是否自动下载。默认为 false
   * @return {*}  {(Promise<UpdateCheckResult | null>)}
   * @memberof AppUpdater
   */
  async checkForUpdatesAndNotify(
    isBackground: boolean = false,
    isAutoDownload: boolean = false
  ): Promise<UpdateCheckResult | null> {
    is.dev && this.devHack();

    this.isBackground = isBackground;
    this.isAutoDownload = isAutoDownload;
    autoUpdater.autoDownload = this.isAutoDownload;

    const res = await autoUpdater.checkForUpdatesAndNotify();
    return JSON.parse(JSON.stringify(res));
  }

  /**
   * 手动触发下载更新
   * @returns
   */
  async downloadUpdate(cancellationToken?: CancellationToken) {
    return autoUpdater.downloadUpdate(cancellationToken);
  }

  /**
   * 手动安装更新
   * @param isSilent
   * @param isForceRunAfter
   */
  quitAndInstall(isSilent?: boolean, isForceRunAfter?: boolean) {
    // TODO: 待验证
    autoUpdater.quitAndInstall(isSilent, isForceRunAfter);
  }

  /**
   * 监听生命周期事件
   */
  private onLifeCycleEvents() {
    autoUpdater.on(UPDATER_IPC_CHANNEL_EVENT.ERROR, (err) => {
      console.log('更新发生错误 =>>', err);
      const NOT_EMIT_ERROR_MSG_LIST = [
        // 'Could not locate update bundle for com.github.Electron within'.toLocaleUpperCase()
      ];
      const isIgnoreErr = NOT_EMIT_ERROR_MSG_LIST.some((msg) =>
        err.message.toLocaleUpperCase().startsWith(msg)
      );

      if (isIgnoreErr) {
        return;
      }
      // 网络错误: Error: net::ERR_CONNECTION_REFUSED
      this.noticeToRenderer(UPDATER_IPC_CHANNEL_EVENT.ERROR, {
        message: '更新出现错误',
        detail: err
      });
    });

    autoUpdater.on(UPDATER_IPC_CHANNEL_EVENT.CHECKING, () => {
      this.noticeToRenderer(UPDATER_IPC_CHANNEL_EVENT.CHECKING, {
        message: '开始检查更新',
        detail: null
      });
    });

    autoUpdater.on(UPDATER_IPC_CHANNEL_EVENT.NOT_AVAILABLE, (res) => {
      this.noticeToRenderer(UPDATER_IPC_CHANNEL_EVENT.NOT_AVAILABLE, {
        message: '没有新版本',
        detail: res
      });
    });

    autoUpdater.on(UPDATER_IPC_CHANNEL_EVENT.AVAILABLE, (res) => {
      this.noticeToRenderer(UPDATER_IPC_CHANNEL_EVENT.AVAILABLE, {
        message: '发现新版本',
        detail: {
          ...res,
          isBackground: this.isBackground
        }
      });
    });

    autoUpdater.on(UPDATER_IPC_CHANNEL_EVENT.DOWNLOADING, (progress) => {
      this.noticeToRenderer(UPDATER_IPC_CHANNEL_EVENT.DOWNLOADING, {
        message: '下载中',
        detail: progress
      });
    });

    autoUpdater.on(UPDATER_IPC_CHANNEL_EVENT.DOWNLOADED, async (res) => {
      this.noticeToRenderer(UPDATER_IPC_CHANNEL_EVENT.DOWNLOADED, {
        message: '下载完成',
        detail: res
      });
      // TODO: 自动下载

      // const buttons = [
      //   { label: '确定', value: 'OK' },
      //   { label: '取消', value: 'CANCEL' }
      // ];
      // const { response } = await dialog.showMessageBox({
      //   title: '下载完成',
      //   message: '最新版本已下载完成, 退出程序进行安装',
      //   buttons: buttons.map((item) => item.label)
      // });
      // if (buttons[response].value === 'OK') {
      //   autoUpdater.quitAndInstall();
      // }
    });
  }

  /**
   * 通知渲染进程更新生命周期事件
   *
   * @private
   * @param {UPDATER_EVENT_FOR_NOTICE} event 通知事件
   * @param {MainProcessNoticeCallbackData} data 通知数据
   * @memberof AppUpdater
   */
  private noticeToRenderer(event: UPDATER_IPC_CHANNEL_EVENT, data: IpcData) {
    events?.emitTo(WINDOW_NAME.APP, UPDATER_IPC_CHANNEL, { event, data });
  }

  /**
   * 开发环境 hack
   */
  private devHack() {
    autoUpdater.forceDevUpdateConfig = true;
  }
}

export default new AppUpdaterController();
