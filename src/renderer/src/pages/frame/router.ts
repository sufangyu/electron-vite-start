export enum FRAME_ROUTER_NAME {
  SETTING = 'Setting',
  LOGIN = 'Login',
  NOT_FOUND = 'NotFound'
}

export default [
  {
    path: '/setting',
    redirect: FRAME_ROUTER_NAME.SETTING,
    component: () => import('@layout/index'),
    children: [
      {
        path: '',
        name: FRAME_ROUTER_NAME.SETTING,
        component: () => import('./setting/views/index.vue'),
        meta: { title: '设置' }
      }
    ]
  },
  {
    path: '/login',
    redirect: FRAME_ROUTER_NAME.LOGIN,
    component: () => import('@layout/index'),
    children: [
      {
        path: '',
        name: FRAME_ROUTER_NAME.LOGIN,
        component: () => import('./account/views/login.vue'),
        meta: { title: '登录' }
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
