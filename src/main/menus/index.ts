import { Menu } from 'electron';
import menuHelper from './menu.helper';

/**
 * 创建应用菜单
 */
function createAppMenu() {
  const templates = menuHelper.getTemplates();

  const appMenu = Menu.buildFromTemplate(templates);
  Menu.setApplicationMenu(appMenu);
}

export default createAppMenu;
