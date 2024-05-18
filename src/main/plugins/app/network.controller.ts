import dns2 from 'dns2';

import {
  APP_IPC_CHANNEL,
  APP_IPC_CHANNEL_EVENT,
  WINDOW_NAME,
  NETWORK_STATUS
} from '@share/modules';
import { events } from '@share/utils';

class NextworkController {
  /** dns 实例 */
  private dns: dns2;
  private networkStatus: NETWORK_STATUS;

  constructor() {
    this.dns = new dns2();
    this.networkStatus = NETWORK_STATUS.ONLINE;
  }

  /**
   * 定期执行检查网络状态
   *
   * @param {string} url 检测网址
   * @memberof NextworkController
   */
  check(url: string) {
    setInterval(async () => {
      await this.checkNetworkStatus(url);
    }, 3000);
  }

  /**
   * 检查网络状态
   *
   * - 在线: Online
   * - 离线: Offline
   *
   * @private
   * @param {string} url 检测网址
   * @memberof NextworkController
   */
  private async checkNetworkStatus(url: string) {
    try {
      await this.dns.resolveA(url);
      this.sendNetworkStatusToRenderer(NETWORK_STATUS.ONLINE);
    } catch (_) {
      this.sendNetworkStatusToRenderer(NETWORK_STATUS.OFFLINE);
    }
  }

  /**
   * 向知渲染进程发送网络状态
   *
   * @private
   * @param {NETWORK_STATUS} status 网络状态
   * @memberof NextworkController
   */
  private sendNetworkStatusToRenderer(status: NETWORK_STATUS) {
    if (status === this.networkStatus) {
      return;
    }

    console.log('[NETWORK STATUS] 状态有变化, 通知渲染进程', status);

    this.networkStatus = status;
    events?.emitTo(WINDOW_NAME.ANY, APP_IPC_CHANNEL, {
      event: APP_IPC_CHANNEL_EVENT.CHECK_NETWORK_STATUS,
      data: {
        message: '检查网络状态',
        detail: status
      }
    });
  }
}

export default new NextworkController();
