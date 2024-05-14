<template>
  <section v-if="title" class="app-main__page-title drag">
    <h2>{{ title }}</h2>
    <span class="nodrag page-title__close" @click="$router.back()">
      <el-tooltip content="关闭" placement="bottom">
        <Close />
      </el-tooltip>
    </span>
  </section>
  <section class="app-main__wrapper">
    <el-scrollbar>
      <slot />
    </el-scrollbar>
  </section>
</template>

<script lang="ts" setup>
import { Close } from '@icon-park/vue-next';

interface Props {
  title?: string;
}

withDefaults(defineProps<Props>(), {
  title: ''
});

const $router = useRouter();
</script>

<style lang="scss" scoped>
.app-main__page-title {
  @apply flex items-center justify-between h-12 px-4 text-sm
    select-none border-b relative z-50
    bg-gray-200/50
    dark:bg-[#181819] dark:border-gray-800;

  .page-title__close {
    @apply text-lg cursor-pointer
      dark:text-white;
  }
}

.app-main__wrapper {
  @apply flex-1 overflow-auto;
}
</style>
