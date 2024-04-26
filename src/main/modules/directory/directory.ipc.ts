import { events } from '@share/utils';
import { DIRECTORY_EVENT_RENDERER_INVOKE, WINDOW_NAME } from '@share/modules';

import directoryController from './directory.controller';

events?.handle(WINDOW_NAME.ANY, DIRECTORY_EVENT_RENDERER_INVOKE.SELECT, () => {
  return directoryController.selectDirectory();
});
