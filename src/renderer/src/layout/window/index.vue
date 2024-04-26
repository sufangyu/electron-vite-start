<template>
  <div class="app-window">
    <Navbar />

    <section class="app-window__content">
      <el-scrollbar>
        <router-view></router-view>
      </el-scrollbar>
    </section>
  </div>
</template>

<script lang="ts" setup>
import Navbar from './navbar.vue';
</script>

<style lang="scss" scoped>
$navbar-height: 40px;

.app-window {
  height: 100vh;
}

.app-window__navbar {
  height: $navbar-height;
  line-height: $navbar-height;
}

.app-window__content {
  height: calc(100vh - $navbar-height);
}
</style>
