import { MenuItemConstructorOptions } from 'electron';
import {
  EDIT_MENU_CONFIG,
  VIEW_MENU_CONFIG,
  WINDOW_MENU_CONFIG,
  HELP_CONFIG_CONFIG,
  MAC_MENU_CONFIG
} from './config';

class MenuController {
  /**
   * 获取菜单模版
   * @returns 菜单模版
   */
  getTemplates() {
    const templates: MenuItemConstructorOptions[] = [
      EDIT_MENU_CONFIG,
      VIEW_MENU_CONFIG,
      WINDOW_MENU_CONFIG,
      HELP_CONFIG_CONFIG
    ];

    switch (process.platform) {
      case 'darwin':
        this.compatibleMac(templates);
        break;
      case 'win32':
        this.compatibleWindows(templates);
        break;
      default:
    }

    return templates;
  }

  /**
   * 适配 Mac
   * @param templates 菜单项数组
   */
  private compatibleMac(templates: MenuItemConstructorOptions[]) {
    // Mac 第一项菜单是应用名称, 需给这一项添加菜单
    templates.unshift(MAC_MENU_CONFIG);

    // 增强“窗口”菜单项
    const WINDOW_MENU_ITEM_FOR_MAC: MenuItemConstructorOptions[] = [
      { type: 'separator' },
      { label: '前置全部窗口', role: 'front' }
    ];
    (WINDOW_MENU_CONFIG.submenu as MenuItemConstructorOptions[])?.push(...WINDOW_MENU_ITEM_FOR_MAC);

    // 添加更新菜单项
    this.addUpdateMenuItems(templates[0]?.submenu as MenuItemConstructorOptions[], 1);
  }

  /**
   * 适配 Windows 平台
   *
   * @param templates 菜单项数组
   */
  private compatibleWindows(templates: MenuItemConstructorOptions[]) {
    // 添加更新菜单项
    const [helpMenuItem] = templates.slice(-1);
    this.addUpdateMenuItems(helpMenuItem?.submenu as MenuItemConstructorOptions[], 0);
  }

  /**
   * 添加更新菜单项
   * @param menus 菜单项数组
   * @param index 插入位置
   */
  private addUpdateMenuItems(menus: MenuItemConstructorOptions[], index: number) {
    if (process.mas) {
      // Mac App Store 版本，不显示更新菜单
      return;
    }

    const updateMenuItems: MenuItemConstructorOptions[] = [
      // { label: `Version ${app.getVersion()}`, enabled: false },
      {
        label: '检查更新',
        visible: true,
        id: 'checkForUpdate',
        click: () => {
          console.log('TODO: 检查更新实现');
          // global.mainWindow?.webContents.send('checkForUpdate', { isBackground: false });
        }
      }
    ];

    menus.splice(index, 0, ...updateMenuItems);
  }
}

export default new MenuController();
