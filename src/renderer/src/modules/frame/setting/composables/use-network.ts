import general, { IPC_CHANNEL } from '@renderer/general';
import {
  APP_IPC_CHANNEL,
  APP_IPC_CHANNEL_EVENT,
  NETWORK_STATUS,
  WINDOW_NAME
} from '@share/modules';

import { useEvents } from '@core/hooks';

const events = useEvents();
const networkStatus = ref<NETWORK_STATUS>(NETWORK_STATUS.ONLINE);

export default () => {
  // 监听网络状态改变事件
  const _onNetworkChange = () => {
    if (general.ipcRegister[IPC_CHANNEL.APP]) {
      return;
    }

    general.ipcRegister[IPC_CHANNEL.APP] = true;
    events?.on(WINDOW_NAME.MAIN, APP_IPC_CHANNEL, ({ event, data }) => {
      if (event === APP_IPC_CHANNEL_EVENT.CHECK_NETWORK_STATUS) {
        const curStatus = data?.detail as NETWORK_STATUS;
        networkStatus.value = curStatus;
      }
    });
  };

  const openNetworkSettings = async () => {
    window.api?.openNetworkSettings?.();
  };

  (() => {
    _onNetworkChange();
  })();

  return {
    networkStatus,
    openNetworkSettings
  };
};
