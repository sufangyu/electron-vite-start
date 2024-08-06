import { InfiniteScrollStatus } from '@core/hooks';

export interface Props {
  /**
   * 当前状态
   *
   * @type {InfiniteScrollStatus}
   * @memberof Props
   */
  status?: InfiniteScrollStatus;
  /**
   * 是否空数据, 默认 false
   *
   * @type {boolean}
   * @memberof Props
   */
  empty?: boolean;
  /**
   * 空数据展示的文本, 默认 '暂无数据'
   *
   * @type {string}
   * @memberof Props
   */
  emptyText?: string;
  /**
   * 正常状态的提示方案. 默认 '下拉加载更多'
   *
   * @type {string}
   * @memberof Props
   */
  normalText?: string;
  /**
   * 加载过程中的提示文案. 默认 '下拉加载更多'
   *
   * @type {string}
   * @memberof Props
   */
  loadingText?: string;
  /**
   * 加载完成后的提示文案. 默认 '没有更多了'
   *
   * @type {string}
   * @memberof Props
   */
  finishedText?: string;
  /**
   * 加载失败后的提示文案. 默认 '加载失败, 请重试'
   *
   * @type {string}
   * @memberof Props
   */
  errorText?: string;
}
