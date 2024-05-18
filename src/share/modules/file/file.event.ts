import { EventKey } from 'electron-events';

import { IpcData } from '@share/types';

/** 文件事件（渲染进程发起） */
export const FILE_EVENT_RENDERER_INVOKE: Readonly<FileEventRendererInvoke> = {};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface FileEventRendererInvoke {}

/** 视频模块频道（主进程 <=> 渲染进程） */
export const FILE_IPC_CHANNEL: EventKey<{
  event: FILE_IPC_CHANNEL_EVENT;
  data: IpcData;
}> = 'file-ipc-channel';

/** 文件广播事件（主进程 <=> 渲染进程）*/
export enum FILE_IPC_CHANNEL_EVENT {
  /** 文件已存在 */
  FILE_EXISTS = 'file-ipc-channel-event:file-exists',
  /** 目录已存在 */
  DIRECTORY_EXISTS = 'file-ipc-channel-event:directory-exists'
}
