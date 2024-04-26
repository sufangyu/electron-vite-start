<template>
  <div class="app-detault">
    <Sidebar class="app-sidebar" />

    <div class="app-main">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import Sidebar from './sidebar.vue';
// import Navbar from '@renderer/components/navbar.vue';
</script>

<style lang="scss" scoped>
.app-detault {
  @apply flex;

  .app-main {
    @apply flex-1;
  }
}
</style>
