import { is } from '@electron-toolkit/utils';
import { installExtension, type InstallOptions } from '@tomjs/electron-devtools-installer';
import { extensionTypeMap } from './types';

/**
 * 扩展安装控制器
 *
 * @see https://github.com/tomjs/electron-devtools-installer/blob/HEAD/README.zh_CN.md
 *
 * @class ExtensionInstallController
 */
class ExtensionInstallController {
  /**
   * 安装预设 Chrome 扩展
   *
   * @param {keyof typeof extensionTypeMap} extensionIds
   * @param {InstallOptions} [options]
   * @return {*}
   * @memberof ExtensionInstallController
   */
  presets(extensionIds: keyof typeof extensionTypeMap, options?: InstallOptions): void {
    if (!is.dev || !extensionTypeMap[extensionIds]) {
      return;
    }
    installExtension(extensionTypeMap[extensionIds], options)
      .then((ext) => console.log(`[INSTALL_EXTENSION ] Added Extension: ${ext.name}`))
      .catch((err) => console.log(`[INSTALL_EXTENSION] An error occurred:  ${err}`));
  }
}

export default new ExtensionInstallController();
