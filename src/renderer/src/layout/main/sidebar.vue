<template>
  <section class="sidebar drag">
    <div class="sidebar-top">
      <div class="sidebar-top__logo nodrag">
        <el-image src="https://avatars.githubusercontent.com/u/1852629" />
      </div>
      <div class="sidebar-top__name nodrag">张三疯</div>
    </div>

    <div class="sidebar-nav">
      <el-scrollbar>
        <div v-for="(item, idx) in nav" :key="idx" class="nav-item nodrag">
          <router-link :to="{ name: item.routeName }">
            <component :is="item.icon" />
            <span class="nav-item__label">{{ item.label }}</span>
            <span class="nav-item__extra"></span>
          </router-link>
        </div>
      </el-scrollbar>
    </div>

    <div class="sidebar-bottom">
      <div class="nav-item nodrag">
        <router-link :to="{ name: 'Setting' }">
          <SettingTwo />
          <span class="nav-item__label">
            <span class="badge-wrapper">
              设置
              <i v-if="updater.versionInfo.hasNewVersion" class="badge" />
            </span>
          </span>
        </router-link>
      </div>
      <div class="nav-item nodrag">
        <router-link :to="{ path: '/' }">
          <HamburgerButton />
          <span class="nav-item__label">更多</span>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  AddWeb,
  Compression,
  Mail,
  DocDetail,
  Schedule,
  VideoConference,
  MoreApp,
  AddressBook,
  SettingTwo,
  HamburgerButton
} from '@icon-park/vue-next';
import { TEST_ROUTER_NAME } from '@renderer/router';
import { useUpdater } from '@renderer/modules/updater/composables';

const { updater } = useUpdater();

const nav = [
  { icon: AddWeb, label: '窗口', routeName: TEST_ROUTER_NAME.TEST_WINDLW },
  { icon: Compression, label: '视频压缩', routeName: 'VideoCompress' },
  { icon: Mail, label: '邮件', routeName: 'NotFound' },
  { icon: DocDetail, label: '文档', routeName: 'NotFound' },
  { icon: Schedule, label: '日程', routeName: 'NotFound' },
  { icon: VideoConference, label: '会议', routeName: 'NotFound' },
  { icon: MoreApp, label: '工作台', routeName: 'NotFound' },
  { icon: AddressBook, label: '通讯录', routeName: 'NotFound' }
];
</script>

<style lang="scss" scoped>
.sidebar {
  @apply w-[144px] h-[100vh] flex flex-col text-sm select-none
    bg-[#E9E7EA] dark:bg-[#1e1c21];
}

.sidebar-nav {
  @apply flex-1 overflow-y-auto;
}

.sidebar-top {
  @apply flex items-center gap-2
    pt-10 px-4 h-[100px];

  &__logo {
    @apply w-[24px] h-[24px] rounded-md overflow-hidden
      bg-[#ccc];
  }
}

.sidebar-bottom {
  @apply h-[64px] mt-2 mb-4;
}

.nav-item {
  @apply mx-[12px] h-8 leading-8 rounded-md my-[1px] overflow-hidden transition-all;

  &:hover {
    @apply bg-[#dadcde] dark:bg-[#2e3032];
  }

  > a {
    @apply px-2 flex items-center gap-2;

    &.router-link-active {
      @apply bg-[#c9d2e7] text-[#4f7be1]
      dark:bg-[#282f46];
    }
  }

  &__icon {
    @apply block w-4 h-4 rounded-md bg-slate-300;
  }
}

.badge-wrapper {
  @apply relative;

  .badge {
    @apply absolute top-[-2px] right-[-4px] block w-[6px] h-[6px] bg-red-500 rounded-full;
  }
}
</style>
