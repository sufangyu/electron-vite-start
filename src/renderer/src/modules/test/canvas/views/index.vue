<template>
  <AppMain title="Canvas 应用">
    <section class="p-3">
      <Card title="电子签名">
        <Signature />
      </Card>
    </section>
  </AppMain>
</template>

<script lang="ts" setup>
import Signature from '@components/signature';
</script>

<style lang="scss" scoped></style>
