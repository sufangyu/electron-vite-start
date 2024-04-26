import { MenuItemConstructorOptions, app } from 'electron';

const name = app.getName();

export const MAC_MENU_CONFIG: MenuItemConstructorOptions = {
  // FIXME: dev模式下菜单栏的名称
  label: 'video-???',
  submenu: [
    {
      label: `关于 ${name}`,
      role: 'about'
    },
    { type: 'separator' },
    {
      label: '服务',
      role: 'services'
    },
    { type: 'separator' },
    {
      label: `隐藏 ${name}`,
      accelerator: 'Command+H',
      role: 'hide'
    },
    {
      label: '隐藏其它',
      accelerator: 'Command+Alt+H',
      role: 'hideOthers'
    },
    {
      label: '显示全部',
      role: 'unhide'
    },
    { type: 'separator' },
    {
      label: '退出',
      accelerator: 'Command+Q',
      click: () => {
        app.quit();
      }
    }
  ]
};
