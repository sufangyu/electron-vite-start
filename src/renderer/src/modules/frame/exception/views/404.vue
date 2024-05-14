<template>
  <section class="exception">
    <div class="result">
      <div class="result-title">404</div>
      <div class="result-subtitle">对不起，访问的页面不存在</div>
      <div class="result-extra">
        <el-button type="primary" @click="goHome">返回首页</el-button>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';

const router = useRouter();
const goHome = () => {
  router.replace('/');
};
</script>

<style lang="scss" scoped>
.exception {
  height: calc(100vh - 37px - 32px);
  @apply flex items-center justify-center select-none;
}
.result {
  @apply flex flex-col items-center justify-center;

  &-title {
    @apply text-4xl mb-4;
  }
  &-subtitle {
    @apply text-sm text-slate-500 mb-6;
  }
}
</style>
