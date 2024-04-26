import { EventKey } from 'electron-events';
import {
  CancellationToken,
  ProgressInfo,
  UpdateDownloadedEvent,
  UpdateInfo
} from 'electron-updater';
import { IpcData } from '@share/types';

/** 视频事件（渲染进程发起） */
export const UPDATER_EVENT_RENDERER_INVOKE: Readonly<UpdaterEventRendererInvoke> = {
  CHECK: 'updater:check',
  DOWNLOAD_UPDATE: 'updater:download-update',
  QUIT_AND_INSTALL: 'updater:quit-and-install'
};

interface UpdaterEventRendererInvoke {
  /**
   * 更新检查
   *
   * - isBackground: 后台/静默检查
   * - isAutoDownload: 自动下载
   */
  CHECK: EventKey<{ isBackground: boolean; isAutoDownload: boolean }>;
  /**
   * 手动下载更新
   *
   * - cancellationToken: 取消下载对象
   */
  DOWNLOAD_UPDATE: EventKey<CancellationToken | undefined>;
  /**
   * 手动安装
   *
   * - isSilent: 静默安装
   * - isForceRunAfter: 退出时强制运行安装
   */
  QUIT_AND_INSTALL: EventKey<{ isSilent?: boolean; isForceRunAfter?: boolean }>;
}

/**
 * 应用更新模块通讯频道（渲染进程 <=> 主进程）
 *
 * 使用: 更新生命周期事件 & 触发渲染进程对应事件
 */
export const UPDATER_IPC_CHANNEL: EventKey<{
  event: UPDATER_IPC_CHANNEL_EVENT;
  /**
   * 返回信息
   *
   * - UpdateInfo: 更新信息
   * - ProgressInfo: 下载进度
   * - UpdateDownloadedEvent: 下载更新信息
   * - Error: 错误信息
   *
   * @type {(IpcData<UpdateInfo | ProgressInfo | UpdateDownloadedEvent | Error | null>)}
   */
  data: IpcData<UpdateInfo | ProgressInfo | UpdateDownloadedEvent | Error | null>;
}> = 'updater-ipc-channel';

/**
 * 应用更新模块通讯频道上事件枚举
 *
 */
export enum UPDATER_IPC_CHANNEL_EVENT {
  /** 错误 */
  ERROR = 'error',
  /** 开始检查 */
  CHECKING = 'checking-for-update',
  /** 没有新版本 */
  NOT_AVAILABLE = 'update-not-available',
  /** 发现新版本 */
  AVAILABLE = 'update-available',
  /** 下载进度 */
  DOWNLOADING = 'download-progress',
  /** 下载完成 */
  DOWNLOADED = 'update-downloaded'
}
