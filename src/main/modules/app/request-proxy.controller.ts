import { globalData } from '@main/global';
import { APP_SETTING_REQUEST_PROXY_KEY, RequestProxyItem } from '@share/modules/app';
import { appSettingStore } from '@share/store';

/**
 * 请求代理/传定向配置
 *
 * @class RequestProxyController
 */
class RequestProxyController {
  private requestProxy: RequestProxyItem[] = [];

  constructor() {
    this.requestProxy = appSettingStore.get(APP_SETTING_REQUEST_PROXY_KEY, []);
    globalData.requestProxyList = this.requestProxy;
  }

  /**
   * 获取配置
   *
   * @return {*}  {RequestProxyItem[]}
   * @memberof RequestProxyController
   */
  getRequestProxy(): RequestProxyItem[] {
    return this.requestProxy;
  }

  /**
   * 设置配置
   *
   * @param {RequestProxyItem[]} proxyConfigList 配置列表
   * @memberof RequestProxyController
   */
  setRequestProxy(proxyConfigList: RequestProxyItem[]) {
    appSettingStore.set(APP_SETTING_REQUEST_PROXY_KEY, proxyConfigList);
    globalData.requestProxyList = proxyConfigList ?? [];
  }
}

export default new RequestProxyController();
