import { DIRECTORY_EVENT_RENDERER_INVOKE, DIRECTORY_TYPE, WINDOW_NAME } from '@share/modules';
import { events } from '@share/utils';

export const fileApi: FileApi = {
  directorySelect: () => {
    return events?.invokeTo(WINDOW_NAME.MAIN, DIRECTORY_EVENT_RENDERER_INVOKE.SELECT);
  },
  directoryOpen: (type, fullPath) => {
    events?.emitTo(WINDOW_NAME.MAIN, DIRECTORY_EVENT_RENDERER_INVOKE.OPEN, type, fullPath);
  }
};

export interface FileApi {
  /**
   * 选择目录
   * @returns {string} 目录路径
   */
  directorySelect?: () => Promise<string>;

  /**
   * 打开目录
   * @param {DIRECTORY_TYPE} type 目录类型
   * @param {string} fullPath 完整路径（type是custom时需要传）
   * @returns
   */
  directoryOpen?: (type: DIRECTORY_TYPE, fullPath?: string) => void;
}
