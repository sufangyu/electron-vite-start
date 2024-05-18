<template>
  <router-view></router-view>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

import { sleep } from '@core/utils';
import { useUpdater } from '@modules/frame/setting';
import { useAppSettingStore } from '@store/index';

useAppSettingStore();

const { checkUpdater } = useUpdater();
const checkUpdateOnBackground = async () => {
  await sleep(2500);
  checkUpdater();
};

onMounted(async () => {
  await checkUpdateOnBackground();
});
</script>
