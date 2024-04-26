// import { APP_EVENT } from '@share/event';
import { APP_THEME, IpcData } from '@share/types';
import { EventKey } from 'electron-events';

/**
 * 应用级别的事件
 * TODO: 调整至 window 模块
 */
export enum APP_EVENT {
  /** 打开窗口 */
  OPEN_WINDOW = 'app:open-window',
  /** 操作窗口（最小化、最大化、关闭、刷新） */
  OPRATW_WINDOW = 'app:operate-window',
  /** 获取窗口信息 */
  GET_WINDOW_INFO = 'app:get-window-info'
}

/**
 * APP模块通讯频道（渲染进程 <=> 主进程）
 */
export const APP_IPC_CHANNEL: EventKey<{
  event: APP_IPC_CHANNEL_EVENT;
  data: IpcData<APP_THEME | number>;
}> = 'app-ipc-channel';

/**
 * APP模块通讯频道上事件枚举
 */
export enum APP_IPC_CHANNEL_EVENT {
  /** 设置主题 */
  SET_THEME = 'app-ipc-channel-event:set-theme'
}
