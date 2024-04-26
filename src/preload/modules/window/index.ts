import { WINDOW_EVENT_RENDERER_INVOKE, WINDOW_NAME } from '@share/event';
import { WINDOW_ACTION, CreateWindowOptions } from '@share/types';
import { events } from '@share/utils';

export const windowApi: WindowApi = {
  openWindow: (windowOptions) => {
    return events?.invokeTo(WINDOW_NAME.MAIN, WINDOW_EVENT_RENDERER_INVOKE.OPEN, windowOptions);
  },
  operateWindow: (windowId, action) => {
    return events?.invokeTo(WINDOW_NAME.MAIN, WINDOW_EVENT_RENDERER_INVOKE.OPERATE, {
      windowId,
      action
    });
  }
};

export interface WindowApi {
  /**
   * 打开窗口
   * @param options 窗口配置项
   * @returns
   */
  readonly openWindow?: (options: CreateWindowOptions) => void;

  /**
   * 操作窗口
   * @param windowId 窗口ID
   * @param action 操作类型
   * @returns
   */
  readonly operateWindow?: (
    windowId: number,
    action: WINDOW_ACTION
  ) => Promise<boolean | undefined>;
}
