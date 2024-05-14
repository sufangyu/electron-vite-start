import http from '@core/http';
import * as Types from '../types';

export const getRequest = (params: Types.GetRequestReq) => {
  return http.get<Types.GetRequestRes>({
    url: '/api/list',
    headers: {
      'x-custom-header': 'custom-header'
    },
    params
  });
};

export const getSearchRequest = (id?: number) => {
  return http.get<Types.GetRequestListItem[]>({
    url: `/api/search/${id}`
  });
};

export const postRequest = (data: Types.PostRequestReq) => {
  return http.post<Types.PostRequestRes>({
    url: '/api/post',
    data
  });
};

export const putRequest = (data: Types.PutRequestReq) => {
  return http.put<Types.PutRequestRes>({
    url: '/api/put',
    data
  });
};

export const deleteRequest = (id: string) => {
  return http.delete({ url: `/api/delete/${id}` });
};

export const baseRequest = (id: string, data: Types.BaseRequestReq) => {
  return http.post<Types.BaseRequestRes>({
    url: `/api/base/${id}`,
    data
  });
};

/**
 * 获取响应结果
 * @param result 响应结果
 * @returns
 */
export const getResponseResult = (result: 'success' | 'fail') => {
  return http.get({
    url: `/api/response/${result}`
  });
};

/**
 * 获取请求状态
 * @param status 状态码
 * @returns
 */
export const getRequestStatus = (status: number) => {
  return http.get({
    url: `/api/status/${status}`,
    loading: false,
    isIgnoreCancel: [403].includes(status)
  });
};
