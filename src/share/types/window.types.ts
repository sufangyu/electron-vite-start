/**
 * 窗口配置项
 */
export interface CreateWindowOptions {
  /** 模块名称 */
  module: string;
  windowType?: WindowType;
  url?: string;
  title?: string;
  width?: number;
  height?: number;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  /** 创建/打开时是否显示在屏幕中心 */
  center?: boolean;
  /** 窗口大小是否可调整。默认值为 true */
  resizable?: boolean;
  /** 窗口是否可最小化。 在 Linux 上未实现。 默认值为 true。 */
  minimizable?: boolean;
  /** 窗口是否最大化。 在 Linux 上未实现。 默认值为 true。 */
  maximizable?: boolean;
  /** 窗口是否可关闭。 在 Linux 上未实现。 默认值为 true。 */
  closable?: boolean;
  /** 窗口是否永远在别的窗口的上面。默认值为 false */
  alwaysOnTop?: boolean;
  /** 窗口是否全屏。默认值为 false。设置为 false 时，在 macOS 上全屏的按钮将被隐藏或禁用 */
  fullscreen?: boolean;
  /** 窗口是否可以进入全屏状态。默认值为 true。在 macOS上, 最大化/缩放按钮是否可用 */
  fullscreenable?: boolean;
  /** 窗口自带的关闭最小化等. 默认 true, 为 false 时表示无边框 */
  frame?: boolean;
  /** 是否为模态窗口。只有当窗口是子窗口时才起作用。默认值为 false. */
  modal?: boolean;
  /** 自动隐藏菜单栏，除非按了Alt键。 默认值为 false */
  autoHideMenuBar?: boolean;
  /**
   * 窗口背景色，格式为 Hex, RGB, RGBA, HSL, HSLA 或 CSS 命名颜色。
   * 如果 transparent 设置为 true，则支持#AARRGGBB格式的透明。 默认值为 #FFF（白色）。
   */
  backgroundColor?: string;
  /**
   * 窗口标题栏的样式
   *
   * - default - 分别返回 macOS 或者 Windows 的标准标题栏
   * - hidden - 在一个隐藏的标题栏和一个全尺寸大小的内容窗口中取得结果。 在 macOS 内, 窗口将一直拥有位于左上的标准窗口控制器 (“traffic lights”)。 在 Windows上，当与 titleBarOverlay: true 合并时，它将激活窗口控件叠加(详情请参阅 titleBarOverlay)，否则将不会显示窗口控件。
   * - hiddenInset macOS - 仅 macOS，隐藏标题栏，使用窗口边缘稍微小的红绿灯按钮替代。
   * - customButtonsOnHover macOS - 仅 macOS，隐藏的标题栏的全尺寸的内容窗口， 红绿灯按钮在鼠标悬停在窗口左上方时显示。 注意: 此选项目前是实验性的。
   */
  titleBarStyle?: 'default' | 'hidden' | 'hiddenInset' | 'customButtonsOnHover';

  titleBarOverlay?:
    | {
        /**
         * The CSS color of the Window Controls Overlay when enabled. Default is the system
         * color.
         *
         * @platform win32
         */
        color?: string;
        /**
         * The CSS color of the symbols on the Window Controls Overlay when enabled.
         * Default is the system color.
         *
         * @platform win32
         */
        symbolColor?: string;
        /**
         * The height of the title bar and Window Controls Overlay in pixels. Default is
         * system height.
         *
         * @platform darwin,win32
         */
        height?: number;
      }
    | boolean;
}

/**
 * 窗口操作动作枚举
 */
export enum WINDOW_ACTION {
  RELOAD = 'reload',
  CLOSE = 'close',
  MIN = 'min',
  MAX = 'max',
  FULL_SCREEN = 'fullScreen',
  SIMPLE_FULL_SCREEN = 'simpleFullScreen'
}

/**
 * 窗口类型
 */
export enum WindowType {
  /** 普通窗口 */
  NORMAL = '0',
  /** 自定义导航栏 */
  CUSTOM_NAVBAR = '1'
}
