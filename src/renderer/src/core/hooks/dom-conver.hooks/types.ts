/**
 * dom-to-image 配置
 *
 * @export
 * @interface ConverToImageConfig
 */
export interface ConverToImageConfig {
  /**
   * 缩放比例, 默认 1.5
   *
   * @type {number}
   * @memberof ConverToImageConfig
   */
  scale?: number;
  /**
   * 背景色, 默认 '#fff'
   *
   * @type {(string | undefined)}
   * @memberof ConverToImageConfig
   */
  bgcolor?: string | undefined;
  /**
   * 画布宽度, 默认原尺寸
   *
   * @type {(number | undefined)}
   * @memberof ConverToImageConfig
   */
  width?: number | undefined;
  /**
   * 画布高度, 默认原尺寸
   *
   * @type {(number | undefined)}
   * @memberof ConverToImageConfig
   */
  height?: number | undefined;
  /**
   * 自定义样式
   *
   * @type {Partial<CSSStyleDeclaration>}
   * @memberof ConverToImageConfig
   */
  style?: Partial<CSSStyleDeclaration>;
  /**
   * 导出图片质量, 值为0～1之间, 默认是 1 (100%)
   *
   * @type {(number | undefined)}
   * @memberof ConverToImageConfig
   */
  quality?: number | undefined;
  /**
   * 生成失败的占位图片, 默认为 undefined
   *
   * @type {(string | undefined)}
   * @memberof ConverToImageConfig
   */
  imagePlaceholder?: string | undefined;
  /**
   * 启用缓存
   *
   * @type {(boolean | undefined)}
   * @memberof ConverToImageConfig
   */
  cacheBust?: boolean | undefined;
  /**
   * 过滤的节点
   * - 返回 true: 会渲染到图片
   * - 返回 false: 忽略渲染图片
   *
   * @memberof ConverToImageConfig
   */
  filter?: ((node: Element) => boolean) | undefined;
}

/**
 * 生成图片的类型
 */
export type ImageType = 'svg' | 'png' | 'jpeg' | 'bolb' | 'pixel';

/**
 * 转换成图片的配置项
 *
 * @export
 * @interface ConverToImageOptions
 */
export interface ConverToImageOptions {
  /**
   * 生成的文件格式
   *
   * @type {ImageType}
   * @memberof ConverToImageOptions
   */
  type?: ImageType;
  /**
   * 生成中的提示文本
   *
   * @type {string}
   * @memberof ConverToImageOptions
   */
  loadingText?: string;
  /**
   * 生成成功的提示文本
   *
   * @type {string}
   * @memberof ConverToImageOptions
   */
  successText?: string;
  /**
   * 生成错误的提示文本
   *
   * @type {string}
   * @memberof ConverToImageOptions
   */
  errorText?: string;
  /**
   * dom-to-image 配置
   *
   * @type {GenerateImageConfig}
   * @memberof ConverToImageOptions
   */
  config?: ConverToImageConfig;
}

/**
 * 转换成 PDF 的配置项
 *
 * @export
 * @interface ConverToPdfOptions
 */
export interface ConverToPdfOptions {
  /**
   * 文件名, 默认 'PDF'
   *
   * @type {string}
   * @memberof ConverToPdfOptions
   */
  filename?: string;
  /**
   * 四边边距, 默认 8
   *
   * @type {number}
   * @memberof ConverToPdfOptions
   */
  margin?: number;
  /**
   * 是否一页显示, 会缩放图片. 默认 false
   *
   * @type {boolean}
   * @memberof ConverToPdfOptions
   */
  singlePage?: boolean;
  /**
   * 导出中文本, 默认 '导出中...'
   *
   * @type {string}
   * @memberof ConverToPdfOptions
   */
  exportingText?: string;
  /**
   * 导出成功文本, 默认 '导出成功'
   *
   * @type {string}
   * @memberof ConverToPdfOptions
   */
  successText?: string;
  /**
   * 导出失败文本, 默认 ''
   *
   * @type {string}
   * @memberof ConverToPdfOptions
   */
  errorText?: string;
  /**
   * 转换成图片的配置
   *
   * @type {string}
   * @memberof ConverToPdfOptions
   */
  converToImageOptions?: ConverToImageOptions;
}
