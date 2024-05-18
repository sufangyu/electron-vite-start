import http from '@core/http';

import * as Types from '../types';

export const loginApi = (data: Types.AccountLoginReq) => {
  return http.post<Types.AccountLoginRes>({
    url: '/api/user/login',
    data
  });
};

export const logoutApi = () => {
  return http.post({
    url: '/api/user/logout'
  });
};

/**
 * 获取帐号详细信息
 * @param id
 * @returns
 */
export const accountDetailApi = (id: string) => {
  return http.get<Types.Account>({
    url: `/api/user/${id}`
  });
};

/**
 * 获取帐号详细信息
 * @param id
 * @returns
 */
export const accountDetailApi2 = (id: string) => {
  return http.get<Types.Account>({
    url: `/api/user-detail/${id}`
  });
};
