import { type AppSetting } from '@share/modules/app';
import { appSettingStore } from '@share/store';

export const appApi: AppApi = {
  getAppSetting: () => {
    return Promise.resolve(appSettingStore.store ?? {});
  },
  setAppSetting: (event, data) => {
    console.log(event, data);
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
}
