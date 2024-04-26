import { WINDOW_EVENT_RENDERER_INVOKE, WINDOW_NAME } from '@share/event';
import { WINDOW_ACTION } from '@share/types';
import { events, windowPool } from '@share/utils';
import { WindowController } from './window.controller';

const windowController = WindowController.getInstance();

// 打开窗口
events?.handle(WINDOW_NAME.ANY, WINDOW_EVENT_RENDERER_INVOKE.OPEN, (options) => {
  windowController.createWindow(options);
});

// 操作窗口
events?.handle(WINDOW_NAME.ANY, WINDOW_EVENT_RENDERER_INVOKE.OPERATE, ({ windowId, action }) => {
  const curWindow = windowPool.get(windowId);
  const actionMap = {
    [WINDOW_ACTION.RELOAD]: () => curWindow?.reload(),
    [WINDOW_ACTION.CLOSE]: () => curWindow?.close(),
    [WINDOW_ACTION.MIN]: () => curWindow?.minimize(),
    [WINDOW_ACTION.MAX]: () => {
      // 最大化/恢复窗口
      if (curWindow?.isMaximized()) {
        curWindow?.unmaximize();
        return false;
      } else {
        curWindow?.maximize();
        return true;
      }
    },
    [WINDOW_ACTION.FULL_SCREEN]: () => {
      curWindow?.setFullScreen(!curWindow?.isFullScreen());
    },
    [WINDOW_ACTION.SIMPLE_FULL_SCREEN]: () => {
      curWindow?.setSimpleFullScreen(!curWindow?.isSimpleFullScreen());
    }
  };
  return actionMap[action]?.();
});
