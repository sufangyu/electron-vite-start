export interface Updater {
  /** 版本信息 */
  versionInfo: VersionInfo;
  /** 更新信息 */
  updateInfo: UpdateInfo;
}

export interface VersionInfo {
  /** 当前版本号 */
  currentVersion: string;
  /** 有新版本号 */
  latestVersion: string;
  /** 是否有新版本 */
  hasNewVersion: boolean;
}

export interface UpdateInfo {
  /** 更新状态 */
  state: UPDATER_STATE;
  /** 更新标题 */
  title?: string;
  /** 更新描述 */
  content?: string;
  /** 更新进度 */
  progress: number;
  /** 是否强制更新 */
  isForce?: boolean;
}

/** 更新状态 */
export enum UPDATER_STATE {
  NORMAL = 'normal',
  CHECKING = 'checking',
  CHECKED_FINISHED = 'checked-finished',
  DOWNLOADING = 'downloading',
  DOWNLOAD_FINISHED = 'download-finished'
}
