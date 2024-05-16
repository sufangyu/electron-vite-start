import { IpcData } from '@share/types';
import { EventKey } from 'electron-events';
import { COMMAND_TYPE, NETWORK_STATUS, RequestProxyItem, type APP_THEME } from './app.types';

/** 应用级别事件（渲染进程发起） */
export const APP_EVENT_RENDERER_INVOKE: Readonly<AppEventRendererInvoke> = {
  RUN_COMMAND: 'app:run-command'
};

interface AppEventRendererInvoke {
  /**
   * 执行命令
   *
   * - 参数1：命名类型类型. COMMAND_TYPE
   * - 参数2：命令字符串（type是custom时需要传）
   */
  RUN_COMMAND: EventKey<[COMMAND_TYPE, string?]>;
}

/**
 * APP模块通讯频道（渲染进程 <=> 主进程）
 */
export const APP_IPC_CHANNEL: EventKey<{
  event: APP_IPC_CHANNEL_EVENT;
  data: IpcData<APP_THEME | NETWORK_STATUS | RequestProxyItem[]>;
}> = 'app-ipc-channel';

/**
 * APP模块通讯频道上事件枚举
 */
export enum APP_IPC_CHANNEL_EVENT {
  /** 设置主题 */
  SET_THEME = 'app-ipc-channel-event:set-theme',
  /** 检查网络 */
  CHECK_NETWORK_STATUS = 'app-ipc-channel-event:check-network-theme',
  /** 设置请求代理 */
  SET_REQUEST_PROXY = 'app-ipc-channel-event:set-request-proxy'
}
