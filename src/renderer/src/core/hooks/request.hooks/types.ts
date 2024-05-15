/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Ref } from 'vue';
import { HttpResponse } from '@renderer/core/http/types';

/**
 * 请求响应结果
 *
 * - normal: 常规
 * - error: 请求错误
 * - success: 请求成功-处理成功
 * - fail: 请求成功-处理失败
 */
export type RequestStatus = 'normal' | 'error' | 'success' | 'fail';

/**
 * 通用请求 Hooks 参数
 *
 * @interface Options
 * @template T 返回值类型
 * @template P 参数类型
 */
export interface BaseRequestOptions<T = any, P = any> {
  request: {
    /** 请求函数 */
    api: (...args: any[]) => Promise<HttpResponse<T>>;
    /** 请求参数 */
    params?: P;
    /** 参数校验 */
    handleValidate?: (params: P) => boolean;
    /** 处理参数 */
    handleParams?: (params: P) => P;
  };
  response?: {
    /**
     * 处理响应结果
     * @param {T} data 接口响应体
     * @returns {T}
     */
    handleResponseData?: (data?: T) => T;
  };
}

/**
 * 通用请求 Hooks 返回值
 *
 * @interface BaseRequesReturn
 */
export interface BaseRequesReturn<T = any, P = any> {
  /**
   * 请求参数
   *
   * @type {Ref<P>}
   * @memberof BaseRequesReturn
   */
  params: Ref<P>;
  /**
   * 是否请求中
   *
   * @type {Ref<boolean>}
   * @memberof BaseRequesReturn
   */
  loading: Ref<boolean>;
  /**
   * 请求响应结果
   *
   * @type {Ref<RequestStatus>}
   * @memberof BaseRequesReturn
   */
  resultStatus: Ref<RequestStatus>;
  /**
   * 响应结果数据
   *
   * @type {(Ref<T | undefined>)}
   * @memberof BaseRequesReturn
   */
  data: Ref<T | undefined>;
  /**
   * 触发请求函数
   *
   * @memberof BaseRequesReturn
   */
  handleRequest: () => Promise<HttpResponse<T> | null>;
}

/**
 * 列表请求 Hooks 参数
 *
 * @interface Options
 * @template T 返回值类型
 * @template P 参数类型
 * @template L 列表单项类型
 */
export interface ListRequestOptions<T = any, P = any, L = any> {
  /**
   * 是否更新页面 URL
   *
   * 主要用于记录查询条件. 默认 false
   *
   * @type {boolean}
   * @memberof ListRequestOptions
   */
  isUpdatePageUrl?: boolean;
  request: {
    /**
     * 请求函数
     * @param args 参数
     * @returns
     */
    api: (...args: any[]) => Promise<HttpResponse<T>>;
    /**
     * 请求参数
     *
     * @type {P}
     */
    params?: P;
    /**
     * 页码 Key. 默认 `pageNum`
     *
     * @type {string}
     */
    pageNumKey?: string;
    /**
     * 页数大小. 默认 `pageSize`
     *
     * @type {string}
     */
    pageSizeKey?: string;
    /**
     * 参数校验
     * @param {P} params
     * @returns {boolean}
     */
    handleValidate?: (params: P) => boolean;
    /**
     * 处理参数函数
     * @param {P} params 参数
     * @returns {P}
     */
    handleParams?: (params: P) => P;

    /**
     * 自定义重置参数方法
     * @param defaultParams 初始参数
     * @param params 复制处理后的参数
     * @returns
     */
    handleCustomResetParams?: (defaultParams: P, params: P) => P;
  };
  response?: {
    /**
     * 列表数据 默认 data.list
     *
     * 例: 响应数据为 { data: { list: [] } } 则传递 data.list;
     */
    listKey?: string;
    /**
     * 总条数 默认 data.total
     * 例: 响应数据为 { data: { list: [], total: 0 } } 则传递 data.total;
     */
    totalKey?: string;
    /**
     * 处理响应结果
     * @param {L[]} list 接口响应体列表数据
     * @returns {L[]}
     */
    handleResponseData?: (list?: L[]) => L[];
  };
}

/**
 * 列表请求 Hooks 返回值
 *
 * @export
 * @interface ListRequesReturn
 * @template T 请求返回值类型
 * @template P 参数类型
 * @template L 请求列表 Item 类型
 */
export interface ListRequesReturn<T = any, P = any, L = any> {
  /**
   * 请求参数
   *
   * @type {Ref<P>}
   * @memberof ListRequesReturn
   */
  params: Ref<P>;
  /**
   * 是否请求中
   *
   * @type {Ref<boolean>}
   * @memberof ListRequesReturn
   */
  loading: Ref<boolean>;
  /**
   * 请求响应结果
   *
   * @type {Ref<RequestStatus>}
   * @memberof ListRequesReturn
   */
  resultStatus: Ref<RequestStatus>;
  /**
   * 列表数据
   *
   * @type {Ref<L[]>}
   * @memberof ListRequesReturn
   */
  list: Ref<L[]>;
  /**
   * 列表总条数
   *
   * @type {Ref<number>}
   * @memberof ListRequesReturn
   */
  listTotal: Ref<number>;
  /**
   * 搜索
   * @param {number} pageNum 页码
   * @param {boolean} isReset 是否是重置操作
   * @returns
   * @memberof ListRequesReturn
   */
  handleSearch: (pageNum?: number, isReset?: boolean) => Promise<HttpResponse<T> | null>;
  /**
   * 重置
   *
   * @memberof ListRequesReturn
   */
  handleReset: () => Promise<HttpResponse<T> | null>;
  /**
   * 页面切换查询
   * @param {number} pageNum 页码
   * @returns
   * @memberof ListRequesReturn
   */
  handleCurrentChange: (pageNum: number) => Promise<HttpResponse<T> | null>;
  /**
   * 页面条数切换查询
   * @param {number} pageSize 条数
   * @returns
   * @memberof ListRequesReturn
   */
  handleSizeChange: (pageSize: number) => Promise<HttpResponse<T> | null>;
}
