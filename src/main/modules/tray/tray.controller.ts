import {
  BrowserWindow,
  Menu,
  MenuItemConstructorOptions,
  NativeImage,
  TitleOptions,
  Tray,
  app,
  nativeImage,
  nativeTheme
} from 'electron';

import iconEmpty from '../../../../resources/tray-empty.png?asset';
import icon from '../../../../resources/tray@2x.png?asset';
import appUpdaterCheck from '../updater';

class TrayController {
  // 窗口实例
  private win: BrowserWindow | undefined;
  // 窗口是否可见
  private winIsVisible = true;

  // 系统托盘
  private tray: Tray | undefined;
  private darkIcon: NativeImage;
  private lightIcon: NativeImage;
  private emptyIcon: NativeImage;
  private iconSize = { with: 20, height: 20 };
  // 托盘闪烁
  private isFlicker = false;
  private timer: NodeJS.Timeout | null | undefined;

  constructor() {
    this.darkIcon = nativeImage.createFromPath(icon).resize(this.iconSize);
    // this.darkIcon.setTemplateImage(false);
    this.lightIcon = nativeImage.createFromPath(icon).resize(this.iconSize);
    // this.lightIcon.setTemplateImage(false);
    this.emptyIcon = nativeImage.createFromPath(iconEmpty).resize(this.iconSize);
  }

  /**
   * 创建托盘实例
   *
   * @param {BrowserWindow} win 主窗口实例
   * @memberof TrayController
   */
  create(win: BrowserWindow) {
    this.win = win;
    this.tray = new Tray(this.getTrayImage());

    this.tray?.setToolTip(`${app.getName()}`);
    this.onTrayEvents();
    this.setContextMenu();
  }

  private onTrayEvents() {
    this.tray?.on('click', () => {
      // this.toggleWindow();
    });

    // 监听主题切换事件，更新托盘图标
    nativeTheme.on('updated', () => {
      this.tray?.setImage(this.getTrayImage());
    });

    // 监听窗口的最小化/关闭事件, 更新托盘菜单
    const _onWinMinAndClose = () => {
      this.winIsVisible = false;
      this.updateContextMenu();
    };
    this.win?.on('minimize', _onWinMinAndClose);
    this.win?.on('close', _onWinMinAndClose);
  }

  /**
   * 获取托盘图标（根据主题）
   *
   * @private
   * @return {*}  {(string | NativeImage)}
   * @memberof TrayController
   */
  private getTrayImage(): string | NativeImage {
    return nativeTheme.shouldUseDarkColors ? this.darkIcon : this.lightIcon;
  }

  /**
   * 设置托盘上下文菜单
   *
   * @private
   * @memberof TrayController
   */
  private setContextMenu() {
    this.tray?.setContextMenu(this.getContextMenu());
  }

  /**
   * 更新托盘上下文菜单
   *
   * @private
   * @memberof TrayController
   */
  private updateContextMenu() {
    this.setContextMenu();
  }

  /**
   * 获取菜单上下文
   *
   * @private
   * @return {*}  {Menu}
   * @memberof TrayController
   */
  private getContextMenu(): Menu {
    const trayMenuTemplate: MenuItemConstructorOptions[] = [
      {
        label: this.winIsVisible ? '隐藏应用' : '显示应用',
        // checked: true,
        // type: 'checkbox',
        click: () => {
          this.toggleWindow();
          this.winIsVisible = !this.winIsVisible;
          this.updateContextMenu();
        }
      },
      {
        type: 'separator'
      },
      {
        label: '设置未读数',
        click: () => this.setTrayTitle('99+')
      },
      {
        label: '标记全部已读',
        click: () => this.setTrayTitle('')
      },
      {
        type: 'separator'
      },
      {
        label: '开始闪烁',
        click: () => this.startFlicker()
      },
      {
        label: '停止闪烁',
        click: () => this.stopFlicker()
      },
      {
        type: 'separator'
      },
      {
        label: '帮助',
        submenu: [
          {
            label: '关于',
            role: 'about'
          },
          {
            label: '检查更新',
            click: () => this.checkUpdater()
          }
        ]
      },
      {
        label: '退出',
        role: 'quit'
      }
    ];

    return Menu.buildFromTemplate(trayMenuTemplate);
  }

  /**
   * 设置未读数量
   *
   * @param {string} title 数量
   * @param {TitleOptions} [options]
   * @memberof TrayController
   */
  setTrayTitle(title: string, options?: TitleOptions) {
    this.tray?.setTitle(title, options ?? {});
  }

  /**
   * 开始闪烁
   *
   * @memberof TrayController
   */
  startFlicker() {
    this.timer = setInterval(() => {
      this.isFlicker = !this.isFlicker;

      if (this.isFlicker) {
        this.tray?.setImage(this.emptyIcon);
      } else {
        this.tray?.setImage(this.getTrayImage());
      }
    }, 600);
  }

  /**
   * 停止闪烁
   *
   * @memberof TrayController
   */
  stopFlicker() {
    this.timer && clearInterval(this.timer);
    this.timer = null;
    this.tray?.setImage(this.getTrayImage());
  }

  /**
   * 检查更新
   * TODO: 有更新就弹窗提示
   *
   * @private
   * @memberof TrayController
   */
  private checkUpdater() {
    appUpdaterCheck(false);
  }

  /**
   * 显示/隐藏应用
   *
   * @private
   * @memberof TrayController
   */
  private toggleWindow() {
    if (app?.isHidden() || this.win?.isMinimized()) {
      app?.show();
      this.win?.show();
    } else {
      app?.hide();
    }
  }
}

export default new TrayController();
