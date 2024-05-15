class SourceLocationController {
  /**
   * 绑定事件
   *
   * shfit + 鼠标左按键 => 触发
   *
   * @memberof SourceLocationController
   */
  bindEvent() {
    document.addEventListener('mousedown', (ev) => {
      // shfit + 鼠标左按键
      if (ev.shiftKey && ev.button === 0) {
        ev.preventDefault();

        this.senRequestToOpenEditor(ev);
      }
    });
  }

  /**
   * 发起打开编辑器请求
   * @param ev 触发元素
   * @returns
   */
  private senRequestToOpenEditor(ev: MouseEvent) {
    const filePath = this.getFilePath(ev);
    console.log('filePath =>>', filePath);

    if (!filePath) {
      return;
    }

    const protocol = window.location.protocol ? window.location.protocol : 'http:';
    const hostname = window.location.hostname ? window.location.hostname : 'localhost';
    const port = window.location.port ? window.location.port : '80';
    const apiPath = 'open-ide';

    const url = `${protocol}//${hostname}:${port}/${apiPath}?filePath=${filePath}`;
    fetch(url).catch((err) => {
      console.log('打开编辑器失败', err);
    });
  }

  /**
   * 递归获取元素的文件路径
   *
   * @private
   * @param {(MouseEvent | HTMLElement | ParentNode | null | undefined)} ev
   * @return {*}
   * @memberof SourceLocationController
   */
  private getFilePath(ev: MouseEvent | HTMLElement | ParentNode | null | undefined): string | null {
    let element = ev as HTMLElement;
    if ((ev as Event).target) {
      element = (ev as Event).target as HTMLElement;
    }

    if (!element || !element.getAttribute) {
      return null;
    }

    if (element.getAttribute('data-code-location')) {
      return element.getAttribute('data-code-location');
    }

    const parentNode = element.parentNode;
    return this.getFilePath(parentNode);
  }
}

export default new SourceLocationController();
