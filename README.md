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
$ pnpm build-debug:win  # debug 包
$ pnpm build:win        # release 包

# For macOS
$ pnpm build-debug:mac  # debug 包
$ pnpm build:mac        # release 包

# For Linux
$ pnpm build-debug:linux  # debug 包
$ pnpm build:linux        # release 包
```

## 目录结构

```bash
├─ resources                                # 资源文件
│  ├─ icon.png                              # icon 图标, 可执行npm run electron:generate-icons命令在 .icons/ 下生成其他格式图片
│  ├─ tray-empty.png                        # 托盘空图标, 用于实现闪烁
│  └─ tray@2x.png                           # 托盘图标
│
├─ scripts                                  # 辅助脚本
│  ├─ ......
│  └─ module.js                             # 初始化模块脚本
│
├─ src                                      # 渲染进程源码
│  ├─ main                                  # 主进程功能
│  │  ├─ modules                            # 功能模块
│  │  │  ├─ app/app.ipc.ts                  # APP模块 进程通讯
│  │  │  ├─ app/proxy.controller.ts         # APP模块 代理控制器
│  │  │  ├─ app/theme.controller.ts         # APP模块 主题控制器
│  │  │  ├─ app/*.theme.controller.ts       # APP模块 其他控制器
│  │  │  ├─ app/app.index.ts                # APP模块 统一入口文件
│  │  │  │
│  │  │  ├─ menus/config/                   # 应用菜单配置项
│  │  │  ├─ menus/menu.controller.ts        # 应用菜单控制器
│  │  │  ├─ menus/index.ts                  # 应用菜单入口（创建应用菜单）
│  │  │  │
│  │  │  ├─ tray/tray.controller.ts         # 托盘菜单控制器
│  │  │  ├─ tray/index.ts                   # 托盘菜单入口（创建托盘菜单）
│  │  │  │
│  │  │  ├─ updater/updater.controller.ts   # 更新模块控制器
│  │  │  ├─ updater/updater.ipc.ts          # 更新模块 进程通讯
│  │  │  ├─ updater/index.ts                # 更新模块（创建应用菜单）
│  │  │  │
│  │  │  └─ ......
│  │  │
│  │  ├─ plugins                            # 功能增强扩展（辅助功能）
│  │  │  ├─ app/api-proxy.controller.ts     # APP 拦截渲染进程 API, 处理请求 URL 转发、请求头
│  │  │  ├─ app/app.controller.ts           # APP 生命周期监听
│  │  │  ├─ extension/                      # 浏览器插件（目前支持 Vue.js devtools）
│  │  │  ├─ logger/                         # 日志
│  │  │  └─ index.ts                        # 入口文件（使用增强扩展辅助功能）
│  │  │
│  │  ├─ utils/                             # 工具类/函数
│  │  │
│  │  ├─ global.ts                          # 全局数据（跨模块使用、减少频繁读取本地缓存文件）
│  │  ├─ ipc.ts                             # 注册监听进程通讯（TODO: 动态导入）
│  │  └─ index.ts                           # 入口文件（创建应用）
│  │
│  │
│  ├─ preload                               # 预加载脚本, 增强渲染进程功能
│  │  ├─ modules                            # 功能模块
│  │  │  ├─ ......
│  │  │  └─ index.ts                        # 全部模块入口文件
│  │  │
│  │  ├─ index.d.ts                         # 声明文件（渲染进程 window 对象扩展）
│  │  └─ index.ts                           # 注册增强渲染进程功能
│  │
│  │
│  ├─ renderer                              # 渲染进程功能
│  │  ├─ src
│  │  │  ├─ assets                          # 资源
│  │  │  ├─ components                      # 全局组件
│  │  │  │  ├─ ......
│  │  │  │  └─ glob-components.ts           # 注册全局组件
│  │  │  │
│  │  │  ├─ core                            # 核心代码（非业务相关）
│  │  │  │  ├─ constans/global.ts           # 全局静态数据(IS_DEV、IS_PROD、IS_DEBUG)
│  │  │  │  │
│  │  │  │  ├─ hooks/                       # 全局 Hooks
│  │  │  │  ├─ hooks/request.hooks          # 请求 Hooks
│  │  │  │  ├─ hooks/
│  │  │  │  ├─ hooks/index.ts               # 全局 Hooks 统一入口
│  │  │  │  │
│  │  │  │  ├─ http/                        # 网络请求（列表、通用）
│  │  │  │  ├─ http/index.ts                # 网络请求 入口文件
│  │  │  │  │
│  │  │  │  ├─ plugins/                     # 插件（辅助功能增强）
│  │  │  │  ├─ plugins/index.ts             # 插件 入口文件
│  │  │  │  │
│  │  │  │  ├─ utils/                       # 工具类/函数（按类型分, 如: number.util、string.util、validate.util等）
│  │  │  │  └─ utils/index.ts               # 工具类/函数 入口文件
│  │  │  │
│  │  │  ├─ layout                          # 布局
│  │  │  │  ├─ main/                        # 主布局（左右栏）
│  │  │  │  ├─ window                       # 自定义窗口布局（toolbar）
│  │  │  │  ├─ empty.vue                    # 空布局
│  │  │  │  └─ utils/index.ts               # 工具类/函数 入口文件
│  │  │  │
│  │  │  ├─ modules                         # 功能模块
│  │  │  │  ├─ common/                      # 公用模块（不参与具体业务）
│  │  │  │  │
│  │  │  │  ├─ frame/account/               # 账号模块
│  │  │  │  ├─ frame/account/api/           # 模块 请求方法
│  │  │  │  ├─ frame/account/composables/   # 模块 逻辑模块
│  │  │  │  ├─ frame/account/constant/      # 模块 常量
│  │  │  │  ├─ frame/account/permission/    # 模块 权限配置
│  │  │  │  ├─ frame/account/types/         # 模块 类型定义
│  │  │  │  ├─ frame/account/views/         # 模块 页面
│  │  │  │  ├─ frame/account/index.ts       # 模块 入口文件, 对外暴露除非 views 外的能力
│  │  │  │  │
│  │  │  │  └─ ......
│  │  │  │
│  │  │  ├─ router/index.ts                 # 路由注册
│  │  │  │
│  │  │  ├─ store/                          # 全局数据
│  │  │  │  ├─ modules/                     # 模块数据
│  │  │  │  ├─ modules/account.store.ts     # 账号模块 数据
│  │  │  │  └─ index.ts                     # 全局数据 入口文件
│  │  │  │
│  │  │  ├─ App.vue
│  │  │  ├─ auto-imports.d.ts               # unplugin-auto-import 自动生成的声明文件
│  │  │  ├─ components.d.ts                 # 全局组件声明文件
│  │  │  ├─ general.ts                      # 与业务相关的全局数据（判断是否已注册通讯事件）
│  │  │  └─ main.ts
│  │  │
│  │  └─ index.html
│  │
│  │
│  └─ share                                 # 公用/共享模块
│     ├─ modules                            # 功能模块
│     │  ├─ app/app.constant.ts             # APP模块 常量
│     │  ├─ app/app.events.ts               # APP模块 通讯事件
│     │  ├─ app/app.types.ts                # APP模块 类型定义
│     │  ├─ app/app.index.ts                # APP模块 统一入口文件
│     │  ├─ ......
│     │  └─ index.ts                        # 全部模块入口文件
│     │
│     ├─ store                              # 主进程缓存文件数据
│     │  ├─ app/app-setting.store.ts        # app 模块
│     │  ├─ app/index.ts                    # 统一入口文件
│     │  └─ index.ts                        # 全部缓存统一入口文件
│     │
│     ├─ types                              # 类型
│     │  ├─ base.types.ts                   # 基础类型定义
│     │  └─ index.ts                        # 统一入口文件
│     │
│     └─ utils                              # 工具类/函数
│        ├─ events.util.ts                  # 进程通讯事件
│        ├─ validate.util.ts                # 校验类
│        ├─ ......
│        └─ index.ts                        # 统一入口文件
│
├─ .env                                     # env 配置文件
├─ env.d.ts                                 # env 配置生命周期文件
└─ package.json
```

## 进程通讯

使用 [electron-store](https://www.npmjs.com/package/electron-events) 实现跨进程通讯，其优势有:

- 渲染进程直接可以直接通讯, 无需通过主进程中转
- 一次性向多个进程窗口通讯, 无需多次通讯
- 向指定窗口或者任意进程窗口进程通讯

events 触发时, 需要指定窗口名称, 内置以下两个窗口名称, 后续新创建的窗口不可以再使用这两个窗口名称:

- \*: 任意进程窗口
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
  return events?.invokeTo('主进程名称(main)', '事件名称', options);
};
```

2. 主进程定义事件监听

使用 events.handle 监听事件，返回处理结果。

```ts
// response 结果
events?.handle('主进程名称(main) or 任意进程(*)', '事件名称', (response) => {
  return '结果';
});
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
  return '结果';
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

## 网络请求

渲染进程的网络请求基于 `axios` 封装, 统一封装了 `get`、 `post`、 `put`、 `delete` 等请求方法, 并且提供了通用的请求方法 `request` 。

并且支持一下双 token（accessToken、refreshToken）, 当某个请求出现出现 token 过期时, 会把请求失败和后续的请求缓存到一个队列中, 再刷新 token 并且更新双 token后, 重新遍历请求缓存队列去重新发起请求。

**使用配置**

双 token 的开启或者关闭主要是在初始化拦截器实例时控制, 传入 `refreshTokenUrl` 参数值时代表开启 token, 不传时代表关闭.

> 主要修改文件: src/renderer/src/core/http/interceptors.ts
>
> 目前判断 token 过期的条件是 http 状态码为 403, 而未登录的条件是 http 状态码为 401

```ts
// 开启双 token

export default new Interceptors({
  refreshTokenUrl: '/api/token/refresh'
});

// 关闭双 token
export default new Interceptors();
```

另外, 在网络请求基础上还封装通用请求、列表请求两个 Hooks, 提供更加便捷的调用方式. 具体可以查看 [Hooks文档](./src/renderer/src/core/hooks/README.md)

## 内置 Hooks

具体可以查看 [Hooks文档](./src/renderer/src/core/hooks/README.md)

## 规范

### 通讯命名规范

**1. 桥接通讯事件**

主要是指渲染进程调用发起的事件, 通过 preload 桥接转发给到主进程。命名规范如下:

- 事件: [模块]\_EVENT_RENDERER_INVOKE

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

- 频道: [模块]\_IPC_CHANNEL
- 频道事件: [模块]\_IPC_CHANNEL_EVENT

示例:

```ts
// 模块专用通讯频道
export const APP_IPC_CHANNEL = 'app-ipc-channel';

// 频道上通讯具体事件
export enum APP_IPC_CHANNEL_EVENT {
  SET_THEME = 'app-ipc-channel-event:set-theme'
}
```

### Git 提交规范

- feat: 新功能
- fix: 修复问题
- style: 代码格式修改，不影响代码运行的变动
- refactor: 重构，既不新增功能，也不是修复问题
- perf: 优化相关，比如提升性能、体验
- test: 测试用例，包括单元测试、集成测试等
- chore: 其他修改，比如构建流程、依赖管理等
- build: 构建流程、依赖管理或外部资源引入变动
- revert: 回滚到上一个版本
- ci: 持续集成服务相关（travis、circle）
- deps: 依赖更新
- release: 发布新版本
- docs: 文档修改
- wip: 开发中

## 开发调试

- 集成 vue.js Devtool（@tomjs/electron-devtools-installer）
  - [本地加载 Vue.js Devtools](https://docs.ffffee.com/electron/electron-mastering-5-vue-devtools.html)
- 支持在页面点击（Shfit+鼠标右键）打开定位到对应组件/页面源码文件
  - 只在开发模式下有效
  - 原理：
    1. 编译时把文件地址和行号信息添加到 `template` 中 HTML 元素（包含组件标签）的自定义属性`data-source-location`
    2. 监听开发服务请求, 拦截 `/open-ide` 后使用 `shell` 命令打开对应源文件
    3. 项目的渲染进程监听 `document` 的 `mousedown` 事件, 获取元素 `data-source-location` 后, 发起打开编辑器请求给到 Vite 的服务处理（第2步）
  - 具体可以查看 `plugins/source-location/` 与 `src/renderer/src/core/plugins/source-location.plugin/`

## TODO

- [x] 进程通讯、share 类型定义规范化
- [x] 应用更新
- [x] 换肤（浅色、深色、跟随系统）
- [x] 多窗口管理（同窗口加载不同内容、同窗口tab加载内容、窗口最小化/最大化/关闭、外部链接页面-webview）
- [x] 开发模式集成 vuejs-devtool（@tomjs/electron-devtools-installer）
- [x] 进程窗口通讯示例（electron-events）
- [x] 托盘（菜单）
- [x] 日志文件
- [x] 请求封装、支持双 token
- [x] 权限组件（全局组件、类型）
- [x] 倒计时组件
- [x] 大文件切片上传
- [x] 包体积优化
- [ ] [桌面小程序](https://zhuanlan.zhihu.com/p/500043550)
