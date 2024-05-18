<template>
  <AppMain title="用户登录">
    <section class="p-3">
      <Card title="登录">
        <el-form ref="loginFormRef" :model="loginForm">
          <el-form-item
            prop="username"
            :rules="[
              {
                required: true,
                message: '用户名不能为空',
                trigger: ['change', 'blur']
              }
            ]"
          >
            <el-input v-model="loginForm.username" placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item
            prop="password"
            :rules="[
              {
                required: true,
                message: '密码不能为空',
                trigger: ['change', 'blur']
              }
            ]"
          >
            <el-input v-model="loginForm.password" type="password" placeholder="请输入用户名" />
          </el-form-item>

          <el-form-item>
            <el-button
              style="width: 100%"
              type="primary"
              :loading="loading"
              @click="handleLogin(loginFormRef)"
            >
              确定登录
            </el-button>
          </el-form-item>
        </el-form>
      </Card>

      <Card title="用户信息" class="text-sm">
        <p>
          userInfo:
          {{
            [account?.userInfo.id, account?.userInfo.username, account?.userInfo.email].join(', ')
          }}
        </p>
        <p>accessToken: {{ account?.accessToken }}</p>
        <p>refreshToken: {{ account?.refreshToken }}</p>
        <p>
          <el-button type="danger" size="small" @click="handleLogout">退出登录</el-button>
        </p>
      </Card>

      <Card title="Token 刷新" class="text-sm">
        <el-button size="small" @click="handleSendRequest">发起请求</el-button>
      </Card>
    </section>
  </AppMain>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';

import { useAccount, accountDetailApi, accountDetailApi2 } from '@modules/frame/account';
import { useAccountStore } from '@store/index';

const { account } = storeToRefs(useAccountStore());
const { loginFormRef, loginForm, loading, handleLogin, handleLogout } = useAccount();

const handleSendRequest = () => {
  accountDetailApi('1');
  accountDetailApi2('2');

  setTimeout(async () => {
    await accountDetailApi2('3');
    await accountDetailApi2('4');
  }, 10);
};
</script>

<style lang="scss" scoped></style>
