export interface CountDownOptions {
  /**
   * 倒计时时长，单位毫秒
   *
   * @type {(number | string)}
   * @memberof CountDownOptions
   */
  time: number | string;
  /**
   * 时间格式化, 默认 ss
   *
   * @type {string}
   * @memberof CountDownOptions
   */
  format?: string;
  /**
   * 是否自动开始倒计时, 默认 false
   *
   * @type {boolean}
   * @memberof CountDownOptions
   */
  autoStart?: boolean;
  /**
   * 是否开启毫秒级渲染
   *
   * @type {boolean}
   * @memberof CountDownOptions
   */
  millisecond?: boolean;
  /**
   * 缓存 Key. 会自动加上渲染进程本地缓存前缀字符串
   *
   * - 如有本地缓存, 在初始化会为缓存的值作为最新的倒计时长而非传入的值
   *
   * @type {string}
   * @memberof CountDownOptions
   */
  cachedKey?: string;
  /**
   * 时间改变回调函数
   * @param {CurrentTime} current 反格式化时间
   * @returns
   */
  onChange?: (current: CurrentTime) => void;
  /**
   * 结束回调函数
   *
   * @memberof CountDownOptions
   */
  onFinished?: () => void;
}

export interface CountDownReturn {
  /**
   * 倒计时中
   *
   * @type {globalThis.Ref<boolean>}
   * @memberof CountDownReturn
   */
  counting: globalThis.Ref<boolean>;
  /**
   * 当前时间信息（反时间格式化）
   *
   * @type {globalThis.ComputedRef<CurrentTime>}
   * @memberof CountDownReturn
   */
  current: globalThis.ComputedRef<CurrentTime>;
  /**
   * 时间文本. 支持通过在初始化时传 format 来格式化显示
   *
   * @type {globalThis.ComputedRef<string>}
   * @memberof CountDownReturn
   */
  timeText: globalThis.ComputedRef<string>;
  /**
   * 开始倒计时
   *
   * @memberof CountDownReturn
   */
  startCountDown: () => void;
  /**
   * 暂停倒计时
   *
   * @memberof CountDownReturn
   */
  pauseCountDown: () => void;
  /**
   * 继续倒计时
   *
   * @memberof CountDownReturn
   */
  continuCountDown: () => void;
  /**
   * 重置倒计时
   * @param {number} totalTime 重置的倒计时长(毫秒), 不传时使用初始化
   * @returns
   * @memberof CountDownReturn
   */
  resetCountDown: (totalTime?: number) => void;
}

/**
 * 反格式化时间
 */
export type CurrentTime = {
  timestamp: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
};
