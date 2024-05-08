import { ref } from 'vue';
import { ElMessage, FormInstance } from 'element-plus';
import { useBaseRequest } from '@core/hooks';
import { useAccountStore } from '@store/index';
import * as Types from '../types';
import { loginApi, logoutApi } from '../api';

export default () => {
  const loginFormRef = ref<FormInstance>();
  const { setAccount } = useAccountStore();

  // 登录 ===========================================================
  const {
    params: loginForm,
    loading,
    data,
    handleRequest
  } = useBaseRequest<Types.AccountLoginRes, Types.AccountLoginReq>({
    request: {
      api: loginApi,
      params: {
        username: '',
        password: ''
      }
    }
  });

  const handleLogin = async (formEl: FormInstance | undefined) => {
    if (!formEl) {
      return;
    }

    const res = await formEl.validate();
    if (!res) {
      return;
    }

    await handleRequest();
    if (!data.value) {
      return;
    }

    ElMessage.success('登录成功');
    setAccount(data.value);
  };

  // 退出登录 ========================================================
  const { handleRequest: handleLogoutRequest } = useBaseRequest({
    request: {
      api: logoutApi
    }
  });

  const handleLogout = async () => {
    const res = await handleLogoutRequest();
    if (!res?.success) {
      return;
    }

    setAccount(null);
    ElMessage.success('退出成功');
  };

  return {
    // 登录
    loginFormRef,
    loginForm,
    loading,
    data,
    handleLogin,
    // 退出登录
    handleLogout
  };
};
