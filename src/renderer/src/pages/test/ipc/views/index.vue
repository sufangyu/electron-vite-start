<template>
  <AppMain title="进程/窗口通讯">
    <section class="p-3">
      <Card title="创建窗口">
        <el-button size="small" @click="handleCreateWindow('foo')">Foo 窗口</el-button>
        <el-button size="small" @click="handleCreateWindow('bar')">Bar 窗口</el-button>
      </Card>

      <Card title="发送事件">
        <el-button
          size="small"
          @click="events.emitTo(WINDOW_NAME.MAIN, TEST_IPC_CHANNEL__RENDERER_SEND_TO_MAIN)"
        >
          给主进程发信息
        </el-button>
        <el-button
          size="small"
          @click="
            events.emitTo(WINDOW_NAME.MAIN, TEST_IPC_CHANNEL__RENDERER_SEND_TO_MAIN_WITH_ARGS, {
              message: '给主进程发信息-传数据',
              playload: {
                id: '1007',
                foo: 'bar'
              }
            })
          "
        >
          给主进程发信息-传数据
        </el-button>
        <el-button size="small" @click="events.emit(TEST_IPC_CHANNEL__RENDERER_SEND_TO_SELF)">
          给APP窗口(自身)发信息
        </el-button>
        <el-button
          size="small"
          @click="events.emitTo(WINDOW_LIST.FOO, TEST_IPC_CHANNEL__RENDERER_SEND_ONE_TO_ONE)"
        >
          给Foo窗口发信息
        </el-button>
        <el-button
          size="small"
          @click="events.emitTo(WINDOW_LIST.BAR, TEST_IPC_CHANNEL__RENDERER_SEND_ONE_TO_ONE)"
        >
          给Bar窗口发信息
        </el-button>
      </Card>

      <Card title="广播模式调用（不关心处理结果）">
        <el-button
          size="small"
          @click="
            events.emitTo(
              [WINDOW_LIST.FOO, WINDOW_LIST.BAR],
              TEST_IPC_CHANNEL__RENDERER_SEND_ONE_TO_SEVERAL
            )
          "
        >
          给Foo、Bar窗口发信息
        </el-button>
        <el-button
          size="small"
          @click="events.emitTo(WINDOW_NAME.ANY, TEST_IPC_CHANNEL__RENDERER_SEND_ONE_TO_ALL)"
        >
          给主进程和其他窗口发信息
        </el-button>
      </Card>

      <Card title="响应模式调用（等待处理结果）">
        <el-button size="small" @click="handleInvokeMainEvent">调用进程事件获取数据</el-button>
        <el-button size="small" @click="handleInvokeSelfEvent">调用自身进程事件获取数据</el-button>
        <el-button size="small" @click="handleInvokeFooEvent">调用Foo进程事件获取数据</el-button>
      </Card>

      <Card title="多个进程事件">
        <el-button size="small" @click="handleInvokeWindowsEvent">调用Foo、Bar窗口的事件</el-button>
        <el-button size="small" @click="handleInvokeAllWindowEvent">
          调用主进程和其他窗口事件
        </el-button>
      </Card>
    </section>
  </AppMain>
</template>

<script lang="ts" setup>
import AppMain from '@components/app-main/index.vue';
import Card from '@components/card.vue';
import { useEvents } from '@core/hooks';
import {
  WINDOW_NAME,
  TEST_IPC_CHANNEL__RENDERER_SEND_TO_MAIN,
  TEST_IPC_CHANNEL__RENDERER_SEND_TO_MAIN_WITH_ARGS,
  TEST_IPC_CHANNEL__RENDERER_SEND_TO_SELF,
  TEST_IPC_CHANNEL__RENDERER_SEND_ONE_TO_ONE,
  TEST_IPC_CHANNEL__RENDERER_SEND_ONE_TO_SEVERAL,
  TEST_IPC_CHANNEL__RENDERER_SEND_ONE_TO_ALL,
  TEST_IPC_CHANNEL__RENDERER_INVOKE_TO_MAIN,
  TEST_IPC_CHANNEL__RENDERER_INVOKE_TO_SELF,
  TEST_IPC_CHANNEL__RENDERER_INVOKE_ONE_TO_ONE,
  TEST_IPC_CHANNEL__RENDERER_INVOKE_ONE_TO_SEVERAL,
  TEST_IPC_CHANNEL__RENDERER_INVOKE_ONE_TO_ALL
} from '@share/modules';
import { sleep } from '@core/utils';

enum WINDOW_LIST {
  FOO = 'window:foo',
  BAR = 'window:bar'
}

const handleCreateWindow = (win: string) => {
  const winMap = {
    foo: {
      module: WINDOW_LIST.FOO,
      url: '/test/ipc/foo',
      title: 'Foo 窗口'
    },
    bar: {
      module: WINDOW_LIST.BAR,
      url: '/test/ipc/bar',
      title: 'Bar 窗口'
    }
  };

  window.api?.openWindow?.({
    module: winMap[win].module,
    url: winMap[win].url,
    title: winMap[win].title,
    width: 550,
    height: 600
  });
};

// 监听/触发事件 ----------------------------------------------------------------------------
const events = useEvents();
// 监听自身发来的事件
events.on(TEST_IPC_CHANNEL__RENDERER_SEND_TO_SELF, () => {
  console.log(
    '[RENDERER_IPC]',
    `收到来自本窗口上 ${TEST_IPC_CHANNEL__RENDERER_SEND_TO_SELF} 频道消息`
  );
});

// 监听自身发来的事件（全部推送的事件）
events.on(TEST_IPC_CHANNEL__RENDERER_SEND_ONE_TO_ALL, () => {
  console.log(
    '[RENDERER_IPC]',
    `收到来自本窗口上 ${TEST_IPC_CHANNEL__RENDERER_SEND_ONE_TO_ALL} 频道消息`
  );
});

// 调用事件获取数据 ---------------------------------------------------------
const reqData = { name: '张三疯', age: 18 };

const handleInvokeMainEvent = async () => {
  const result = await events.invokeTo(
    WINDOW_NAME.MAIN,
    TEST_IPC_CHANNEL__RENDERER_INVOKE_TO_MAIN,
    { windlowName: WINDOW_NAME.APP, data: reqData }
  );

  console.log(
    '[RENDERER_IPC]',
    `收到来自主进程 ${TEST_IPC_CHANNEL__RENDERER_INVOKE_TO_MAIN} 频道消息, 返回值: `,
    result
  );
};

events.handle(TEST_IPC_CHANNEL__RENDERER_INVOKE_TO_SELF, (data) => {
  console.log(
    '[RENDERER_IPC]',
    `收到来自自身进程上 ${TEST_IPC_CHANNEL__RENDERER_INVOKE_TO_SELF} 频道消息`,
    `参数为: ${JSON.stringify(data)}`
  );

  return Promise.resolve({
    message: '处理成功',
    detail: data
  });
});
const handleInvokeSelfEvent = async () => {
  const result = await events.invoke(TEST_IPC_CHANNEL__RENDERER_INVOKE_TO_SELF, {
    windlowName: WINDOW_NAME.APP,
    data: reqData
  });

  console.log(
    '[RENDERER_IPC]',
    `收到来自自身进程 ${TEST_IPC_CHANNEL__RENDERER_INVOKE_TO_SELF} 频道消息, 返回值: `,
    result
  );
};

const handleInvokeFooEvent = async () => {
  const result = await events.invokeTo(
    WINDOW_LIST.FOO,
    TEST_IPC_CHANNEL__RENDERER_INVOKE_ONE_TO_ONE,
    { windlowName: WINDOW_NAME.APP, data: reqData }
  );

  console.log(
    '[RENDERER_IPC]',
    `收到来自 ${WINDOW_LIST.FOO} 进程 ${TEST_IPC_CHANNEL__RENDERER_INVOKE_ONE_TO_ONE} 频道消息, 返回值: `,
    result
  );
};

// 调用多窗口/进程事件获取数据 ---------------------------------------------------------
const handleInvokeWindowsEvent = async () => {
  const result = await events?.invokeTo(
    [WINDOW_LIST.FOO, WINDOW_LIST.BAR],
    TEST_IPC_CHANNEL__RENDERER_INVOKE_ONE_TO_SEVERAL
  );
  console.log('调用指定多个窗口/进程:', result);
};

// ⚠️注意: 调用任意窗口/进程时, 必须在当前进程监听该事件, 否则会报错
events?.handle(TEST_IPC_CHANNEL__RENDERER_INVOKE_ONE_TO_ALL, async () => {
  await sleep(3000);
  return Promise.resolve({
    message: '处理成功',
    detail: {
      windowName: WINDOW_NAME.APP,
      event: TEST_IPC_CHANNEL__RENDERER_INVOKE_ONE_TO_ALL,
      data: [1, 2, 3]
    }
  });
});

const handleInvokeAllWindowEvent = async () => {
  // 返回数组中每个为调用结果, 顺序与调用窗口/进程顺序一致或者窗口打开顺序一致（main、app、……）,
  // 与处理响应时间无关
  const result: [] = await events?.invokeTo(
    WINDOW_NAME.ANY,
    TEST_IPC_CHANNEL__RENDERER_INVOKE_ONE_TO_ALL
  );
  console.log('[RENDERER_IPC] 调用任意窗口/进程:', result);
};
</script>

<style lang="scss" scoped></style>
