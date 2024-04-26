import { DIRECTORY_EVENT_RENDERER_INVOKE, WINDOW_NAME } from '@share/event';
import { events } from '@share/utils';

export const fileApi: FileApi = {
  directorySelect: () => {
    return events?.invokeTo(WINDOW_NAME.MAIN, DIRECTORY_EVENT_RENDERER_INVOKE.SELECT);
  }
};

export interface FileApi {
  /**
   * 选择目录
   * @returns {string} 目录路径
   */
  directorySelect?: () => Promise<string>;
}
