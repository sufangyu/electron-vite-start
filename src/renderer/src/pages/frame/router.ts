export default [
  {
    path: '/setting',
    redirect: '/setting',
    component: () => import('@layout/index'),
    children: [
      {
        name: 'Setting',
        path: '',
        component: () => import('./setting/views/index.vue'),
        meta: {
          title: '设置'
        }
      }
    ]
  },
  {
    name: 'NotFound',
    path: '/:anyPath(.*)*',
    component: () => import('./exception/views/404.vue'),
    meta: {
      title: '页面不存在'
    }
  }
];
