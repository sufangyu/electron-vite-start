import { cancelRaf, storeHelper, parseFormat, parseTime, raf } from './util';

import type { CountDownOptions, CountDownReturn } from './types';

// 缓存 KEY 前缀
const STORE_KEY_PREFIX = import.meta.env.RENDERER_VITE_PRE_STORE_KEY;

/**
 * 倒计时
 *
 * @export
 * @param {CountDownOptions} options
 * @return {*}
 */
export function useCountDown(options: CountDownOptions): CountDownReturn {
  const {
    time,
    format = 'HH:mm:ss',
    autoStart = false,
    millisecond = false,
    cachedKey = '',
    onChange,
    onFinished
  } = options;

  let rafId = 0;
  // 结束时间
  let endTime = 0;

  const countDownCachedKey = cachedKey.startsWith(STORE_KEY_PREFIX)
    ? cachedKey
    : `${STORE_KEY_PREFIX}${cachedKey}`;

  const counting = ref<boolean>(false);
  // 倒计时长（毫秒）
  const remain = ref<number>(storeHelper.get(countDownCachedKey) || Number(time));
  // 当前时间具体信息（天、时、分、秒、毫秒）
  const current = computed(() => parseTime(remain.value));
  // 格式化显示当前时间
  const timeText = computed(() => parseFormat(format, current.value));

  /**
   * 倒计时
   */
  const _tick = (): void => {
    rafId = raf(() => {
      // 最新倒计时长（毫秒）
      remain.value = Math.max(endTime - Date.now(), 0);
      !!cachedKey && storeHelper.set(countDownCachedKey, remain.value);
      typeof onChange === 'function' && onChange?.(current.value);

      // 支持毫秒, 则倒计时为 0 就停止;
      // 只支持秒, 倒计时小于 1000 就停止.
      const isStop = millisecond ? remain.value === 0 : remain.value < 1000;

      if (isStop) {
        // 结束（小于1秒, 忽略毫秒）
        typeof onFinished === 'function' && onFinished?.();
        counting.value = false;
        pauseCountDown();
      } else {
        // 继续
        _tick();
      }
    });
  };

  /**
   * 开始倒计时
   *
   * @return {*}
   */
  const startCountDown = (): void => {
    if (counting.value) {
      return;
    }

    counting.value = true;
    endTime = Date.now() + remain.value;
    _tick();
  };

  /**
   * 暂停计时
   */
  const pauseCountDown = (): void => {
    if (!counting.value) {
      return;
    }

    counting.value = false;
    rafId && cancelRaf(rafId);
  };

  /**
   * 继续计时
   */
  const continuCountDown = (): void => {
    if (counting.value) {
      return;
    }

    startCountDown();
  };

  /**
   * 重置倒计时
   * @param totalTime 指定倒计时时长. 不指定时默认为初始化倒计时长
   */
  const resetCountDown = (totalTime?: number): void => {
    pauseCountDown();
    const _totalTime = isNaN(Number(totalTime)) ? Number(time) : totalTime;
    remain.value = _totalTime!;
    !!cachedKey && storeHelper.remove(countDownCachedKey);
  };

  // 自动开始倒计 或 有已缓存倒计时值时会自动触发倒计时
  if (autoStart || storeHelper.get(countDownCachedKey)) {
    startCountDown();
  }

  return {
    counting,
    current,
    timeText,
    startCountDown,
    pauseCountDown,
    continuCountDown,
    resetCountDown
  };
}
