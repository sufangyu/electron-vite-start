import { DirectiveBinding } from 'vue';

import { useIntersectionObserver } from '@core/hooks';

/**
 * 自定义图片懒加载指令
 *
 * 示例:
 * ```TS
 * // 基本使用
 * <img v-for="url in urls" :key="url" v-lazyload="{ url }" />
 *
 * // 配置错误占位图
 * <img v-for="url in urls" :key="url" v-lazyload="{ url, errUrl: 'xxx' }" />
 * ```
 */
export default {
  name: 'lazyload',
  /**
   * 元素已渲染
   *
   * @param {Element} el
   * @param {DirectiveBinding<{ url: string; errUrl?: string }>} binding 传入参数(url: 图片地址; errUrl: 错误占位图)
   */
  mounted(el: Element, binding: DirectiveBinding<{ url: string; errUrl?: string }>) {
    const { url = '', errUrl = 'https://tdesign.gtimg.com/demo/demo-image-1.png' } =
      binding.value ?? {};
    const { startObserve, stopObserve } = useIntersectionObserver({
      observerOptions: {
        threshold: 0
      },
      enterCallback(entry) {
        entry.target.setAttribute('src', url);

        entry.target.addEventListener('error', () => {
          entry.target.setAttribute('src', errUrl);
        });

        // 进入可视区之后停止观察
        stopObserve();
      }
    });

    startObserve(el);
  }
};
