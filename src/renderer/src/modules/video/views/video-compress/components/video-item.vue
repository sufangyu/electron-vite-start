<template>
  <section
    :class="['video-item', `video-item--${video?.state}`]"
    :style="`--progress:${video?.progress}%; --bgColor:${getBgColor(video!)}`"
  >
    <div class="title">
      {{ video?.name }}
      - {{ video?.state }}
      <!--  - {{ video?.progress?.toFixed(2) }} -->
    </div>
    <div class="icon" @click="() => removeFile(index)">
      <close-one theme="outline" size="14" :stroke-width="3" />
    </div>
  </section>
</template>

<script lang="ts" setup>
import { type Video } from '@share/modules';
import { CloseOne } from '@icon-park/vue-next';
import { useVideo } from '../composables';

interface Props {
  /** 视频文件 */
  video: Video | null;
  /** 索引 */
  index: number;
}

const { video } = withDefaults(defineProps<Props>(), {
  video: null
});

const { removeFile, getBgColor } = useVideo();
</script>

<style lang="scss" scoped>
.video-item {
  @apply px-3 py-[8px] rounded-lg mb-2 mx-3 text-xs 
    flex justify-between items-center gap-2 relative
    bg-white text-slate-600
    dark:bg-[#1d1e1f] dark:text-slate-50;

  &::after {
    content: '';
    width: var(--progress);
    background-color: var(--bgColor);
    @apply absolute top-0 bottom-0 left-0 right-0 rounded-lg;
  }

  &--error {
    &::after {
      width: 100%;
    }
  }
}

.title {
  @apply truncate z-10;
}

.icon {
  @apply opacity-60 cursor-pointer z-10
    hover:text-yellow-500 hover:opacity-90 hover:scale-125 duration-300
    text-slate-500 dark:text-slate-300;
}
</style>
