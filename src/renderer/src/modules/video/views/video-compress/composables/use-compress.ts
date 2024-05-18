import { storeToRefs } from 'pinia';

import { ElMessage } from 'element-plus';

import {
  FILE_IPC_CHANNEL_EVENT,
  WINDOW_NAME,
  VEDIO_IPC_CHANNEL,
  VEDIO_IPC_CHANNEL_EVENT,
  VIDEO_STATE,
  type Video
} from '@share/modules';

import { useEvents } from '@core/hooks';
import { useVideoConfigStore } from '@store/index';

const events = useEvents();
let isListened = false;
const isRunning = ref(false);
const isPause = ref(false);

export default () => {
  const { config, files } = storeToRefs(useVideoConfigStore());
  const curCompressVideo = ref<Video>();

  /**
   * 注册主进程监听事件
   */
  const onProgressNotice = () => {
    if (!isListened) {
      isListened = true;
      events?.on(WINDOW_NAME.MAIN, VEDIO_IPC_CHANNEL, ({ event, data }) => {
        console.log('VIDEO_CHANNEL_MAIN_TO_RENDERER =>>', event, data);
        switch (event) {
          case VEDIO_IPC_CHANNEL_EVENT.PROGRESS:
            curCompressVideo.value && (curCompressVideo.value.progress = data?.detail || 0);
            break;
          case VEDIO_IPC_CHANNEL_EVENT.PAUSE:
            ElMessage.info({ message: '视频压缩已暂停', grouping: true });
            isRunning.value = false;
            break;
          case VEDIO_IPC_CHANNEL_EVENT.FINISHED:
            // 压缩完成 => 更新状态、进度
            if (curCompressVideo.value) {
              curCompressVideo.value.progress = 100;
              curCompressVideo.value.state = VIDEO_STATE.FINISHED;
            }

            compressNext();
            break;
          case FILE_IPC_CHANNEL_EVENT.DIRECTORY_EXISTS:
            ElMessage.warning({ message: data?.detail, grouping: true });
            curCompressVideo.value && (curCompressVideo.value.state = VIDEO_STATE.READY);
            isRunning.value = false;
            break;
          case FILE_IPC_CHANNEL_EVENT.FILE_EXISTS:
            ElMessage.warning({ message: data?.detail, grouping: true });
            curCompressVideo.value && (curCompressVideo.value.state = VIDEO_STATE.ERROR);
            compressNext();
            break;
        }
      });
    }
  };

  /**
   * 获取压缩视频文件
   * @returns
   */
  const getCompressFile = () => {
    curCompressVideo.value = files.value.find((file) => file.state === VIDEO_STATE.READY);

    curCompressVideo.value && (curCompressVideo.value.state = VIDEO_STATE.COMPRESS);
  };

  /**
   * 检查是否全部压缩完成
   *
   * @return {*}  {boolean}
   */
  const checkCompressAllFinished = (): boolean => {
    const hasWillCompressFile = files.value.some((file) =>
      [VIDEO_STATE.READY, VIDEO_STATE.ERROR].includes(file.state!)
    );
    if (!hasWillCompressFile) {
      ElMessage.success('视频全部压缩完成');
      isRunning.value = false;
      return true;
    }

    return false;
  };

  /**
   * 压缩视频校验
   *
   * @return {*}  {Promise<boolean>} 验证通过返回true, 否则返回false
   */
  const compressBeforeValidate = (): Promise<boolean> => {
    let errMsg = '';

    if (!curCompressVideo.value) {
      errMsg = '没有待压缩视频';
    }

    if (files.value.length === 0) {
      errMsg = '请选择视频文件';
    }
    if (config.value.videoSaveDirectory === '') {
      errMsg = '请选择保存目录';
    }

    return new Promise((resolve) => {
      const isPass = errMsg === '';
      if (!isPass) {
        ElMessage.warning({ message: errMsg, grouping: true });
      }
      resolve(isPass);
    });
  };

  /**
   * 压缩视频
   *
   * @return {*}  {Promise<void>}
   */
  const compress = async (): Promise<void> => {
    getCompressFile();
    const validatePass = await compressBeforeValidate();
    if (!validatePass) {
      isRunning.value = false;
      return;
    }

    window.api?.videoCompress?.({
      windowName: window.windowInfo?.name || '',
      file: { ...curCompressVideo.value! },
      fps: Number(config.value.fps),
      size: config.value.size,
      saveDirectory: config.value.videoSaveDirectory
    });
  };

  /**
   * 压缩下一个视频
   *
   */
  const compressNext = () => {
    const isAllFinished = checkCompressAllFinished();
    if (isAllFinished) {
      return;
    }

    compress();
  };

  /**
   * 执行压缩
   *
   */
  const run = () => {
    if (isRunning.value) {
      return;
    }
    isRunning.value = true;

    if (isPause.value) {
      continueRun();
    } else {
      compress();
    }
  };

  const continueRun = async () => {
    console.log('继续 =>>', isPause.value);
    if (!isPause.value) {
      return;
    }
    window.api?.videoContinue?.();
    isPause.value = false;
    isRunning.value = true;
  };

  const pause = () => {
    // 只有压缩中才能暂停
    const hasCompressing = files.value.some((file) => file.state === VIDEO_STATE.COMPRESS);
    if (hasCompressing && !isPause.value) {
      window.api?.videoPause?.();
      isPause.value = true;
      isRunning.value = false;
    }
  };

  const resetCompress = () => {
    isPause.value = false;
    isRunning.value = false;
  };

  return {
    isRunning,
    isPause,
    onProgressNotice,
    run,
    continueRun,
    pause,
    resetCompress
  };
};
