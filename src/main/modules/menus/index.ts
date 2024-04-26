import { Menu } from 'electron';
import menuController from './menu.controller';

/**
 * 创建应用菜单
 */
export default function createAppMenu() {
  const templates = menuController.getTemplates();

  const appMenu = Menu.buildFromTemplate(templates);
  Menu.setApplicationMenu(appMenu);
}
