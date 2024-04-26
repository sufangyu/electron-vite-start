import { MenuItemConstructorOptions, shell } from 'electron';

export const HELP_CONFIG_CONFIG: MenuItemConstructorOptions = {
  label: '帮助',
  role: 'help',
  submenu: [
    {
      label: 'Github',
      click: () => {
        shell.openExternal('https://www.github.com');
      }
    },
    { type: 'separator' },
    {
      label: '学习更多',
      click: () => {
        shell.openExternal('https://www.electronjs.org');
      }
    }
  ]
};
