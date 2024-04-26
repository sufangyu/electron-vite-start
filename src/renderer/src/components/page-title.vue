<template>
  <section>
    <section class="page-title drag">
      <h2>{{ title }}</h2>
      <span class="nodrag page-title__close" @click="$router.back()">
        <el-tooltip content="关闭" placement="bottom">
          <Close />
        </el-tooltip>
      </span>
    </section>
  </section>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { Close } from '@icon-park/vue-next';

interface Props {
  title: string;
}

withDefaults(defineProps<Props>(), {
  title: ''
});

const $router = useRouter();
</script>

<style lang="scss" scoped>
.page-title {
  @apply flex items-center justify-between h-12 px-4 text-sm
    select-none border-b 
    bg-gray-200/50
    dark:bg-[#181819] dark:border-gray-800;

  &__close {
    @apply text-lg cursor-pointer
      dark:text-white;
  }
}
</style>
