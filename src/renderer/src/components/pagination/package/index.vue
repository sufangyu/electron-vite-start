<template>
  <el-pagination
    :layout="layout"
    :background="background"
    :size="size"
    :total="total"
    v-bind="$attrs"
  />
</template>

<script lang="ts" setup>
import { Props } from './types';

withDefaults(defineProps<Props>(), {
  layout: 'total, sizes, prev, pager, next, jumper',
  size: 'small',
  background: true,
  // FIX: ElementPlusError: [ElPagination] 你使用了一些已被废弃的用法，请参考 el-pagination 的官方文档
  total: undefined
});
</script>

<style lang="scss" scoped></style>
