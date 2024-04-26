<template>
  <section class="video-config">
    <el-select v-model="config.size" placeholder="">
      <el-option v-for="(item, idx) in config.sizeOptions" :key="idx" :label="item" :value="item" />
    </el-select>

    <el-select v-model="config.fps" placeholder="">
      <el-option v-for="(item, idx) in config.fpsOptions" :key="idx" :label="item" :value="item" />
    </el-select>
  </section>
</template>

<script lang="ts" setup>
import { useVideoConfigStore } from '@renderer/store/index';

const { config } = useVideoConfigStore();
</script>

<style lang="scss" scoped>
.video-config {
  @apply p-3 flex gap-2
  bg-white dark:bg-[#1d1e1f];
}
</style>
