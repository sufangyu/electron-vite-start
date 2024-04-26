<template>
  <PageTitle title="压缩配置" />

  <section class="p-3">
    <div class="config-item">
      <Card title="分辨率">
        <SizeFpsSet
          type="size"
          select-placeholder="请选择分辨率"
          add-placeholder="请输入如：1920x1080的格式"
          button-type="primary"
        />
      </Card>

      <Card title="帧数">
        <SizeFpsSet
          type="fps"
          select-placeholder="请选择帧数"
          add-placeholder="请输入如：30的数值"
          button-type="success"
        />
      </Card>

      <Card title="视频保存目录">
        <div class="flex gap-1">
          <el-input v-model="config.videoSaveDirectory" placeholder="请选择" disabled />
          <el-button type="primary" @click="handleSelectDirectory">选择</el-button>
        </div>
      </Card>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { useVideoConfigStore } from '@store/index';
import PageTitle from '@components/page-title.vue';
import Card from '@components/card.vue';
import SizeFpsSet from '../components/size-fps-set.vue';

const { config } = useVideoConfigStore();

const handleSelectDirectory = async () => {
  const directory = await window.api?.directorySelect?.();

  if (directory) {
    config.videoSaveDirectory = directory;
  }
};
</script>

<style lang="scss" scoped></style>
