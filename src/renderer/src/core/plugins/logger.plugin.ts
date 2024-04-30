import logger from 'electron-log/renderer';

// 覆盖 console
Object.assign(window.console, logger.functions);
