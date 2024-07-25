import { HTMLAttributes } from 'vue';

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Props {
  /**
   * 缓存 Key
   * - 缓存行密度、显示的列
   *
   * @type {string}
   * @memberof Props
   */
  cacheKey?: string;
  /**
   * 表格组件容器属性
   *
   * @type {Record<string, any>}
   * @memberof Props
   */
  tableExtendAttr?: HTMLAttributes;
  /**
   * 是否显示 toolbar 内容, 默认 true
   *
   * @type {boolean}
   * @memberof Props
   */
  toolbarVisible?: boolean;
}

/**
 * 行密度类型
 */
export type LineSize = 'default' | 'medium' | 'small';
