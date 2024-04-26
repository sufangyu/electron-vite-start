import { BrowserWindow } from 'electron';
import { WINDOW_NAME, VIDEO_EVENT_RENDERER_INVOKE } from '@share/event';
import { events, windowPool } from '@share/utils';
import FfmpegController from './ffmpeg.controller';

let ffmpeg: FfmpegController | null = null;

// 视频压缩
events?.handle(WINDOW_NAME.ANY, VIDEO_EVENT_RENDERER_INVOKE.COMPRESS, (options) => {
  const curWindow = windowPool.get(options.windowName) || BrowserWindow.getFocusedWindow();
  ffmpeg = new FfmpegController(curWindow!, options);
  ffmpeg.run();
});

// 视频暂停压缩
events?.handle(WINDOW_NAME.ANY, VIDEO_EVENT_RENDERER_INVOKE.PAUSE, () => {
  ffmpeg?.pause();
});

// 视频继续压缩
events?.handle(WINDOW_NAME.ANY, VIDEO_EVENT_RENDERER_INVOKE.CONTINUE, () => {
  ffmpeg?.continue();
});
