import { ElLoading, ElMessage } from 'element-plus';
import { CloseLoadingCallback, HelperOptions, ShowLoadingCallback } from './types';
import type { MessageTypedFn } from 'element-plus';
import type { LoadingInstance } from 'element-plus/es/components/loading/src/loading.d';
import { debounce } from 'lodash-es';

class Helper {
  private needLoadingRequestCount = 0;
  private loadingInstance: LoadingInstance | null | undefined;

  private showErrorMessage: MessageTypedFn;
  private showLoadingCallback: ShowLoadingCallback;
  private closeLoadingCallback: CloseLoadingCallback;

  constructor(options: HelperOptions) {
    this.showErrorMessage = options.showErrorMessage;
    this.showLoadingCallback = options.showLoadingCallback;
    this.closeLoadingCallback = options.closeLoadingCallback;
  }

  /** 显示全局 loading */
  showFullScreenLoading(message = '') {
    if (this.needLoadingRequestCount === 0) {
      this.startLoading(message);
    }
    this.needLoadingRequestCount += 1;
  }

  /** 隐藏全局 loading */
  hideFullScreenLoading() {
    if (this.needLoadingRequestCount <= 0) {
      return;
    }
    this.needLoadingRequestCount -= 1;

    if (this.needLoadingRequestCount === 0) {
      this.debounceEndLoading();
    }
  }

  /** 显示全局 loading */
  showMessage(message: string) {
    ElMessage.closeAll();
    this.showErrorMessage(message);
  }

  /** 防抖关闭 loading */
  private debounceEndLoading() {
    debounce(() => {
      this.endLoading();
    }, 100)();
  }

  /** 显示 loading */
  private startLoading(message: string) {
    this.loadingInstance = this.showLoadingCallback(message);
  }

  /** 关闭 loading */
  private endLoading() {
    this.closeLoadingCallback(this.loadingInstance!);
    this.loadingInstance = null;
  }
}

const helper = new Helper({
  showErrorMessage: ElMessage.error,
  showLoadingCallback(message: string) {
    return ElLoading.service({
      text: message,
      lock: true,
      background: 'rgba(0, 0, 0, 0.7)'
    });
  },
  closeLoadingCallback(instance) {
    instance?.close();
  }
});

/**
 * 判断是否是空对象
 *
 * @param {object} obj 判断数据
 * @return {*}
 */
function isEmptyObject(obj: object): boolean {
  if (obj === null || typeof obj !== 'object') return false;
  return Object.getOwnPropertyNames(obj).length === 0;
}

export default helper;
export { isEmptyObject };
