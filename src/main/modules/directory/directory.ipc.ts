import { DIRECTORY_EVENT_RENDERER_INVOKE, WINDOW_NAME } from '@share/event';
import { selectDirectory } from './directory.util';
import { events } from '@share/utils';

events?.handle(WINDOW_NAME.ANY, DIRECTORY_EVENT_RENDERER_INVOKE.SELECT, () => {
  return selectDirectory();
});
