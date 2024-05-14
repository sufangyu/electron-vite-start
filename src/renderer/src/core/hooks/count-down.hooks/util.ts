import type { CurrentTime } from './types';

/**
 * 浏览器在下一次重绘之前指定回调函数
 * @param {FrameRequestCallback} fn 回调函数
 * @returns {number}
 */
export const raf = (fn: FrameRequestCallback): number => {
  return window.requestAnimationFrame?.(fn);
};

/**
 * 取消指定的浏览器在下一次重绘之前指定回调函数
 * @param id 任务 ID
 */
export const cancelRaf = (id: number) => {
  window.cancelAnimationFrame?.(id);
};

/**
 * 反格式化时间
 * @param {number} time 时间戳
 * @returns {{CurrentTime}}
 */
export const parseTime = (time: number): CurrentTime => {
  const SECOND = 1000;
  const MINUTE = 60 * SECOND;
  const HOUR = 60 * MINUTE;
  const DAY = 24 * HOUR;

  const days = Math.floor(time / DAY);
  const hours = Math.floor((time % DAY) / HOUR);
  const minutes = Math.floor((time % HOUR) / MINUTE);
  const seconds = Math.floor((time % MINUTE) / SECOND);
  const milliseconds = Math.floor(time % SECOND);

  return {
    timestamp: time,
    days,
    hours,
    minutes,
    seconds,
    milliseconds
  };
};

/**
 * 格式化时间
 * @param {string} format 格式化格式
 * @param {CurrentTime} currentTime 反格式化时间信息
 * @returns
 */
export const parseFormat = (format: string, currentTime: CurrentTime): string => {
  let _format = format;
  const { days } = currentTime;
  let { hours, minutes, seconds, milliseconds } = currentTime;

  // 天
  if (_format.includes('DD')) {
    _format = _format.replace('DD', padZero(days));
  } else if (_format.includes('D')) {
    _format = _format.replace('D', `${days}`);
  } else {
    hours += days * 24;
  }

  // 时
  if (_format.includes('HH')) {
    _format = _format.replace('HH', padZero(hours));
  } else if (_format.includes('H')) {
    _format = _format.replace('H', `${hours}`);
  } else {
    minutes += hours * 60;
  }

  // 分
  if (_format.includes('mm')) {
    _format = _format.replace('mm', padZero(minutes));
  } else if (_format.includes('m')) {
    _format = _format.replace('m', `${minutes}`);
  } else {
    seconds += minutes * 60;
  }

  // 秒
  if (_format.includes('ss')) {
    _format = _format.replace('ss', padZero(seconds));
  } else if (_format.includes('s')) {
    _format = _format.replace('s', `${seconds}`);
  } else {
    milliseconds += seconds * 1000;
  }

  // 毫秒
  if (_format.includes('S')) {
    const ms = padZero(milliseconds, 3);

    if (_format.includes('SSS')) {
      _format = _format.replace('SSS', ms);
    } else if (_format.includes('SS')) {
      _format = _format.replace('SS', ms.slice(0, 2));
    } else {
      _format = _format.replace('S', ms.charAt(0));
    }
  }

  return _format;
};

/**
 * 数字长度不足前面补充0
 * @param num
 * @param targetLength
 * @returns
 */
export const padZero = (num: number | string, targetLength = 2): string => {
  let str = num + '';

  while (str.length < targetLength) {
    str = '0' + str;
  }
  return str;
};

export const storeHelper = {
  /**
   * 获取缓存中剩余时间
   *
   * @param {string} cachedKey
   * @return {*}  {number}
   */
  get(cachedKey: string): number {
    const cachVal = localStorage.getItem(cachedKey);
    return cachVal ? Number(cachVal) : 0;
  },
  /**
   * 设置剩余时间缓存
   *
   * @param {string} cachedKey
   * @param {number} val
   */
  set(cachedKey: string, val: number): void {
    localStorage.setItem(cachedKey, `${val}`);
  },
  /**
   * 删除剩余时间缓存
   *
   * @param {string} cachedKey
   */
  remove(cachedKey: string) {
    localStorage.removeItem(cachedKey);
  }
};
