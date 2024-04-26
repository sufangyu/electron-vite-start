import { BrowserWindow } from 'electron';
import { WINDOW_NAME, VIDEO_EVENT_RENDERER_INVOKE } from '@share/event';
import Ffmpeg from './ffmpeg.util';
import { events, windowPool } from '../../utils';

let ffmpeg: Ffmpeg | null = null;

// 视频压缩
events?.handle(WINDOW_NAME.ANY, VIDEO_EVENT_RENDERER_INVOKE.COMPRESS, (options) => {
  const curWindow = windowPool.get(options.windowName) || BrowserWindow.getFocusedWindow();
  ffmpeg = new Ffmpeg(curWindow!, options);
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
