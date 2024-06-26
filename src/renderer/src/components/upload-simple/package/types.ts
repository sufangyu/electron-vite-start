export type Props = {
  /**
   * 是否开启拖拽排序, 默认 false
   */
  dragSort?: boolean;
  /**
   * 文件最大限制, 单位 M. 默认值: 5
   */
  maxSize?: number;
  /**
   * 开启切片上传, 默认 true
   */
  multipart?: boolean;
  /**
   * 分片上传边界文件大小, 单位是 M. 默认 5
   */
  chunkSizeLimit?: number;
  /**
   * 初始化文件大小
   */
  modelValue: string[];
};
