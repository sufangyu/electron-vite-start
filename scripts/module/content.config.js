const defaultContentConfig = [`export {};`, ``];

const permissionContentConfig = [
  `import { useAuth } from '@core/hooks';`,
  ``,
  `// 权限配置`,
  `const PEEMISSION = Object.freeze({});`,
  ``,
  `const { AUTH_RESULT } = useAuth(PEEMISSION);`,
  ``,
  `export default AUTH_RESULT;`,
  ``
];

const entryContent = [
  `export * from './api/index';`,
  `export * from './composables/index';`,
  `export * from './constant/index';`,
  `export * from './permission/index';`,
  `export * from './types/index';`,
  ``
];

const vueContentConfig = [
  `<template>`,
  `  <section></section>`,
  `</template>`,
  ``,
  `<script lang="ts" setup></script>`,
  ``,
  `<style lang="scss" scoped></style>`,
  ``
];

module.exports = {
  defaultContentConfig,
  entryContent,
  permissionContentConfig,
  vueContentConfig
};
