import { ElLoading, ElMessage } from 'element-plus';
import type { MessageTypedFn } from 'element-plus';
import { type DebouncedFunc, debounce } from 'lodash-es';

import { useAccountStore } from '@store/index';

import { CloseLoadingCallback, HelperOptions, ShowLoadingCallback } from './types';

import type { LoadingInstance } from 'element-plus/es/components/loading/src/loading.d';

class Helper {
  private needLoadingRequestCount = 0;
  private loadingInstance: LoadingInstance | null | undefined;

  private showErrorMessage: MessageTypedFn;
  private closeAllErrorMessage: () => void;
  private showLoadingCallback: ShowLoadingCallback;
  private closeLoadingCallback: CloseLoadingCallback;
  /** 延迟关闭loading函数 */
  private debouncedFunc: DebouncedFunc<() => void>;

  constructor(options: HelperOptions) {
    this.showErrorMessage = options.showErrorMessage;
    this.closeAllErrorMessage = options.closeAllErrorMessage;
    this.showLoadingCallback = options.showLoadingCallback;
    this.closeLoadingCallback = options.closeLoadingCallback;

    this.debouncedFunc = debounce(() => this.endLoading(), 25);
  }

  /** 显示全局 loading */
  showFullScreenLoading(message = '') {
    if (this.needLoadingRequestCount === 0) {
      // 取消关闭 loading 的延迟执行
      this.debouncedFunc?.cancel();
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
    typeof this.closeAllErrorMessage === 'function' && this.closeAllErrorMessage();
    this.showErrorMessage(message);
  }

  /** 防抖关闭 loading */
  private debounceEndLoading() {
    this.debouncedFunc();
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

  /**
   * 退出登录
   *
   * @memberof Helper
   */
  logout() {
    this.resetAccount();
    console.log('[IPC_REQUEST] TODO: 处理退出登录动作');
  }

  /**
   * 获取 token
   *
   * @return {*}  {string}
   * @memberof Helper
   */
  getAccessToken(): string {
    const { accessToken } = useAccountStore();
    return accessToken || '';
  }

  /**
   * 获取 refreshToken
   *
   * @return {*}  {string}
   * @memberof Helper
   */
  getRefreshAccessToken(): string {
    const { refreshToken } = useAccountStore();
    return refreshToken || '';
  }

  /**
   * 重置帐号信息
   *
   * - 未登录 或 登录过期
   *
   * @memberof Helper
   */
  private resetAccount(): void {
    const { setAccount } = useAccountStore();
    setAccount(null);
  }

  /**
   * 更新 token
   *
   * @memberof Helper
   */
  updateToken(accessToken = '', refreshToken = ''): void {
    const { account, setAccount } = useAccountStore();
    const newAccount = Object.assign({}, account, {
      accessToken,
      refreshToken
    });
    setAccount(newAccount);
  }
}

const helper = new Helper({
  showErrorMessage: ElMessage.error,
  closeAllErrorMessage: () => ElMessage.closeAll(),
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
