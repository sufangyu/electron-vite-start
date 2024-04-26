import { BrowserWindow, MenuItemConstructorOptions, MessageBoxOptions, dialog } from 'electron';

export const VIEW_MENU_CONFIG: MenuItemConstructorOptions = {
  label: '查看',
  submenu: [
    {
      label: '重载',
      accelerator: 'CmdOrCtrl+R',
      click: (_, focusedWindow) => {
        // 重载之后, 刷新并关闭所有的次要窗体
        if (focusedWindow?.id === 1) {
          BrowserWindow.getAllWindows().forEach((win) => {
            if (win.id > 1) {
              win.close();
            }
          });
        }
        focusedWindow?.reload();
      }
    },
    {
      label: '切换全屏',
      enabled: false,
      accelerator: (() => {
        return process.platform === 'darwin' ? 'Ctrl+Command+F' : 'F11';
      })(),
      click: (_, focusedWindow) => {
        focusedWindow?.setFullScreen(!focusedWindow.isFullScreen());
      }
    },
    { type: 'separator' },
    {
      label: '开发者工具',
      accelerator: (() => {
        return process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I';
      })(),
      click: (_, focusedWindow) => {
        focusedWindow?.webContents.openDevTools();
      }
    },
    {
      label: '应用程序菜单演示',
      click: async (_, focusedWindow) => {
        if (!focusedWindow) {
          return;
        }

        // '确定', '取消'
        const buttonsOptions = [
          { label: '确定', type: 'confirm' },
          { label: '取消', type: 'cancel' }
        ];
        const options: MessageBoxOptions = {
          type: 'info',
          title: '应用程序菜单演示',
          buttons: buttonsOptions.map((it) => it.label),
          message: '此演示用于 "菜单" 部分, 展示如何在应用程序菜单中创建可点击的菜单项.'
        };
        const res = await dialog.showMessageBox(focusedWindow, options);
        const curButtonOptions = buttonsOptions[res.response];
        console.log(`按钮：${curButtonOptions.label}, 类型：${curButtonOptions.type}`);
      }
    }
  ]
};
