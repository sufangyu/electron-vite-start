<template>
  <el-form ref="formRef" size="small" :model="form" label-width="60px">
    <el-form-item label="开启:">
      <el-switch v-model="form.open" @change="handleChangeToggle" />
    </el-form-item>
    <el-form-item v-if="form.open" label="配置:" style="margin-bottom: 0">
      <el-form-item
        v-for="(configItem, idx) in form.requestProxy"
        :key="idx"
        :gutter="10"
        class="flex items-center"
        style="margin-bottom: 16px"
        :prop="`form.requestProxy.${idx}`"
        :rules="[
          {
            validator: (rule, value, callback) => validatorRequestProxy(rule, value, callback, idx),
            trigger: ['blur']
          }
        ]"
      >
        <div class="w-60">
          <el-input v-model="configItem.originalUrl" placeholder="原地址" />
        </div>
        <div class="px-2">
          <Switch size="14" :stroke-width="2" />
        </div>
        <div class="w-60">
          <el-input v-model="configItem.redirectUrl" placeholder="目标地址" />
        </div>
        <div>
          <span v-if="idx > 0" class="block px-2 cursor-pointer" @click="handleRemoveProxy(idx)">
            <ReduceOne size="18" :stroke-width="2" />
          </span>
          <span v-if="idx === 0" class="block px-2 cursor-pointer" @click="handleAddProxy">
            <AddOne size="18" :stroke-width="2" />
          </span>
        </div>
      </el-form-item>
    </el-form-item>
    <el-form-item label="">
      <el-button type="primary" @click="handleSubmit">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { AddOne, ReduceOne, Switch } from '@icon-park/vue-next';
import { ElMessage, FormInstance } from 'element-plus';
import { cloneDeep } from 'lodash-es';

import { RequestProxyItem } from '@share/modules';

import { protocolReg } from '@core/utils';
import { useAppSettingStore } from '@store/index';

const { requestProxy, setRequestProxy } = useAppSettingStore();

const formRef = ref<FormInstance>();
const form = ref<{
  open: boolean;
  requestProxy: RequestProxyItem[];
}>({
  open: true,
  requestProxy:
    requestProxy.length === 0 ? [{ originalUrl: '', redirectUrl: '' }] : cloneDeep(requestProxy)
});

const handleChangeToggle = (val: boolean) => {
  if (val && form.value.requestProxy.length === 0) {
    handleAddProxy();
  }
};

/**
 *  配置校验
 * @param _rule
 * @param _value
 * @param callback
 * @param idx
 */
const validatorRequestProxy = (_rule, _value, callback: (msg?: string) => void, idx: number) => {
  const { originalUrl, redirectUrl } = form.value.requestProxy[idx];

  if (originalUrl && !protocolReg.test(originalUrl)) {
    callback('原地址要以http://、https://开头');
  }

  if (originalUrl && !redirectUrl) {
    callback('目标地址不能为空');
  } else if (redirectUrl && !protocolReg.test(redirectUrl)) {
    callback('目标地址要以http://、https://开头');
  }

  callback();
};

/**
 * 添加代理配置
 */
const handleAddProxy = () => {
  form.value.requestProxy.push({
    originalUrl: '',
    redirectUrl: ''
  });
};

/**
 * 删除代理配置
 * @param index 序号
 */
const handleRemoveProxy = (index: number) => {
  form.value.requestProxy.splice(index, 1);
};

const handleSubmit = async () => {
  await formRef.value?.validate();
  const proxyConfigList = form.value.requestProxy.filter((it) => it.originalUrl && it.originalUrl);
  setRequestProxy(proxyConfigList);
  ElMessage.success({ message: '保存成功', grouping: true });
};
</script>

<style lang="scss" scoped></style>
