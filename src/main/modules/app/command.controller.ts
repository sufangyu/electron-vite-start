import { exec } from 'child_process';

import { COMMAND_TYPE } from '@share/modules';

class CommandController {
  run(type: COMMAND_TYPE, command?: string) {
    let commandRes = '';

    switch (type) {
      case COMMAND_TYPE.OPEN_NETWORK_SETTINGS:
        commandRes = this.getOpenNetrowkSettingCommand();
        break;
      case COMMAND_TYPE.CUSTOM:
        commandRes = command || '';
        break;
      default:
    }

    return this.execCommand(commandRes);
  }

  /**
   * 执行命令
   *
   * @private
   * @param {string} command 命令字符串
   * @return {*}  {Promise<string>}
   * @memberof CommandController
   */
  private execCommand(command: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!command) {
        throw new Error('[COMMAND_CONTROLLER] 缺少执行的命令');
      }

      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`[COMMAND_CONTROLLER] 执行命令错误: ${error.message}`);
          reject(error.message);
        }

        if (stderr) {
          console.error(`Stderr: ${stderr}`);
          console.error(`[COMMAND_CONTROLLER] 执行命令标准错误: ${stderr}`);
          reject(stderr);
        }
        resolve(stdout);
      });
    });
  }

  /**
   * 获取打开网络设置的命令
   *
   * @private
   * @return {*}  {string}
   * @memberof CommandController
   */
  private getOpenNetrowkSettingCommand(): string {
    let command = '';
    switch (process.platform) {
      case 'win32':
        command = 'control.exe /name Microsoft.NetworkAndSharingCenter';
        break;
      case 'darwin':
        command = 'open "x-apple.systempreferences:com.apple.preference.network"';
        break;
      case 'linux':
        command = 'gnome-control-center network'; // 适用于 GNOME 桌面环境
        break;
      default:
    }

    return command;
  }
}

export default new CommandController();
