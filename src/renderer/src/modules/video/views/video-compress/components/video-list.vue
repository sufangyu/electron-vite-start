<template>
  <section class="vedio-list">
    <el-scrollbar>
      <template v-if="files.length > 0">
        <VideoItem
          v-for="(item, idx) in files"
          :key="`${item.name}-${idx}`"
          :video="item"
          :index="idx"
        />
      </template>

      <el-empty v-else :image-size="64" description="暂无压缩视频！" />
    </el-scrollbar>
  </section>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useVideoConfigStore } from '@store/index';
import VideoItem from './video-item.vue';

// 响应式数据（https://pinia.vuejs.org/zh/core-concepts/#%E4%BB%8E-Store-%E8%A7%A3%E6%9E%84）
const { files } = storeToRefs(useVideoConfigStore());
</script>

<style lang="scss" scoped>
.vedio-list {
  height: calc(100vh - 48px - 285px);
}
</style>
