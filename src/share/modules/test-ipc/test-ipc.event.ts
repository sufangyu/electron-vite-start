/* eslint-disable @typescript-eslint/no-explicit-any */
import { EventKey } from 'electron-events';

/**
 * 给主进程发送信息
 *
 * - `EventKey`: 不传参
 * - `EventKey<T>`: T 参数
 */
export const TEST_IPC_CHANNEL__RENDERER_SEND_TO_MAIN: EventKey =
  'test-ipc-channel:renderer-send-to-main';

/**
 * 给主进程发送信息-带参数
 */
export const TEST_IPC_CHANNEL__RENDERER_SEND_TO_MAIN_WITH_ARGS: EventKey<{
  message: string;
  playload: Record<string, any>;
}> = 'test-ipc-channel:renderer-send-to-main:with-args';

/**
 * 给APP渲染进程发送信息
 */
export const TEST_IPC_CHANNEL__RENDERER_SEND_TO_SELF: EventKey =
  'test-ipc-channel:renderer-send-to-self';

/**
 * 给其他渲染进程/窗口一对一发送信息
 */
export const TEST_IPC_CHANNEL__RENDERER_SEND_ONE_TO_ONE: EventKey =
  'test-ipc-channel:renderer-send-one-to-one';

/**
 * 给其他渲染进程/窗口一对多发送信息
 */
export const TEST_IPC_CHANNEL__RENDERER_SEND_ONE_TO_SEVERAL: EventKey =
  'test-ipc-channel:renderer-send-one-to-several';

/**
 * 给主进程和其他任意渲染进程/窗口发送信息
 */
export const TEST_IPC_CHANNEL__RENDERER_SEND_ONE_TO_ALL: EventKey =
  'test-ipc-channel:renderer-send-one-to-all';

/**
 * 调用主进程获取数据
 */
export const TEST_IPC_CHANNEL__RENDERER_INVOKE_TO_MAIN: EventKey<{
  windlowName: string;
  data: Record<string, any>;
}> = 'test-ipc-channel:renderer-invoke-to-main';

/**
 * 调用自身事件获取数据
 */
export const TEST_IPC_CHANNEL__RENDERER_INVOKE_TO_SELF: EventKey<{
  windlowName: string;
  data: Record<string, any>;
}> = 'test-ipc-channel:renderer-invoke-to-self';

/**
 * 调用其他窗口事件取数据
 */
export const TEST_IPC_CHANNEL__RENDERER_INVOKE_ONE_TO_ONE: EventKey<{
  windlowName: string;
  data: Record<string, any>;
}> = 'test-ipc-channel:renderer-invoke-one-to-one';

// 触发多窗口事件
export const TEST_IPC_CHANNEL__RENDERER_INVOKE_ONE_TO_SEVERAL: EventKey =
  'test-ipc-channel:renderer-invoke-one-to-several';

// 触发主进程和所有窗口事件
export const TEST_IPC_CHANNEL__RENDERER_INVOKE_ONE_TO_ALL: EventKey =
  'test-ipc-channel:renderer-invoke-one-to-all';
