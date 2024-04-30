import { app, shell } from 'electron';
import logger from 'electron-log/main';
import { join } from 'path';

class LoggerController {
  private loggerPath: string;
  private loggerFileName: string;

  constructor() {
    const APP_DATA = app.getPath('userData');
    this.loggerPath = join(APP_DATA, 'logs');
    this.loggerFileName = 'log.log';
  }
  /**
   * 初始化日志
   *
   * @memberof LoggerController
   */
  init() {
    logger.initialize();
    logger.transports.file.maxSize = 5 * 1024 * 1024; // 5MB
    logger.transports.file.level = 'debug';
    logger.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} {text}';

    Object.assign(console, logger.functions);

    const fullPath = join(this.loggerPath, this.loggerFileName);
    console.log('[LOGGER] 日志保存路径:', fullPath);
    logger.transports.file.resolvePathFn = () => fullPath;
  }

  /**
   * 按日期生成日志文件名
   *
   * @private
   * @return {*}
   * @memberof LoggerController
   */
  private getFileNameByDate() {
    const tody = new Date();
    const date = `${tody.getFullYear()}-${tody.getMonth() + 1}-${tody.getDate()}`;
    return `${date}.log`;
  }

  /**
   * 打开日志目录
   *
   * @memberof LoggerController
   */
  openLogsDirectory() {
    shell.openPath(this.loggerPath);
  }
}

export default new LoggerController();
