import { IpcData } from '@share/types';
import { EventKey } from 'electron-events';
import { type APP_THEME } from './app.types';

/** 应用级别事件（渲染进程发起） */
export enum APP_EVENT_RENDERER_INVOKE {}

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
