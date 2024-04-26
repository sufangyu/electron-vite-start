import { MenuItemConstructorOptions, app } from 'electron';

export const WINDOW_MENU_CONFIG: MenuItemConstructorOptions = {
  label: '窗口',
  submenu: [
    {
      label: '最小化',
      role: 'minimize'
    },
    {
      label: '最大化',
      // accelerator: 'CmdOrCtrl+Z',
      role: 'zoom'
    },
    {
      label: '重置大小',
      role: 'resetZoom'
    },
    { type: 'separator' },
    {
      label: '关闭',
      accelerator: 'CmdOrCtrl+W',
      role: 'close'
    },
    {
      label: '重新打开窗口',
      accelerator: 'CmdOrCtrl+Shift+T',
      enabled: true,
      click: () => {
        app.emit('activate');
      }
    }
  ]
};
