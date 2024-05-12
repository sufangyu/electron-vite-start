import { RequestProxyItem } from '@share/modules';

/**
 * 全局数据
 *
 * - 方便跨模块使用
 * - 减少读取本地缓存数据时频繁操作文件
 */
export const globalData: GlobalData = {
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
  isDebug: import.meta.env.MODE === 'debug',
  requestProxyList: []
};

interface GlobalData {
  isDev: boolean;
  isProd: boolean;
  isDebug: boolean;
  /**
   * 请求代理/传定向配置
   *
   * @type {RequestProxyItem[]}
   * @memberof GlobalData
   */
  requestProxyList: RequestProxyItem[];
}
