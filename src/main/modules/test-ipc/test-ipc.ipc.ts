import { events } from '@share/utils';
import {
  TEST_IPC_CHANNEL__RENDERER_INVOKE_ONE_TO_ALL,
  TEST_IPC_CHANNEL__RENDERER_INVOKE_TO_MAIN,
  TEST_IPC_CHANNEL__RENDERER_SEND_ONE_TO_ALL,
  TEST_IPC_CHANNEL__RENDERER_SEND_TO_MAIN,
  TEST_IPC_CHANNEL__RENDERER_SEND_TO_MAIN_WITH_ARGS,
  WINDOW_NAME
} from '@share/modules';
import { sleep } from '@main/utils';

/**
 * 监听 APP 窗口的渲染进程发送过来的消息
 */
events?.on(WINDOW_NAME.APP, TEST_IPC_CHANNEL__RENDERER_SEND_TO_MAIN, () => {
  console.log(
    '[RENDERER_IPC]',
    `收到来自 ${WINDOW_NAME.APP} 上 ${TEST_IPC_CHANNEL__RENDERER_SEND_TO_MAIN} 频道消息`
  );
});

/**
 * 监听 APP 窗口的渲染进程发送过来的消息-带参数
 */
events?.on(WINDOW_NAME.APP, TEST_IPC_CHANNEL__RENDERER_SEND_TO_MAIN_WITH_ARGS, (options) => {
  console.log(
    '[RENDERER_IPC]',
    `收到来自 ${WINDOW_NAME.APP} 上 ${TEST_IPC_CHANNEL__RENDERER_SEND_TO_MAIN} 频道消息, 参数为: ${JSON.stringify(options)}`
  );
});

/**
 * 监听 APP 窗口的渲染进程发送过来的消息（全部推送的事件）
 */
events?.on(WINDOW_NAME.APP, TEST_IPC_CHANNEL__RENDERER_SEND_ONE_TO_ALL, () => {
  // 往 bar 窗口进程发送消息
  events?.emitTo('window:bar', TEST_IPC_CHANNEL__RENDERER_SEND_ONE_TO_ALL);

  console.log(
    '[RENDERER_IPC]',
    `收到来自 ${WINDOW_NAME.APP} 上 ${TEST_IPC_CHANNEL__RENDERER_SEND_ONE_TO_ALL} 频道消息`
  );
});

/**
 * 监听 APP 窗口的渲染进程发送过来的消息（全部推送的事件）
 */
events?.handle(WINDOW_NAME.APP, TEST_IPC_CHANNEL__RENDERER_INVOKE_TO_MAIN, (data) => {
  console.log(
    '[RENDERER_IPC]',
    `收到来自 ${WINDOW_NAME.APP} 上 ${TEST_IPC_CHANNEL__RENDERER_INVOKE_TO_MAIN} 频道消息`,
    `参数为: ${JSON.stringify(data)}`
  );

  return Promise.resolve({
    message: '处理成功',
    detail: data
  });
});

/**
 * 监听任意窗口的渲染进程发送过来的消息（全部推送的事件）
 */
events?.handle(WINDOW_NAME.ANY, TEST_IPC_CHANNEL__RENDERER_INVOKE_ONE_TO_ALL, async () => {
  console.log(
    '[RENDERER_IPC]',
    `收到来自 ${WINDOW_NAME.ANY} 进程上 ${TEST_IPC_CHANNEL__RENDERER_INVOKE_ONE_TO_ALL} 频道消息`
  );

  await sleep(5000);
  return Promise.resolve({
    message: '处理成功',
    detail: {
      windowName: WINDOW_NAME.MAIN,
      event: TEST_IPC_CHANNEL__RENDERER_INVOKE_ONE_TO_ALL,
      data: [101, 102, 103]
    }
  });
});
