/**
 *
 *
 * @export
 * @param {intersectionObserverOptions} options
 * @return {*}
 */
export function useIntersectionObserver(options?: intersectionObserverOptions) {
  const { observerOptions, enterCallback, leaveCallback } = options ?? {};
  const curTargets: Element[] = [];

  /**
   * 监听回调函数
   *
   * @param {*} entries
   * @param {*} _observer
   */
  const callback: IntersectionObserverCallback = (entries, _observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        typeof enterCallback === 'function' && enterCallback?.(entry);
      } else {
        typeof leaveCallback === 'function' && leaveCallback?.(entry);
      }
    });
  };

  // 检查器
  let Observer: IntersectionObserver | null = null;

  /**
   * 开始对元素的监听
   *
   * @param {(Element[] | Element)} targets 被监听的元素或元素集合
   * @param {Element} root 相对交叉检查的容器
   */
  const startObserve = (targets: Element[] | Element, root?: Element) => {
    Observer = new IntersectionObserver(callback, {
      threshold: 0.1,
      root,
      ...observerOptions
    });
    Array.isArray(targets) ? curTargets.push(...targets) : curTargets.push(targets);
    curTargets.forEach((target) => Observer?.observe(target));
  };

  /**
   * 停止对元素的观察
   *
   */
  const stopObserve = () => {
    curTargets.forEach((target) => Observer?.unobserve(target));
  };

  /**
   * 断开观察
   *
   */
  const disconnectObserve = () => {
    Observer?.disconnect();
  };

  return {
    Observer,
    startObserve,
    stopObserve,
    disconnectObserve
  };
}

export interface intersectionObserverOptions {
  /**
   * IntersectionObserver 配置选项
   *
   * @type {null}
   * @memberof intersectionObserverOptions
   */
  observerOptions?: IntersectionObserverInit;
  /**
   * 进入可视区域回调函数
   *
   * @memberof intersectionObserverOptions
   */
  enterCallback?: (entry: IntersectionObserverEntry) => void;
  /**
   * 移除可视区域回调函数
   *
   * @memberof intersectionObserverOptions
   */
  leaveCallback?: (entry: IntersectionObserverEntry) => void;
}
