/**
 * 主进程通知渲染进程回调函数
 *
 * @param event 事件名称/类型
 * @param data 通讯数据 {message: string; detail?: any}
 */
export type MainProcessNoticeCallback = (
  event: MainProcessNoticeCallbackEvent,
  /** 通讯传递的数据 {message: string; detail?: any}*/
  data?: MainProcessNoticeCallbackData
) => void;

/**
 * 事件名称/类型
 */
export type MainProcessNoticeCallbackEvent = '';

/**
 * 通讯传递的数据
 * @param message 事件名称/类型
 * @param detail 具体逻辑数据
 */
export type MainProcessNoticeCallbackData = {
  message: string;
  detail?;
};
