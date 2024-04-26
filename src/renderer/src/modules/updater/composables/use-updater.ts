import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useEvents } from '@core/hooks';
import { IpcData } from '@share/types';
import { WINDOW_NAME, UPDATER_IPC_CHANNEL, UPDATER_IPC_CHANNEL_EVENT } from '@share/modules';
import general, { IPC_CHANNEL } from '@renderer/general';
import { UPDATER_STATE, UpdateInfo, Updater } from '../types';

const events = useEvents();

// 默认更新信息
const updateInfoDefault: UpdateInfo = {
  state: UPDATER_STATE.NORMAL,
  title: '',
  content: '',
  progress: 0,
  isForce: false
};
const updateDialogVisible = ref<boolean>(false);
const updater = ref<Updater>({
  versionInfo: {
    currentVersion: window.__APP_VERSION__ ?? '',
    latestVersion: '',
    hasNewVersion: false
  },
  updateInfo: { ...updateInfoDefault }
});

export default () => {
  /**
   * 检测更新
   * @param isBackground 是否后台/静默检查。默认 true
   */
  const checkUpdater = async (isBackground = true) => {
    await window.api?.updaterCheck?.(isBackground);
  };

  /**
   * 手动下载更新
   */
  const downloadUpdate = () => {
    window.api?.downloadUpdate?.();
  };

  /**
   * 手动退出并安装
   */
  const quitAndInstall = () => {
    window.api?.quitAndInstall?.();
  };

  /**
   * 重置更新信息
   */
  const resetUpdateInfo = () => {
    updateDialogVisible.value = false;
    updater.value.updateInfo = { ...updateInfoDefault };
  };

  // 处理更新结果
  const _handleUpdaterResult = (event: UPDATER_IPC_CHANNEL_EVENT, data: IpcData) => {
    console.log('更新过程结果 =>>', event, data);
    switch (event) {
      case UPDATER_IPC_CHANNEL_EVENT.ERROR:
        ElMessage.error(data?.message);
        break;
      case UPDATER_IPC_CHANNEL_EVENT.CHECKING:
        updater.value.updateInfo.state = UPDATER_STATE.CHECKING;
        break;
      case UPDATER_IPC_CHANNEL_EVENT.NOT_AVAILABLE:
        updater.value.updateInfo.state = UPDATER_STATE.CHECKED_FINISHED;
        ElMessage.success(data?.message);
        break;
      case UPDATER_IPC_CHANNEL_EVENT.AVAILABLE:
        // eslint-disable-next-line no-case-declarations
        const { version = '', isBackground = true } = data?.detail ?? {};
        updater.value.versionInfo.hasNewVersion = true;
        updater.value.versionInfo.latestVersion = version;
        updater.value.updateInfo = {
          ...updater.value.updateInfo,
          state: UPDATER_STATE.CHECKED_FINISHED,
          title: '更新提示',
          content: `发现新版本：${version}，现在更新？`
        };

        // 自动下载安装包的位置: /Users/yu/Library/Caches/electron-vite-start-updater/pending
        if (!isBackground) {
          updateDialogVisible.value = true;
        }
        break;
      case UPDATER_IPC_CHANNEL_EVENT.DOWNLOADED:
        updater.value.updateInfo = {
          ...updater.value.updateInfo,
          state: UPDATER_STATE.DOWNLOAD_FINISHED,
          progress: 100
        };
        break;
      default:
    }
  };

  const _onUpdaterIpc = () => {
    if (general.ipcRegister[IPC_CHANNEL.UPDATER]) {
      return;
    }

    general.ipcRegister[IPC_CHANNEL.UPDATER] = true;
    events?.on(WINDOW_NAME.MAIN, UPDATER_IPC_CHANNEL, ({ event, data }) =>
      _handleUpdaterResult(event, data)
    );
  };

  // 初始化
  (() => {
    _onUpdaterIpc();
  })();

  return {
    updateDialogVisible,
    updater,
    resetUpdateInfo,
    checkUpdater,
    downloadUpdate,
    quitAndInstall
  };
};
