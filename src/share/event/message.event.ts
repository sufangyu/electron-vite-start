/**
 * 信息通知广播事件
 */
export enum MESSAGE_EVENT_FOR_NOTICE {
  /** 提示信息 */
  INFO = 'message-notice:info',
  /** 警告信息 */
  WARNNING = 'message-notice:warnning',
  /** 成功信息 */
  SUCCESS = 'message-notice:success',
  /** 错误信息 */
  ERROR = 'message-notice:error'
}
