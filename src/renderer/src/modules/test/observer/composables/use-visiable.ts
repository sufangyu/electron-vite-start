import { useIntersectionObserver } from '@core/hooks';

export function useVisiable() {
  const target1 = ref(null);
  const target2 = ref(null);

  const { startObserve, stopObserve } = useIntersectionObserver({
    enterCallback(entry) {
      console.log('进入可视区域回', entry.target.innerHTML);
    },
    leaveCallback(entry) {
      console.log('离开可视区域回', entry.target.innerHTML);
    }
  });

  // fix: 修复 onMounted 中使用 nextTick 无法通过 ref 获取到 DOM 元素
  watch(
    () => [target1.value, target2.value],
    ([newTarget1, newTarget2]) => {
      if (newTarget1 && newTarget2) {
        startObserve([newTarget1!, newTarget2!]);
      }
    }
  );

  onMounted(() => stopObserve());

  return {
    target1,
    target2
  };
}
