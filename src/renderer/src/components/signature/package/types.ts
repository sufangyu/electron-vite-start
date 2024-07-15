export interface Options {
  /**
   * 画布高度
   */
  height?: number;
  /**
   * 画笔大小. 默认 4
   *
   * @type {number}
   * @memberof Options
   */
  size?: number;
  /**
   * 画笔颜色. 默认 黑色
   */
  color?: string;
  /**
   * 背景颜色
   *
   * @type {string}
   * @memberof Options
   */
  backgroundColor?: string;
  /**
   * 像素比, 默认是 window.devicePixelRatio, 最大值是 2
   *
   * @memberof Options
   */
  ratio?: number;
}

export interface Props extends Options {}
