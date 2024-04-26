import { VideoCompressOptions } from '@share/types';
import { WINDOW_NAME, VIDEO_EVENT_RENDERER_INVOKE } from '@share/event';
import { events } from '@share/utils';

export const videoApi: VideoApi = {
  videoCompress: (options) => {
    return events?.invokeTo(WINDOW_NAME.MAIN, VIDEO_EVENT_RENDERER_INVOKE.COMPRESS, options);
  },
  videoPause: () => {
    return events?.invokeTo(WINDOW_NAME.MAIN, VIDEO_EVENT_RENDERER_INVOKE.PAUSE);
  },
  videoContinue: () => {
    return events?.invokeTo(WINDOW_NAME.MAIN, VIDEO_EVENT_RENDERER_INVOKE.CONTINUE);
  }
};

export interface VideoApi {
  /**
   * 视频压缩
   * @param {VideoCompressOptions} options 压缩配置项
   */
  videoCompress?: (options: VideoCompressOptions) => Promise<void>;

  /**
   * 视频暂停压缩
   */
  videoPause?: () => Promise<void>;

  /**
   * 视频继续压缩（重新开始）
   */
  videoContinue?: () => Promise<void>;
}
