<template>
  <div class="card">
    <h2>{{ title }}</h2>
    <slot />
  </div>
</template>

<script lang="ts" setup>
interface Props {
  title: string;
}

withDefaults(defineProps<Props>(), {
  title: ''
});
</script>

<style lang="scss" scoped>
.card {
  @apply mb-3 p-3 rounded-lg
  bg-white dark:bg-[#1d1e1f];

  h2 {
    @apply text-sm mb-2 opacity-80
    text-slate-700 dark:text-slate-50;
  }
}
</style>
