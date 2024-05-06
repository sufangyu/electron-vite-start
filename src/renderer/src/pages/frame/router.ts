export enum FRAME_ROUTER_NAME {
  SETTING = 'Setting',
  NOT_FOUND = 'NotFound'
}

export default [
  {
    path: '/setting',
    redirect: '/setting',
    component: () => import('@layout/index'),
    children: [
      {
        path: '',
        name: FRAME_ROUTER_NAME.SETTING,
        component: () => import('./setting/views/index.vue'),
        meta: {
          title: '设置'
        }
      }
    ]
  },
  {
    path: '/:anyPath(.*)*',
    name: FRAME_ROUTER_NAME.NOT_FOUND,
    component: () => import('./exception/views/404.vue'),
    meta: {
      title: '页面不存在'
    }
  }
];
