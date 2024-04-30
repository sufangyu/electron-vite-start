import { app } from 'electron';

class AppController {
  onLifecycle() {
    // 渲染进程结束
    app.on('render-process-gone', async (event, webContents, details) => {
      console.error(
        '[APP-ERROR:render-process-gone]',
        `event: ${JSON.stringify(event)}`,
        `webContents: ${JSON.stringify(webContents)}`,
        `details: ${JSON.stringify(details)}`
      );
    });

    // 子进程结束
    app.on('child-process-gone', async (event, details) => {
      console.error(
        '[APP-ERROR:child-process-gone]',
        `event: ${JSON.stringify(event)}`,
        `details: ${JSON.stringify(details)}`
      );
    });
  }
}

export default new AppController();
