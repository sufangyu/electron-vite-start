export type Props = {
  /**
   * 是否开启拖拽排序, 默认 false
   *
   * @type {boolean}
   */
  dragSort?: boolean;
  /**
   * 文件最大限制, 单位 M. 默认值: 5
   *
   * @type {number}
   */
  maxSize?: number;
  /**
   * 开启切片上传, 默认 true
   *
   * @type {boolean}
   */
  multipart?: boolean;
  /**
   * 分片上传边界文件大小, 单位是 M. 默认 5
   *
   * @type {number}
   */
  chunkSizeLimit?: number;
  /**
   * 初始化文件大小
   *
   * @type {string[]}
   */
  modelValue: string[];
  /**
   * 尺寸, 默认 'default'
   *
   * - default: 146px
   * - small: 100px
   * - mini: 80px
   *
   * @type {('default' | 'small' | 'mini')}
   */
  size?: 'default' | 'small' | 'mini';
};
