<template>
  <PageTitle title="视频压缩" />
  <section class="p-3 flex flex-col">
    <SizeFps class="" />
    <Bitrate />
    <Action class="mt-5" />
    <Button class="mt-3" />
    <VideoLst class="mt-5" />
  </section>
</template>

<script lang="ts" setup>
import PageTitle from '@components/page-title.vue';
import SizeFps from '../components/size-fps.vue';
import Bitrate from '../components/bitrate.vue';
import Action from '../components/aciton.vue';
import Button from '../components/button.vue';
import VideoLst from '../components/video-list.vue';
</script>

<style lang="scss" scoped></style>
