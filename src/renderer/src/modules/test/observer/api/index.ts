import http from '@core/http';

import * as Types from '../types';

export const getRequest = (params: Types.GetRequestReq) => {
  return http.get<Types.GetRequestRes>({
    url: '/api/list',
    params
  });
};
