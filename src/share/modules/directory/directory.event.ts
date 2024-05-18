import { EventKey } from 'electron-events';

import { DIRECTORY_TYPE } from './directory.types';

/** 目录事件（渲染进程发起） */
export const DIRECTORY_EVENT_RENDERER_INVOKE: Readonly<DirectoryEventRendererInvoke> = {
  SELECT: 'directory:select',
  OPEN: 'directory:open'
};

interface DirectoryEventRendererInvoke {
  /**
   * 选择目录
   */
  SELECT: EventKey;

  /**
   * 打开目录
   *
   * - 参数1：目录类型. DIRECTORY_TYPE (logger | store | custom)
   * - 参数2：完整路径（type是custom时需要传）
   */
  OPEN: EventKey<[DIRECTORY_TYPE, string?]>;
}

/** 目录模块频道（主进程 => 渲染进程） */
export const DIRECTORY_IPC_CHANNEL: EventKey = 'directory-ipc-channel';
