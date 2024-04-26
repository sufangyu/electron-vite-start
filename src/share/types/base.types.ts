/**
 * IPC 通讯协议
 *
 * @export
 * @interface IpcData
 * @template T 具体数据类型
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface IpcData<T = any> {
  message?: string;
  detail: T;
}
