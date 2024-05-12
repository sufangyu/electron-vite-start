import {
  APP_IPC_CHANNEL,
  APP_IPC_CHANNEL_EVENT,
  RequestProxyItem,
  WINDOW_NAME
} from '@share/modules';
import { useEvents } from '@core/hooks';

const events = useEvents();

export default () => {
  /**
   * 拦截重定向配置
   */
  const requestProxy = ref<RequestProxyItem[]>([]);

  /**
   * 设置拦截重定向配置
   * @param proxyConfigList 配置列表
   */
  const setRequestProxy = (proxyConfigList: RequestProxyItem[]) => {
    requestProxy.value = [...proxyConfigList];

    // 通知主进程进行保存
    events?.emitTo(WINDOW_NAME.MAIN, APP_IPC_CHANNEL, {
      event: APP_IPC_CHANNEL_EVENT.SET_REQUEST_PROXY,
      data: {
        message: '设置代理',
        detail: JSON.parse(JSON.stringify(proxyConfigList ?? []))
      }
    });
  };

  return {
    requestProxy,
    setRequestProxy
  };
};
