/**
 * 主进程通知渲染进程的频道枚举
 */
export enum MAIN_NOTICE_RENDERER_CHANNEL {
  /** 基础通讯频道 */
  BASE = 'channel:base',
  /** APP频道 */
  APP = 'channel:app',
  /** 窗口频道 */
  WINDOW = 'channel:window',
  /** 更新频道 */
  UPDATER = 'channel:updater',
  /** 视频频道 */
  VIDEO = 'channel:video'
}
