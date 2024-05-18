import { app, shell } from 'electron';

import loggerController from '@main/plugins/logger/logger.controller';
import { DIRECTORY_EVENT_RENDERER_INVOKE, DIRECTORY_TYPE, WINDOW_NAME } from '@share/modules';
import { events } from '@share/utils';

import directoryController from './directory.controller';

events?.handle(WINDOW_NAME.ANY, DIRECTORY_EVENT_RENDERER_INVOKE.SELECT, () => {
  return directoryController.selectDirectory();
});

events?.on(WINDOW_NAME.ANY, DIRECTORY_EVENT_RENDERER_INVOKE.OPEN, (type, fullPath) => {
  const APP_DATA = app.getPath('userData');

  switch (type) {
    case DIRECTORY_TYPE.LOGS:
      loggerController.openLogsDirectory();
      break;
    case DIRECTORY_TYPE.STORE:
      shell.openPath(APP_DATA);
      break;
    case DIRECTORY_TYPE.CUSTOM:
      if (fullPath) {
        shell.openPath(fullPath);
      } else {
        console.error('[FILE_DIRECTORY_OPEN] fullPath 不能为空');
      }
      break;
    default:
  }
});
