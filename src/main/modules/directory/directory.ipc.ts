import { DIRECTORY_EVENT_RENDERER_INVOKE, WINDOW_NAME } from '@share/event';
import { events } from '@share/utils';

import directoryController from './directory.controller';

events?.handle(WINDOW_NAME.ANY, DIRECTORY_EVENT_RENDERER_INVOKE.SELECT, () => {
  return directoryController.selectDirectory();
});
