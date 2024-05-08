import { ref } from 'vue';
import { defineStore } from 'pinia';
import { Account } from '@modules/account';

export default defineStore(
  'account',
  () => {
    const account = ref<Account | null>(null);
    const accessToken = ref<string>('');
    const refreshToken = ref<string>('');

    /**
     * 设置帐号信息
     *
     * @param {Account} newAccount
     */
    const setAccount = (newAccount?: Account | null): void => {
      account.value = newAccount ?? null;
      accessToken.value = newAccount?.accessToken ?? '';
      refreshToken.value = newAccount?.refreshToken ?? '';
    };

    return {
      account,
      setAccount,
      accessToken,
      refreshToken
    };
  },
  {
    persist: {
      paths: ['account', 'accessToken', 'refreshToken']
    }
  }
);
