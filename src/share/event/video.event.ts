import { EventKey } from 'electron-events';
import { IpcData, VideoCompressOptions } from '@share/types';
import { FILE_IPC_CHANNEL_EVENT } from './file.event';

/**
 * 视频事件（渲染进程发起）
 */
export const VIDEO_EVENT_RENDERER_INVOKE: Readonly<VideoEventRendererInvoke> = {
  COMPRESS: 'video:compress',
  PAUSE: 'video:pause',
  CONTINUE: 'video:continue'
};

interface VideoEventRendererInvoke {
  /**
   * 视频-压缩
   */
  COMPRESS: EventKey<VideoCompressOptions>;
  /**
   * 视频-暂停压缩
   */
  PAUSE: EventKey;
  /**
   * 视频-继续压缩
   */
  CONTINUE: EventKey;
}

/**
 * 视频模块频道（主进程 <=> 渲染进程）
 */
export const VEDIO_IPC_CHANNEL: EventKey<{
  event: VEDIO_IPC_CHANNEL_EVENT | FILE_IPC_CHANNEL_EVENT;
  data: IpcData;
}> = 'video-ipc-channel';

/** 视频广播事件（主进程 <=> 渲染进程） */
export enum VEDIO_IPC_CHANNEL_EVENT {
  /** 暂停压缩 */
  PAUSE = 'video-ipc-channel-event:pause',
  /** 压缩进度 */
  PROGRESS = 'video-ipc-channel-event:progress',
  /** 压缩完成 */
  FINISHED = 'video-ipc-channel-event:finished',
  /** 压缩错误 */
  ERROR = 'video-ipc-channel-event:error'
}
