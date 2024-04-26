export enum IPC_CHANNEL {
  APP = 'ipc-channel:app',
  UPDATER = 'ipc-channel:updater'
}

interface General {
  /** 进程通讯注册情况 */
  ipcRegister: Record<IPC_CHANNEL, boolean>;
}

const general: General = {
  ipcRegister: {
    [IPC_CHANNEL.APP]: false,
    [IPC_CHANNEL.UPDATER]: false
  }
};

export default general;
