export enum TEST_ROUTER_NAME {
  TEST_WINDLW = 'TestWindow'
}

export default [
  {
    path: '/test',
    component: () => import('@renderer/layout'),
    children: [
      {
        name: TEST_ROUTER_NAME.TEST_WINDLW,
        path: 'window',
        component: () => import('./window/views/index.vue'),
        meta: {
          title: '创建窗口'
        }
      }
    ]
  },

  {
    path: '/test/window/tools',
    component: () => import('@layout/window/index.vue'),
    children: [
      {
        name: 'TestWindowTools',
        path: '',
        component: () => import('./window/views/result.vue'),
        meta: {
          title: '窗口-自定义工具栏'
        }
      }
    ]
  },

  {
    path: '/test/:id',
    component: () => import('@renderer/layout/empty.vue'),
    children: [
      {
        name: 'TestResult',
        path: '',
        component: () => import('./window/views/result.vue'),
        meta: {
          title: '窗口结果'
        }
      }
    ]
  }
];
