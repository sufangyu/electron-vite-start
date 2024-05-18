import { defineStore } from 'pinia';

import { type Video } from '@share/modules';

interface Config {
  /** 视频分辨率配置项 */
  sizeOptions: string[];
  /** 选择的视频分辨率 */
  size: string;
  /** 视频帧数配置项 */
  fpsOptions: string[];
  /** 选择的视频帧数 */
  fps: string;
  /** 视频保存目录 */
  videoSaveDirectory: string;
}

export default defineStore(
  'video-config',
  () => {
    const config = ref<Config>({
      sizeOptions: ['1920x1080', '1024x720'],
      size: '1920x1080',
      fpsOptions: ['60', '30'],
      fps: '60',
      videoSaveDirectory: ''
    });

    /** 视频文件列表 */
    const files = ref<Video[]>([]);

    return { config, files };
  },
  {
    persist: {
      paths: ['config']
    }
  }
);
