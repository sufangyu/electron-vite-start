import { storeToRefs } from 'pinia';

import { ElMessage, UploadRequestOptions } from 'element-plus';

import { VIDEO_STATE, type Video } from '@share/modules';

import { useVideoConfigStore } from '@store/index';

export default () => {
  const { files } = storeToRefs(useVideoConfigStore());

  /**
   * 添加文件
   *
   * @param {UploadRequestOptions} options 上传请求参数，包含文件信息
   * @return {*}
   */
  const addFile = (options: UploadRequestOptions): Promise<Video[]> => {
    const { name = '', path = '' } = options.file;
    files.value.push({ name, path, progress: 0, state: VIDEO_STATE.READY });
    return Promise.resolve(files.value);
  };

  /**
   * 删除文件
   *
   * @param {number} index 文件索引
   */
  const removeFile = async (index: number) => {
    const curFile = files.value[index];
    if (curFile.state === VIDEO_STATE.COMPRESS) {
      ElMessage.warning({ message: '正在压缩不能删除', grouping: true });
      return;
    }

    files.value.splice(index, 1);
  };

  /**
   * 删除所有文件
   */
  const removeAllFiles = async () => {
    files.value = [];
  };

  /**
   * 重置所有文件进度、状态
   */
  const resetAllFiles = async () => {
    files.value.forEach((file) => {
      file.progress = 0;
      file.state = VIDEO_STATE.READY;
    });
  };

  /**
   * 获取状态的背景色
   *
   * @param {Video} video
   * @return {*}
   */
  const getBgColor = (video: Video): string => {
    return {
      [VIDEO_STATE.READY]: '#fff',
      [VIDEO_STATE.COMPRESS]: '#f9f871',
      [VIDEO_STATE.FINISHED]: '#f3a693',
      [VIDEO_STATE.ERROR]: '#55efc4'
    }[video.state!];
  };

  return {
    addFile,
    removeFile,
    removeAllFiles,
    resetAllFiles,
    getBgColor
  };
};
