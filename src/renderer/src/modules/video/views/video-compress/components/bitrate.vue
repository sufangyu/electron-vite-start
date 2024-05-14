<template>
  <section class="video-bitrate">
    <h3 class="text-sm text-slate-500">码率</h3>
    <el-slider v-model="bitrate" size="small" class="flex-1" />
  </section>
</template>

<script lang="ts" setup>
// TODO: 支持码率设置

const bitrate = ref(10);
</script>

<style lang="scss" scoped>
.video-bitrate {
  @apply p-3 flex gap-2
  bg-white dark:bg-[#1d1e1f];
}
</style>
