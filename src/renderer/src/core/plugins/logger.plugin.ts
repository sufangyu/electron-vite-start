import logger from 'electron-log/renderer';

if (!import.meta.env.DEV) {
  // 覆盖 console
  Object.assign(window.console, logger.functions);
}
