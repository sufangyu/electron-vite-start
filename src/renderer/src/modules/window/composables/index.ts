import { ref } from 'vue';
import { WINDOW_ACTION } from '@share/types';
import { WINDOW_IPC_CHANNEL, WINDOW_IPC_CHANNEL_EVENT, WINDOW_NAME } from '@share/event';
import { useEvents } from '@core/hooks';

let isListened = false;
const events = useEvents();

/**
 * 窗口操作
 *
 * @return {*}
 */
const useWindow = () => {
  const isMaxState = ref(false);
  const windowTitle = ref('');

  const _handleWindow = async (action: WINDOW_ACTION) => {
    const res = await window.api?.operateWindow?.(window.windowInfo.id, action);
    console.log(action, res, !!res);
    if ([WINDOW_ACTION.MIN, WINDOW_ACTION.MAX].includes(action)) {
      isMaxState.value = !!res;
    }
  };

  const reloadWindow = () => _handleWindow(WINDOW_ACTION.RELOAD);
  const closeWindow = () => _handleWindow(WINDOW_ACTION.CLOSE);
  const minWindow = () => _handleWindow(WINDOW_ACTION.MIN);
  const maxWindow = () => _handleWindow(WINDOW_ACTION.MAX);
  const fullScreenWindow = () => _handleWindow(WINDOW_ACTION.FULL_SCREEN);
  const simpleFullScreenWindow = () => _handleWindow(WINDOW_ACTION.SIMPLE_FULL_SCREEN);

  // 监听窗口消息
  const onProgressNotice = () => {
    if (!isListened) {
      events.on(WINDOW_NAME.MAIN, WINDOW_IPC_CHANNEL, ({ event, data }) => {
        const actionFunc = {
          [WINDOW_IPC_CHANNEL_EVENT.WINDOW_INFO]: () => {
            const newTitle = data?.detail?.title || '';
            windowTitle.value = newTitle;
          }
        };

        console.log('监听窗口事件', event, data.detail);
        actionFunc[event]?.();
      });
      isListened = true;
    }
  };

  (() => {
    onProgressNotice();
  })();

  return {
    /** 窗口最大化状态 */
    isMaxState,
    windowTitle,
    /** 刷新窗口 */
    reloadWindow,
    /** 关闭窗口 */
    closeWindow,
    /** 最小化窗口 */
    minWindow,
    /** 最大化/恢复窗口 */
    maxWindow,
    fullScreenWindow,
    simpleFullScreenWindow
  };
};

export { useWindow };
