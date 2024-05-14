<template>
  <nav class="app-window__navbar drag">
    <div class="navbar__title">{{ windowTitle }}</div>
    <div class="navbar__tools nodrag">
      <div class="tool-item" @click.stop="reloadWindow">
        <Refresh theme="outline" data-desc="刷新" />
      </div>
      <el-popover :offset="16" :width="160" trigger="click">
        <template #reference>
          <div class="tool-item mr-1">
            <More data-desc="更多" />
          </div>
        </template>

        <div>这是更多的菜单</div>
      </el-popover>
      <div class="tool-item" @click.stop="minWindow">
        <Minus data-desc="最小化" />
      </div>
      <div class="tool-item" @click.stop="maxWindow">
        <CollapseTextInput v-if="isMaxState" theme="outline" data-desc="恢复大小" />
        <ExpandTextInput v-else data-desc="最大化" />
      </div>
      <div class="tool-item" @click.stop="closeWindow">
        <Close theme="outline" :stroke-width="4" data-desc="关闭" />
      </div>
    </div>
  </nav>
</template>

<script lang="ts" setup>
import {
  Minus,
  Close,
  ExpandTextInput,
  CollapseTextInput,
  More,
  Refresh
} from '@icon-park/vue-next';
import { useWindow } from '@core/hooks';

const { isMaxState, windowTitle, reloadWindow, closeWindow, minWindow, maxWindow } = useWindow();
</script>

<style lang="scss" scoped>
.app-window__navbar {
  @apply px-2 relative z-[1001] select-none
    flex justify-center items-center
   bg-[#e5e7ea] dark:bg-[#030303];

  .navbar__title {
    @apply text-center text-sm;
  }

  .navbar__tools {
    @apply absolute top-0 right-2;
    display: flex;

    .tool-item {
      font-size: 16px;
      @apply ml-2 cursor-pointer px-1 h-[26px] my-[8px] rounded-[4px]
        flex justify-center items-center
        transition-all;

      &:hover {
        @apply bg-white/75 dark:bg-white/15;
      }
    }
  }
}
</style>
