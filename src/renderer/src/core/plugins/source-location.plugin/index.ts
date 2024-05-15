import sourceLocationController from './source-location.controller';

if (import.meta.env.DEV) {
  sourceLocationController.bindEvent();
}
