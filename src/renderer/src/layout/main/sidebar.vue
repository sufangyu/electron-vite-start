<template>
  <section class="sidebar drag">
    <div class="sidebar-top" @click="handleLogin">
      <div class="sidebar-top__logo nodrag">
        <el-image src="https://avatars.githubusercontent.com/u/1852629" />
      </div>
      <div class="sidebar-top__name nodrag">张三疯</div>
    </div>

    <div
      v-if="networkStatus === NETWORK_STATUS.OFFLINE"
      class="sidebar-network nodrag"
      @click="openNetworkSettings"
    >
      网络不可用，请检查
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
        <router-link :to="{ name: FRAME_ROUTER_NAME.SETTING }">
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
  ExchangeThree,
  Wifi,
  Protect,
  UploadOne,
  StopwatchStart,
  Compression,
  SettingTwo,
  PayCodeOne,
  ScanCode,
  Message,
  CubeThree,
  ListView,
  ViewGridCard,
  List,
  Merge,
  DownPicture,
  FileConversionOne,
  HamburgerButton
} from '@icon-park/vue-next';

import { NETWORK_STATUS } from '@share/modules/app';

import { useUpdater, useNetwork } from '@modules/frame/setting';
import { FRAME_ROUTER_NAME, TEST_ROUTER_NAME } from '@router/index';

const router = useRouter();
const { networkStatus, openNetworkSettings } = useNetwork();
const { updater } = useUpdater();

const nav = [
  { icon: AddWeb, label: '窗口管理', routeName: TEST_ROUTER_NAME.TEST_WINDOW },
  { icon: ExchangeThree, label: '进程/窗口通讯', routeName: TEST_ROUTER_NAME.TEST_IPC },
  { icon: Wifi, label: '网络请求', routeName: TEST_ROUTER_NAME.TEST_HTTP },
  { icon: Protect, label: '权限控制', routeName: TEST_ROUTER_NAME.TEST_AUTH },
  { icon: UploadOne, label: '文件上传', routeName: TEST_ROUTER_NAME.TEST_UPLOAD },
  { icon: StopwatchStart, label: '倒计时', routeName: TEST_ROUTER_NAME.TEST_COUNT_DOWN },
  { icon: PayCodeOne, label: '二维码生成', routeName: TEST_ROUTER_NAME.TEST_QR_CODE },
  { icon: ScanCode, label: '二维码识别', routeName: TEST_ROUTER_NAME.TEST_QR_CODE_SCAN },
  { icon: Message, label: '聊天框', routeName: TEST_ROUTER_NAME.TEST_IM_CHAT },
  { icon: CubeThree, label: 'Canvas 应用', routeName: TEST_ROUTER_NAME.TEST_CANVAS },
  { icon: ListView, label: '列表-表格', routeName: TEST_ROUTER_NAME.TEST_LIST_TABLE },
  { icon: ViewGridCard, label: '列表-卡片', routeName: TEST_ROUTER_NAME.TEST_LIST_CARD },
  { icon: List, label: '选择器', routeName: TEST_ROUTER_NAME.TEST_SELECT },
  { icon: Merge, label: '监听器', routeName: TEST_ROUTER_NAME.TEST_OBSERVER },
  { icon: DownPicture, label: 'DOM转图片', routeName: TEST_ROUTER_NAME.TEST_DOM_TO_IMAGE },
  { icon: FileConversionOne, label: '文件互转', routeName: TEST_ROUTER_NAME.TEST_FILE_CONVER },
  { icon: Compression, label: '视频压缩', routeName: 'VideoCompress' }
];

const handleLogin = () => {
  router.push({
    name: FRAME_ROUTER_NAME.LOGIN
  });
};
</script>

<style lang="scss" scoped>
.sidebar {
  @apply w-[144px] h-[100vh] flex flex-col text-[13px] select-none flex-shrink-0
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

.sidebar-network {
  @apply flex m-2 p-2 text-xs rounded-md cursor-pointer
    border-[1px] relative z-[5000000] text-center
    bg-[#f7efd1] border-red-200
    dark:bg-[#342d1a] dark:text-[#red] dark:border-yellow-900;
}

.sidebar-bottom {
  @apply h-[64px] mt-2 mb-4;
}

.nav-item {
  @apply mx-[8px] h-8 leading-8 rounded-md my-[1px] overflow-hidden transition-all;

  &:hover {
    @apply bg-[#dadcde] dark:bg-[#2e3032];
  }

  > a {
    @apply px-2 flex items-center gap-1;

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
