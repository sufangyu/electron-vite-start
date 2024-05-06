import { RouteRecordRaw } from 'vue-router';

export enum TEST_ROUTER_NAME {
  TEST_WINDLW = 'TestWindow',
  TEST_WINDLW_TOOLS = 'TestWindowTools',
  TEST_RESULT = 'TestResult',
  TEST_IPC = 'TestIpc',
  TEST_IPC_FOO = 'TestIpcFoo',
  TEST_IPC_BAR = 'TestIpcBar',
  TEST_HTTP = 'TestHttp',
  TEST_AUTH = 'TestAuth'
}

export default [
  {
    path: '/test',
    component: () => import('@layout/index'),
    children: [
      {
        path: 'window',
        name: TEST_ROUTER_NAME.TEST_WINDLW,
        component: () => import('./window/views/index.vue'),
        meta: { title: '窗口管理' }
      },
      {
        path: 'ipc',
        name: TEST_ROUTER_NAME.TEST_IPC,
        component: () => import('./ipc/views/index.vue'),
        meta: { title: '进程/窗口通讯' }
      },
      {
        path: 'http',
        name: TEST_ROUTER_NAME.TEST_HTTP,
        component: () => import('./http/views/index.vue'),
        meta: { title: '进程/窗口通讯' }
      },
      {
        path: 'auth',
        name: TEST_ROUTER_NAME.TEST_AUTH,
        component: () => import('./auth/views/index.vue'),
        meta: { title: '权限控制' }
      }
    ]
  },

  {
    path: '/test',
    component: () => import('@layout/empty.vue'),
    children: [
      // 进程/窗口通讯结果页
      {
        path: 'ipc/foo',
        name: TEST_ROUTER_NAME.TEST_IPC_FOO,
        component: () => import('./ipc/views/foo.vue'),
        meta: { title: 'foo 窗口' }
      },
      {
        path: 'ipc/bar',
        name: TEST_ROUTER_NAME.TEST_IPC_BAR,
        component: () => import('./ipc/views/bar.vue'),
        meta: { title: 'bar 窗口' }
      }
    ]
  },

  {
    path: '/test/window/tools',
    component: () => import('@layout/window/index.vue'),
    children: [
      {
        name: TEST_ROUTER_NAME.TEST_WINDLW_TOOLS,
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
    component: () => import('@layout/empty.vue'),
    children: [
      {
        name: TEST_ROUTER_NAME.TEST_RESULT,
        path: '',
        component: () => import('./window/views/result.vue'),
        meta: {
          title: '窗口结果'
        }
      }
    ]
  }
] as RouteRecordRaw[];
