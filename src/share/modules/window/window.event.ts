import { EventKey } from 'electron-events';
import { IpcData } from '@share/types';
import { WINDOW_ACTION, type CreateWindowOptions } from './window.types';

export const WINDOW_EVENT_RENDERER_INVOKE: Readonly<WindowEventRendererInvoke> = {
  OPEN: 'window:open',
  OPERATE: 'window:operate'
};

interface WindowEventRendererInvoke {
  /**
   * 打开窗口
   */
  OPEN: EventKey<CreateWindowOptions>;
  /**
   * 操作窗口（最小化、最大化、关闭、刷新）
   */
  OPERATE: EventKey<{ windowId: number; action: WINDOW_ACTION }>;
}

/**
 * 窗口模块频道（主进程 <=> 渲染进程）
 *
 * - data:
 *    - { id: number; name: string; title?: string;} 窗口信息
 */
export const WINDOW_IPC_CHANNEL: EventKey<{
  event: WINDOW_IPC_CHANNEL_EVENT;
  data: IpcData<{
    /** 窗口ID */
    id: number;
    /** 窗口名称 */
    name: string;
    /** 窗口标题 */
    title?: string;
  }>;
}> = 'window-ipc-channel';

/** 窗口广播事件（主进程 => 渲染进程） */
export enum WINDOW_IPC_CHANNEL_EVENT {
  /** 窗口信息 */
  WINDOW_INFO = 'window-ipc-channel-event:window-info'
}

/**
 * 窗口（渲染进程）名称
 *
 * @export
 * @enum {string}
 */
export enum WINDOW_NAME {
  /** 任意窗口/进程 */
  ANY = '*',
  /** 主进程 */
  MAIN = 'main',
  /** 渲染进程窗口 */
  APP = 'window:app'
}
