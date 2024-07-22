<template>
  <span class="flex items-center">
    <span>{{ labelStr }}</span>
    <el-tooltip v-bind="tooltip">
      <!-- 插槽透传 -->
      <template v-for="(_item, key, index) in $slots" :key="index" #[key]>
        <slot :name="key"></slot>
      </template>
      <Component :is="toolTipIcon" class="ml-1 mr-0.5 cursor-help" />
    </el-tooltip>
    <span v-if="colon">:</span>
  </span>
</template>

<script lang="ts" setup>
import { Help } from '@icon-park/vue-next';

import { Props } from './types';

defineOptions({
  name: 'LabelTooltip'
});

const props = withDefaults(defineProps<Props>(), {
  label: '',
  colon: true,
  tooltip: () => ({
    placement: 'top'
  }),
  toolTipIcon: Help
});

const labelStr = computed(() => {
  return props.label.replace(/[：:]/g, '');
});
</script>

<style lang="scss" scoped></style>
