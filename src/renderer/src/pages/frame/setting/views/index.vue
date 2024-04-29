<template>
  <AppMain title="设置">
    <section class="p-3">
      <Card title="主题设置">
        <div class="flex items-center gap-2 text-sm">
          主题：
          <el-radio-group :model-value="theme" size="small" @change="setTheme">
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
import UpdaterDialog from '@components/updater-dialog/index.vue';
import AppMain from '@components/app-main/index.vue';
import Card from '@components/card.vue';
import { UPDATER_STATE } from '@modules/updater/types';
import { useUpdater } from '@modules/updater/composables';
import { themeOptions } from '@modules/theme/constants';
import { useAppSettingStore } from '@store/index';

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
