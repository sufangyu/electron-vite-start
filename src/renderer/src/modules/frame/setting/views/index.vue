<template>
  <AppMain title="设置">
    <section class="p-3">
      <Card title="主题设置">
        <div class="flex items-center gap-2 text-sm">
          主题：
          <el-radio-group
            :model-value="theme"
            size="small"
            @change="(val) => setTheme(val as APP_THEME)"
          >
            <el-radio-button
              v-for="item in themeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-radio-group>
        </div>
      </Card>

      <Card title="软件更新">
        <div class="flex items-center gap-2 text-sm">
          当前版本：{{ updater.versionInfo.currentVersion }}
          <!-- - {{ updateDialogVisible }} -->
          <!-- - {{ updateInfo.state }} -->
          <el-button
            type="primary"
            size="small"
            :loading="updater.updateInfo.state === UPDATER_STATE.CHECKING"
            :disabled="updater.updateInfo.state === UPDATER_STATE.DOWNLOADING"
            @click="() => checkUpdater(false)"
          >
            {{
              updater.updateInfo.state === UPDATER_STATE.CHECKING
                ? '正在检查'
                : updater.versionInfo.hasNewVersion
                  ? '发现新版本'
                  : '检查更新'
            }}
          </el-button>
          <!-- <el-button
          type="primary"
          size="small"
          :loading="updater.updateInfo.state === UPDATER_STATE.CHECKING"
          :disabled="updater.updateInfo.state === UPDATER_STATE.DOWNLOADING"
          @click="() => checkUpdater()"
        >
          静默检查
        </el-button> -->
        </div>
      </Card>

      <Card v-if="GLOBAL_DATA.IS_DEV || GLOBAL_DATA.IS_DEBUG" title="开发者工具">
        <el-button size="small" @click="directoryOpen(DIRECTORY_TYPE.STORE)">
          打开缓存目录
        </el-button>
        <el-button size="small" @click="directoryOpen(DIRECTORY_TYPE.LOGS)">
          打开日志目录
        </el-button>
      </Card>

      <Card v-if="GLOBAL_DATA.IS_DEV || GLOBAL_DATA.IS_DEBUG" title="请求代理">
        <RequestProxy />
      </Card>

      <Card v-if="GLOBAL_DATA.IS_DEV || GLOBAL_DATA.IS_DEBUG" title="请求头设置">
        <p class="text-xs mb-2">图片盗链（删除 Referer 请求头）</p>
        <div class="flex gap-2">
          <el-image
            style="width: 64px; height: 64px"
            fit="cover"
            :preview-src-list="[imgUrl]"
            :src="imgUrl"
          />
        </div>
      </Card>
    </section>
  </AppMain>

  <!-- 更新弹窗 -->
  <UpdaterDialog
    v-model:visible="updateDialogVisible"
    v-bind="updater.updateInfo"
    :has-new-version="updater.versionInfo.hasNewVersion"
    @close="resetUpdateInfo"
    @cancel="resetUpdateInfo"
    @confirm="handleConfirm"
  />
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';

import { APP_THEME, DIRECTORY_TYPE } from '@share/modules';

import UpdaterDialog from '@components/updater-dialog/index';
import { GLOBAL_DATA } from '@core/constans/global';
import { useDirectory } from '@core/hooks';
import { UPDATER_STATE, useUpdater } from '@modules/frame/setting';
import { themeOptions } from '@modules/frame/setting';
import { useAppSettingStore } from '@store/index';

import { RequestProxy } from '../components';

const { directoryOpen } = useDirectory();

const imgUrl =
  'https://upload-images.jianshu.io/upload_images/27400553-33da22b24af22744.jpg?imageMogr2/auto-orient/strip|imageView2/2/format/webp';

// 应用更新 -----------------------------------
const {
  updateDialogVisible,
  updater,
  resetUpdateInfo,
  checkUpdater,
  downloadUpdate,
  quitAndInstall
} = useUpdater();

const handleConfirm = () => {
  switch (updater.value.updateInfo.state) {
    case UPDATER_STATE.CHECKED_FINISHED:
      if (!updater.value.versionInfo.hasNewVersion) {
        return;
      }
      downloadUpdate();
      break;
    case UPDATER_STATE.DOWNLOAD_FINISHED:
      quitAndInstall();
      break;
  }
};

// 主题设置 -----------------------------------
const appSettingStore = useAppSettingStore();
const { setTheme } = appSettingStore;
const { theme } = storeToRefs(appSettingStore);
</script>

<style lang="scss" scoped></style>
