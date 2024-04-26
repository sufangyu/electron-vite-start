import { join } from 'path';
import { BrowserWindow, app, shell } from 'electron';
import { is, platform } from '@electron-toolkit/utils';
import { useEvents, useWindowPool } from 'electron-events';
import { CreateWindowOptions } from '@share/types';
import { isExternal } from '@share/utils';
import { WINDOW_IPC_CHANNEL, WINDOW_IPC_CHANNEL_EVENT } from '@share/event';
import icon from '../../../../resources/icon.png?asset';

const events = useEvents('browser');
const windowPool = useWindowPool();

/**
 * 窗口管理
 *
 * @export
 * @class WindowController
 */
export class WindowController {
  // 已创建的浏览器对象: key 是 winId, value 是窗口对象
  private browserWindowsMap = new Map<number, Electron.BrowserWindow>();

  // 已创建的窗口对象: key 是窗口名称, 方便通过模块名称查询
  private windowModuleMap = new Map<string, { id: number; url: string; module: string }>();

  static instance: WindowController;

  // 记录最后一次窗口标题
  private lastTitle: string | undefined;

  /**
   * 窗口管理器单例
   * @returns
   */
  static getInstance() {
    if (!WindowController.instance) {
      this.instance = new WindowController();
    }
    return this.instance;
  }

  /**
   * 创建窗口
   *
   * @param {CreateWindowOptions} options 窗口配置信息
   * @return {*}  {BrowserWindow}
   * @memberof WindowController
   */
  createWindow(options: CreateWindowOptions): BrowserWindow {
    const {
      module,
      url = '',
      title = '',
      width = 990,
      height = 570,
      minWidth = 420,
      minHeight = 560,
      maxWidth,
      maxHeight,
      center = true,
      resizable = true,
      minimizable = true,
      maximizable = true,
      closable = true,
      alwaysOnTop = false,
      fullscreen = false,
      fullscreenable = true,
      frame = true,
      modal = false,
      autoHideMenuBar = false,
      backgroundColor,
      titleBarStyle = 'default',
      titleBarOverlay
    } = options;

    this.lastTitle = title;
    // console.log('创建/打开窗口 =>>', this.windowModuleMap.has(module), title, options);

    if (this.windowModuleMap.has(module)) {
      // 已存在：
      // 1. url 不一致重新加载窗口资源，并更新 url
      // 2. 获取焦点、从最小化中恢复窗口大小
      // 3. 通过 IPC 设置、通知新数据给渲染进程窗口
      // const newUrl = url;
      // const newTitle = title;
      const { id, url: oldUrl } = this.windowModuleMap.get(module)!;
      const curWindow = this.browserWindowsMap.get(id)!;

      if (oldUrl !== url) {
        this.loadBrowserWindow(curWindow, url);
        this.windowModuleMap.set(module, { id, url, module });
      }
      this.executeJavaScript(curWindow, { module, title });
      this.sendWindowInfo(curWindow, { module, title });
      curWindow.setTitle(title);
      curWindow?.focus();
      curWindow.isMinimized() && curWindow.restore();

      console.log('打开窗口 =>', curWindow.title);

      return curWindow;
    }

    // 不存在:
    // 1. 创建窗口
    // 2. 添加到窗口列表
    // 3. 添加到窗口模块列表
    // 4. 通过 IPC 通知渲染进程窗口信息

    // 已存在打开的窗口，且新窗口不是居于屏幕中央，则相对于上一个窗口进行偏移
    const curWindow = BrowserWindow.getFocusedWindow();
    const coord: { x?: number; y?: number } = { x: undefined, y: undefined };
    if (curWindow && !center) {
      const [currentWindowX, currentWindowY] = curWindow.getPosition();
      coord.x = currentWindowX + 30;
      coord.y = currentWindowY + 30;
    }

    const createWindow = new BrowserWindow({
      show: false,
      title,
      width,
      height,
      minWidth,
      minHeight,
      maxWidth,
      maxHeight,
      ...coord, // 指定窗口坐标. center 参数无效
      center,
      resizable,
      minimizable,
      maximizable,
      closable,
      alwaysOnTop,
      fullscreen,
      fullscreenable,
      frame,
      parent: modal ? curWindow! : undefined,
      modal,
      autoHideMenuBar,
      backgroundColor,
      titleBarStyle,
      titleBarOverlay,
      useContentSize: true,

      ...(process.platform === 'linux' ? { icon } : {}),
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        sandbox: false
      }
    });
    events.addWindow(module, createWindow);

    // 开发模式下设置 dock icon
    if (is.dev && platform.isMacOS) {
      app.dock.setIcon(icon);
    }

    createWindow.on('close', () => {
      this.deleteWindow(createWindow.id);
    });

    createWindow.on('ready-to-show', () => {
      createWindow?.show();
    });

    // 禁用 window.open 打开窗口,将链接使用默认浏览器打开
    createWindow.webContents.setWindowOpenHandler((details) => {
      shell.openExternal(details.url);
      return { action: 'deny' };
    });

    createWindow.webContents.on('did-finish-load', () => {
      this.executeJavaScript(createWindow, { module, title: this.lastTitle });

      // FIX: 通过延迟执行, 避免渲染进程未加载(未注册监听事件),从而无法获取窗口信息
      setTimeout(() => {
        this.sendWindowInfo(createWindow, { module, title: this.lastTitle });
      }, 150);
    });

    this.loadBrowserWindow(createWindow, url);

    // 将窗口信息存储到 map
    this.browserWindowsMap.set(createWindow.id, createWindow);
    this.windowModuleMap.set(options.module, {
      id: createWindow.id,
      url,
      module
    });

    return createWindow;
  }

  /**
   * 向渲染进程发送窗口信息
   *
   * @private
   * @param {BrowserWindow} window 窗口对象
   * @param {{ module: string; title: string }} info 信息
   * @memberof WindowController
   */
  private sendWindowInfo(
    window: BrowserWindow,
    { module, title }: { module: string; title?: string }
  ) {
    const curWindowName = windowPool.getName(window.id);

    events?.emitTo(curWindowName!, WINDOW_IPC_CHANNEL, {
      event: WINDOW_IPC_CHANNEL_EVENT.WINDOW_INFO,
      data: {
        message: '窗口信息',
        detail: {
          id: window.id,
          name: module,
          title
        }
      }
    });
  }

  private executeJavaScript(
    window: BrowserWindow,
    { module, title }: { module: string; title?: string }
  ) {
    const windowInfo = {
      id: window.id,
      module,
      title
    };
    window.webContents.executeJavaScript(`
      window.windowInfo = ${JSON.stringify(windowInfo)}
    `);
  }

  /**
   * 加载窗口
   *
   * @private
   * @param {BrowserWindow} window 窗口对象
   * @param {string} url 窗口地址
   * @memberof WindowController
   */
  private loadBrowserWindow(window: BrowserWindow, url: string) {
    if (isExternal(url)) {
      // 外部资源
      window.loadURL(url);
    } else {
      if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        const fullUrl = new URL(process.env['ELECTRON_RENDERER_URL']);
        fullUrl.hash = url;
        window.loadURL(fullUrl.toString());
      } else {
        window.loadFile(join(__dirname, '../renderer/index.html'), {
          hash: url
        });
      }
    }
  }

  /**
   * 获取窗口对象
   *
   * @param {number} windowId 窗口 ID
   * @return {*}
   * @memberof WindowController
   */
  getWindow(windowId: number): BrowserWindow | undefined {
    return this.browserWindowsMap.get(windowId);
  }

  getAllWindow(): BrowserWindow[] {
    return Array.from(this.browserWindowsMap.values());
  }

  /**
   * 删除窗口
   *
   * @param {number} windowId 窗口 ID
   * @memberof WindowController
   */
  deleteWindow(windowId: number) {
    const curWindow = this.browserWindowsMap.get(windowId);

    try {
      if (this.browserWindowsMap.size > 0) {
        let key = '';
        for (const [k, v] of this.windowModuleMap) {
          if (v.id === windowId) {
            key = k;
            break;
          }
        }
        if (key) {
          events.removeWindow(windowId);
          this.windowModuleMap.delete(key);
        }
        this.browserWindowsMap.delete(windowId);
      }

      curWindow?.close();
    } catch (error) {
      console.error('删除窗口出错:', error);
    }
  }
}
