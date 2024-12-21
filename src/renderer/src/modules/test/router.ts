import type { RouteRecordRaw } from 'vue-router';

export enum TEST_ROUTER_NAME {
  TEST_WINDOW = 'TestWindow',
  TEST_WINDOW_TOOLS = 'TestWindowTools',
  TEST_RESULT = 'TestResult',
  TEST_IPC = 'TestIpc',
  TEST_IPC_FOO = 'TestIpcFoo',
  TEST_IPC_BAR = 'TestIpcBar',
  TEST_HTTP = 'TestHttp',
  TEST_AUTH = 'TestAuth',
  TEST_UPLOAD = 'TestUpload',
  TEST_COUNT_DOWN = 'TestCountDown',
  TEST_QR_CODE = 'TestQRCode',
  TEST_QR_CODE_SCAN = 'TestQRCodeScan',
  TEST_IM_CHAT = 'TestImChat',
  TEST_CANVAS = 'TestCanvas',
  TEST_LIST_TABLE = 'TestListTable',
  TEST_LIST_CARD = 'TestListCard',
  TEST_SELECT = 'TestListSelect',
  TEST_OBSERVER = 'TestListObserver',
  TEST_DOM_TO_IMAGE = 'TestDomToImage',
  TEST_FILE_CONVER = 'TestFileConver',
  TEST_DICTIONARY = 'TestDictionary',
  TEST_GET_IMAGE_COLORS = 'TestGetImageColors'
}

export default [
  {
    path: '/test',
    component: () => import('@layout/index'),
    children: [
      {
        path: 'window',
        name: TEST_ROUTER_NAME.TEST_WINDOW,
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
      },
      {
        path: 'upload',
        name: TEST_ROUTER_NAME.TEST_UPLOAD,
        component: () => import('./upload/views/index.vue'),
        meta: { title: '文件上传' }
      },
      {
        path: 'count-down',
        name: TEST_ROUTER_NAME.TEST_COUNT_DOWN,
        component: () => import('./count-down/views/index.vue'),
        meta: { title: '倒计时' }
      },
      {
        path: 'qr-code',
        name: TEST_ROUTER_NAME.TEST_QR_CODE,
        component: () => import('./qrcode/views/index.vue'),
        meta: { title: '二维码生成' }
      },
      {
        path: 'qr-code-scan',
        name: TEST_ROUTER_NAME.TEST_QR_CODE_SCAN,
        component: () => import('./qrcode-scan/views/index.vue'),
        meta: { title: '二维码识别' }
      },
      {
        path: 'im-chat',
        name: TEST_ROUTER_NAME.TEST_IM_CHAT,
        component: () => import('./im-chat/views/index.vue'),
        meta: { title: '聊天框' }
      },
      {
        path: 'canvas',
        name: TEST_ROUTER_NAME.TEST_CANVAS,
        component: () => import('./canvas/views/index.vue'),
        meta: { title: 'Canvas 应用' }
      },
      {
        path: 'list/table',
        name: TEST_ROUTER_NAME.TEST_LIST_TABLE,
        component: () => import('./list/views/table.vue'),
        meta: { title: '列表-表格' }
      },
      {
        path: 'list/card',
        name: TEST_ROUTER_NAME.TEST_LIST_CARD,
        component: () => import('./list/views/card.vue'),
        meta: { title: '列表-卡片' }
      },
      {
        path: 'select',
        name: TEST_ROUTER_NAME.TEST_SELECT,
        component: () => import('./select/views/index.vue'),
        meta: { title: '选择器' }
      },
      {
        path: 'observer',
        name: TEST_ROUTER_NAME.TEST_OBSERVER,
        component: () => import('./observer/views/index.vue'),
        meta: { title: '监听器' }
      },
      {
        path: 'dom-to-image',
        name: TEST_ROUTER_NAME.TEST_DOM_TO_IMAGE,
        component: () => import('./dom-to-image/views/index.vue'),
        meta: { title: 'DOM 转图片' }
      },
      {
        path: 'file-conver',
        name: TEST_ROUTER_NAME.TEST_FILE_CONVER,
        component: () => import('./file-conver/views/index.vue'),
        meta: { title: '文件互转' }
      },
      {
        path: 'dictionary',
        name: TEST_ROUTER_NAME.TEST_DICTIONARY,
        component: () => import('./dictionary/views/index.vue'),
        meta: { title: '字典表' }
      },
      {
        path: 'image-colors',
        name: TEST_ROUTER_NAME.TEST_GET_IMAGE_COLORS,
        component: () => import('./image-colors/views/index.vue'),
        meta: { title: '图片取色' }
      }
    ]
  },

  // 窗口通讯页面
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
        name: TEST_ROUTER_NAME.TEST_WINDOW_TOOLS,
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
