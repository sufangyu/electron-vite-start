<template>
  <section>foo</section>
</template>

<script lang="ts" setup>
import { useEvents } from '@core/hooks';
import {
  WINDOW_NAME,
  TEST_IPC_CHANNEL__RENDERER_SEND_ONE_TO_ONE,
  TEST_IPC_CHANNEL__RENDERER_SEND_ONE_TO_SEVERAL,
  TEST_IPC_CHANNEL__RENDERER_SEND_ONE_TO_ALL,
  TEST_IPC_CHANNEL__RENDERER_INVOKE_ONE_TO_ONE,
  TEST_IPC_CHANNEL__RENDERER_INVOKE_ONE_TO_SEVERAL,
  TEST_IPC_CHANNEL__RENDERER_INVOKE_ONE_TO_ALL
} from '@share/modules';
import { sleep } from '@core/utils';

// 监听/触发事件 ----------------------------------------------------------------------------
const events = useEvents();

// 监听自身发来的事件
events?.on(WINDOW_NAME.APP, TEST_IPC_CHANNEL__RENDERER_SEND_ONE_TO_ONE, () => {
  console.log(
    '[RENDERER_IPC]',
    `收到来自 ${WINDOW_NAME.APP} 上 ${TEST_IPC_CHANNEL__RENDERER_SEND_ONE_TO_ONE} 频道消息`
  );
});

// 监听其他进程发来的事件
events?.on(WINDOW_NAME.APP, TEST_IPC_CHANNEL__RENDERER_SEND_ONE_TO_SEVERAL, () => {
  console.log(
    '[RENDERER_IPC]',
    `收到来自 ${WINDOW_NAME.APP} 上 ${TEST_IPC_CHANNEL__RENDERER_SEND_ONE_TO_SEVERAL} 频道消息`
  );
});

// 监听其他进程发来的事件（全部推送的事件）
events?.on(WINDOW_NAME.APP, TEST_IPC_CHANNEL__RENDERER_SEND_ONE_TO_ALL, () => {
  console.log(
    '[RENDERER_IPC]',
    `收到来自 ${WINDOW_NAME.APP} 上 ${TEST_IPC_CHANNEL__RENDERER_SEND_ONE_TO_ALL} 频道消息`
  );
});

// 监听处理其他进程发来的事件，返回处理结果
events?.handle(WINDOW_NAME.APP, TEST_IPC_CHANNEL__RENDERER_INVOKE_ONE_TO_ONE, (data) => {
  console.log(
    '[RENDERER_IPC]',
    `收到来自 ${WINDOW_NAME.APP} 进程上 ${TEST_IPC_CHANNEL__RENDERER_INVOKE_ONE_TO_ONE} 频道消息`,
    `参数为: ${JSON.stringify(data)}`
  );

  return Promise.resolve({
    message: '处理成功',
    detail: data
  });
});

events?.handle(WINDOW_NAME.APP, TEST_IPC_CHANNEL__RENDERER_INVOKE_ONE_TO_SEVERAL, () => {
  console.log(
    '[RENDERER_IPC]',
    `收到来自 ${WINDOW_NAME.APP} 进程上 ${TEST_IPC_CHANNEL__RENDERER_INVOKE_ONE_TO_SEVERAL} 频道消息`
  );

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        message: '处理成功',
        detail: {
          windowName: 'foo',
          event: TEST_IPC_CHANNEL__RENDERER_INVOKE_ONE_TO_SEVERAL,
          data: [1, 2, 3]
        }
      });
    }, 500);
  });
});

events?.handle(WINDOW_NAME.ANY, TEST_IPC_CHANNEL__RENDERER_INVOKE_ONE_TO_ALL, async () => {
  console.log(
    '[RENDERER_IPC]',
    `收到来自 ${WINDOW_NAME.ANY} 进程上 ${TEST_IPC_CHANNEL__RENDERER_INVOKE_ONE_TO_ALL} 频道消息`
  );

  await sleep(1500);
  return Promise.resolve({
    message: '处理成功',
    detail: {
      windowName: 'foo',
      event: TEST_IPC_CHANNEL__RENDERER_INVOKE_ONE_TO_ALL,
      data: [21, 22, 23]
    }
  });
});
</script>

<style lang="scss" scoped></style>
