import { APP_EVENT_RENDERER_INVOKE, COMMAND_TYPE, WINDOW_NAME } from '@share/modules';
import type { AppSetting } from '@share/modules';
import { appSettingStore } from '@share/store';
import { events } from '@share/utils';

export const appApi: AppApi = {
  getAppSetting: () => {
    return Promise.resolve(appSettingStore.store ?? {});
  },
  setAppSetting: (event, data) => {
    console.log(event, data);
  },
  openNetworkSettings: () => {
    return events?.invokeTo(
      WINDOW_NAME.MAIN,
      APP_EVENT_RENDERER_INVOKE.RUN_COMMAND,
      COMMAND_TYPE.OPEN_NETWORK_SETTINGS
    );
  }
};

export interface AppApi {
  /**
   * 获取 APP 设置
   * @returns APP设置信息
   */
  readonly getAppSetting?: () => Promise<AppSetting>;

  /**
   * 设置 APP 设置
   * @param event 事件名称
   * @param data 传递数据
   * @returns
   */
  readonly setAppSetting?: (event: string, data) => void;

  /**
   * 打开网络设置
   *
   * @memberof AppApi
   */
  readonly openNetworkSettings?: () => Promise<string>;
}
