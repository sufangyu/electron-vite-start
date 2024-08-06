import { useIntersectionObserver } from './intersection-observer.hooks';

export type InfiniteScrollStatus = 'normal' | 'loading' | 'finished' | 'error';

export interface InfiniteScrollOptions {
  status?: InfiniteScrollStatus;
  loadMore: () => void;
}

export function useInfiniteScroll(options?: InfiniteScrollOptions) {
  const { loadMore } = options ?? {};
  const rootTargetRef = ref<Element | null>(null);
  const observeTargetRef = ref<Element | null>(null);

  const { startObserve, stopObserve } = useIntersectionObserver({
    enterCallback() {
      if (typeof loadMore === 'function') {
        loadMore();
      }
    }
  });

  watch(
    () => observeTargetRef.value,
    (ele) => {
      ele && startObserve(ele!, rootTargetRef.value!);
    }
  );

  /**
   * 主动触发观察
   *
   */
  const triggerObserve = () => {
    stopObserve();
    startObserve(observeTargetRef.value!, rootTargetRef.value!);
  };

  /**
   * 重试回调函数
   *
   */
  const reloadMore = () => {
    if (typeof loadMore === 'function') {
      loadMore();
    }
  };

  onUnmounted(() => {
    stopObserve();
  });

  return {
    rootTargetRef,
    observeTargetRef,
    triggerObserve,
    reloadMore
  };
}
