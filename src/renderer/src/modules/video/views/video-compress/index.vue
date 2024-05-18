<template>
  <AppMain title="视频压缩">
    <section class="p-3 flex flex-col">
      <SizeFps class="" />
      <Bitrate />
      <Action class="mt-5" />
      <Button class="mt-3" />
      <VideoLst class="mt-5" />
    </section>
  </AppMain>
</template>

<script lang="ts" setup>
import Action from './components/aciton.vue';
import Bitrate from './components/bitrate.vue';
import Button from './components/button.vue';
import SizeFps from './components/size-fps.vue';
import VideoLst from './components/video-list.vue';
</script>

<style lang="scss" scoped></style>
