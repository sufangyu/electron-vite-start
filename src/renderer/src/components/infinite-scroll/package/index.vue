<template>
  <div ref="rootTargetRef" class="infinite-scroll">
    <el-scrollbar>
      <!-- 默认插槽 -->
      <slot></slot>

      <!-- 当数据为空时的内容插槽	 -->
      <slot v-if="empty" name="empty">
        <div class="infinite-scroll__empty">
          <p class="infinite-scroll__empty-icon"><FileTextOne :stroke-width="2" /></p>
          <p class="infinite-scroll__empty-text">{{ emptyText }}</p>
        </div>
      </slot>

      <div ref="observeTargetRef"></div>
      <div
        v-if="!empty"
        :class="{
          'infinite-scroll__status': true,
          [`infinite-scroll__status--${status}`]: true
        }"
        @click="handleStatus"
      >
        {{ statusText }}
      </div>
    </el-scrollbar>
  </div>
</template>

<script lang="ts" setup>
import { FileTextOne } from '@icon-park/vue-next';

import { useInfiniteScroll, InfiniteScrollStatus } from '@core/hooks';

import { Props } from './types';

const props = withDefaults(defineProps<Props>(), {
  status: 'normal',
  empty: false,
  emptyText: '暂无数据',
  normalText: '下拉加载更多',
  loadingText: '加载中...',
  finishedText: '没有更多了',
  errorText: '加载失败, 请重试'
});

const emits = defineEmits<{
  (event: 'loadMore'): void;
}>();

const statusText = computed(() => {
  const statusMap = {
    normal: props.normalText,
    loading: props.loadingText,
    error: props.errorText,
    finished: props.finishedText
  };
  return statusMap[props.status];
});

const { rootTargetRef, observeTargetRef, triggerObserve } = useInfiniteScroll({
  loadMore: async () => {
    emits('loadMore');
  }
});

// fix: 加载完第一页后未满屏（常规模式, 手动触发一次检查）
watch(
  () => props.status,
  (val) => val === 'normal' && triggerObserve()
);

const handleStatus = async () => {
  const statusList: InfiniteScrollStatus[] = ['error', 'normal'];
  if (statusList.includes(props.status)) {
    emits('loadMore');
  }
};
</script>

<style lang="scss" scoped>
.infinite-scroll {
  height: 100%;
  overflow-y: auto;

  &__empty {
    @apply p-14 flex flex-col items-center justify-center opacity-60;
    font-size: 42px;
  }

  &__empty-text {
    @apply text-xs opacity-60 mt-2;
  }

  &__status {
    @apply py-3 text-[13px] opacity-50 text-center;
    line-height: 1;

    &--normal,
    &--error {
      @apply cursor-pointer;
    }
  }
}
</style>
