import { EventKey } from 'electron-events';

/** 目录事件（渲染进程发起） */
export const DIRECTORY_EVENT_RENDERER_INVOKE: Readonly<DirectoryEventRendererInvoke> = {
  SELECT: 'directory:select'
};

interface DirectoryEventRendererInvoke {
  /**
   * 选择目录
   */
  SELECT: EventKey;
}

/** 目录模块频道（主进程 => 渲染进程） */
export const DIRECTORY_IPC_CHANNEL: EventKey = 'directory-ipc-channel';
