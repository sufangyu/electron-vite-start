/**
 * 生成图片的类型
 */
export type GenerateImageType = 'svg' | 'png' | 'jpeg' | 'bolb' | 'pixel';

/**
 * dom-to-image 配置
 *
 * @export
 * @interface GenerateImageConfig
 */
export interface GenerateImageConfig {
  /**
   * 缩放比例, 默认 1.5
   *
   * @type {number}
   * @memberof GenerateImageConfig
   */
  scale?: number;
  /**
   * 背景色, 默认 '#fff'
   *
   * @type {(string | undefined)}
   * @memberof GenerateImageConfig
   */
  bgcolor?: string | undefined;
  /**
   * 画布宽度, 默认原尺寸
   *
   * @type {(number | undefined)}
   * @memberof GenerateImageConfig
   */
  width?: number | undefined;
  /**
   * 画布高度, 默认原尺寸
   *
   * @type {(number | undefined)}
   * @memberof GenerateImageConfig
   */
  height?: number | undefined;
  /**
   * 样式
   *
   * @type {Partial<CSSStyleDeclaration>}
   * @memberof GenerateImageConfig
   */
  style?: Partial<CSSStyleDeclaration>;
  /**
   * 导出图片质量, 值为0～1之间, 默认是 1 (100%)
   *
   * @type {(number | undefined)}
   * @memberof GenerateImageConfig
   */
  quality?: number | undefined;
  /**
   * 生成失败的占位图片, 默认为 undefined
   *
   * @type {(string | undefined)}
   * @memberof GenerateImageConfig
   */
  imagePlaceholder?: string | undefined;
  cacheBust?: boolean | undefined;
  filter?: ((node: Element) => boolean) | undefined;
}

/**
 * 生成图片的配置项
 *
 * @export
 * @interface GenerateImageOptops
 */
export interface GenerateImageOptops {
  /**
   * 生成的文件格式
   *
   * @type {GenerateImageType}
   * @memberof GenerateImageOptops
   */
  type?: GenerateImageType;
  /**
   * 生成中的提示文本
   *
   * @type {string}
   * @memberof GenerateImageOptops
   */
  loadingText?: string;
  /**
   * 生成成功的提示文本
   *
   * @type {string}
   * @memberof GenerateImageOptops
   */
  successText?: string;
  /**
   * 生成错误的提示文本
   *
   * @type {string}
   * @memberof GenerateImageOptops
   */
  errorText?: string;
  /**
   * dom-to-image 配置
   *
   * @type {GenerateImageConfig}
   * @memberof GenerateImageOptops
   */
  config?: GenerateImageConfig;
}
