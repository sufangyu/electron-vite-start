# electron-vite-start

An Electron application with Vue and TypeScript

## 项目设置

### 依赖安装

```bash
$ pnpm install
```

### 开发

```bash
$ pnpm dev
```

### 应用构建

```bash
# For windows
$ pnpm build:win

# For macOS
$ pnpm build:mac

# For Linux
$ pnpm build:linux
```


## 进程通讯

使用 [electron-store](https://www.npmjs.com/package/electron-events) 实现跨进程通讯，其优势有:
- 渲染进程直接可以直接通讯, 无需通过主进程中转
- 一次性向多个进程窗口通讯, 无需多次通讯
- 向指定窗口或者任意进程窗口进程通讯

events 触发时, 需要指定窗口名称, 内置以下两个窗口名称, 后续新创建的窗口不可以再使用这两个窗口名称:
- *: 任意进程窗口
- main: 主进程

如果需要向多个进程窗口通讯时候, 只需要触发事件时传入目标进程窗口数组即可。[更多查看](https://github.com/kisstar/electron-events/blob/main/README-zh_CN.md)

预先了解事情

- 主进程、preload 的events 对象是同一个实例, 统一使用 `@share/utils` 暴露的 `events`.

```ts
// share 定义
import { useEvents } from 'electron-events';
export const events = useEvents();

// 主进程、preload 引入
import { events } from '@share/utils';
```

- 渲染进程通过 preload 在 window 对象上挂载 events, 方便使用, 统一调用 @renderer/core/hooks/events.hooks.ts 暴露的 `useEvents`
```ts
// core/hooks/events.hooks.ts 定义
export const useEvents = () => window.electron?.events;

// 使用
import { useEvents } from '@core/hooks';
const events = useEvents();

// 广播模式
events.on();
events.emit();
events.emitTo();
// 响应模式
events.handle();
events.invoke();
events.invokeTo();
```

### 渲染进程 -> 主进程
1. preload 定义挂载在渲染进程 window 对象下 api 接口

使用 events.invokeTo 定义触发事件，触发事件后将返回一个 promise 对象。在 @preload/modules 下定义, 在 @preload/index.ts 引入使用。
```ts
// options 事件参数
updaterCheck: (options) => {
  return events?.invokeTo( '主进程名称(main)', '事件名称', options);
}
```

2. 主进程定义事件监听

使用 events.handle 监听事件，返回处理结果。

```ts
// response 结果
events?.handle(
  '主进程名称(main) or 任意进程(*)',
  '事件名称',
  (response) => {
    return '结果'
  }
);
```

3. 渲染进程调用
```ts
const result = window.electron?.updaterCheck();
```

### 主进程 -> 渲染进程
1. 渲染进程定义事件监听
```ts
// event 事件名称, data 返回数据
events?.on('主进程名称', '频道名称', ({ event, data }) => {
  return '结果'
});
```

2. 主进程广播触发事件
```ts
// event 事件名称, data 返回数据
events?.emitTo('app渲染进程', '频道名称', { event, data });
```

### 渲染进程 -> 渲染进程
与主进程向渲染进程通讯类似, 只是窗口名称不同

1. 渲染窗口进程-1定义事件监听
```ts
events?.on('窗口2名称', '事件名称', (options) => {
  // do something
});
```

2. 渲染窗口进程-2广播触发事件
```ts
events?.emitTo('窗口1名称', '事件名称', options);
```

### 渲染进程 -> 任何进程
1. 渲染进程、主进程定义事件监听
```ts
// 渲染进程1 监听
events.handle('频道名称/事件名称', (options) => {
  // do something
  return Promise.resolve('结果');
});

// 主进程监听
events.handle(WINDOW_NAME.ANY, '频道名称/事件名称', (options) => {
  // do something
  return Promise.resolve('结果');
});

// 渲染进程2 监听
events.handle(WINDOW_NAME.ANY, '频道名称/事件名称', (options) => {
  // do something
  return Promise.resolve('结果');
});
```

2. 渲染进程1调用
```ts
// WINDOW_NAME.ANY: *
const result: [] = await events.invokeTo(WINDOW_NAME.ANY, '频道名称/事件名称');

// 返回数组中每个为调用结果, 顺序与调用进程窗口顺序一致或者窗口打开顺序一致（main、app、……）, 与处理响应时间无关
```

> ⚠️注意: 
>
> 在向任意进程通讯时, 在当前渲染进程中要监听响应的事情, 否则会报错。




## 规范

### 通讯命名规范

**1. 桥接通讯事件**

主要是指渲染进程调用发起的事件, 通过 preload 桥接转发给到主进程。命名规范如下:

- 事件: [模块]_EVENT_RENDERER_INVOKE

示例:
```ts
// 模块渲染进程触发调用的事件
export const UPDATER_EVENT_RENDERER_INVOKE = {
  CHECK: 'updater:check',
  DOWNLOAD_UPDATE: 'updater:download-update',
  QUIT_AND_INSTALL: 'updater:quit-and-install'
};
```

**2. 进程直接通讯**

由于进程之间的通讯可能会存在多个事件, 所以为单个模块开辟专属通讯频道, 通过传事件参数来区分不同的处理逻辑。命名规范如下:

- 频道: [模块]_IPC_CHANNEL
- 频道事件: [模块]_IPC_CHANNEL_EVENT

示例:
```ts
// 模块专用通讯频道
export const APP_IPC_CHANNEL = 'app-ipc-channel';

// 频道上通讯具体事件
export enum APP_IPC_CHANNEL_EVENT {
  SET_THEME = 'app-ipc-channel-event:set-theme'
}
```


## 开发调试
- 集成 vue.js Devtool（@tomjs/electron-devtools-installer）
- [本地加载 Vue.js Devtools](https://docs.ffffee.com/electron/electron-mastering-5-vue-devtools.html)



## TODO

- [x] 进程通讯、share 类型定义规范化
- [x] 应用更新
- [x] 换肤（浅色、深色、跟随系统）
- [x] 多窗口管理（同窗口加载不同内容、同窗口tab加载内容、窗口最小化/最大化/关闭、外部链接页面-webview）
- [x] 开发模式集成 vuejs-devtool（@tomjs/electron-devtools-installer）
- [x] 进程窗口通讯示例（electron-events）
- [x] 托盘（菜单）
- [ ] 请求封装
- [ ] 包体积优化
- [ ] [桌面小程序](https://zhuanlan.zhihu.com/p/500043550) 
