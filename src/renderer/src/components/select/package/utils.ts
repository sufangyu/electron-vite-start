/* eslint-disable @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any */
import { VNode, VNodeNormalizedChildren } from 'vue';

/**
 * 是否是 el-option 标签
 *
 * @param {VNode} vnode
 * @return {*}  {boolean}
 */
const isElOption = (vnode: VNode): boolean => (vnode?.type as any)?.name === 'ElOption';

/**
 * 是否是 el-option-group 标签
 *
 * @param {VNode} vnode
 * @return {*}  {boolean}
 */
const isElOptionGroup = (vnode: VNode): boolean => (vnode?.type as any)?.name === 'ElOptionGroup';

/**
 * 递归获取下拉选项列表（兼容分组情况）
 *
 * @template T
 * @param {VNode} vnode
 * @param {T[]} result
 */
const extractOptionsFromVNode = <T = any>(vnode: VNode, result: T[]): void => {
  const children = vnode.children as VNodeNormalizedChildren | undefined;

  if (Array.isArray(children)) {
    children.forEach((child: any) => {
      if (isElOption(child)) {
        result.push(child?.props as T);
      } else if (isElOptionGroup(child)) {
        const options = child?.children.default() ?? [];
        options.forEach((optionVNode) => {
          extractOptionsFromVNode(optionVNode, result);
        });
      } else {
        extractOptionsFromVNode(child, result);
      }
    });
  } else if (isElOption(vnode)) {
    result.push(vnode.props as T);
  } else if (isElOptionGroup(vnode)) {
    const options = (vnode.children as any)?.default() ?? [];
    options.forEach((optionVNode) => {
      extractOptionsFromVNode(optionVNode, result);
    });
  }
};

/**
 * 根据 slot 提取下拉选项列表
 *
 * @template T
 * @param {(Record<string, Function> | undefined)} slots 插槽
 * @return {*}  {T[]}
 */
export const extractOptionsBySlot = <T = any>(slots: Record<string, Function> | undefined): T[] => {
  const result: T[] = [];
  const defaultSlot = slots?.default() ?? [];
  defaultSlot.forEach((vnode) => {
    extractOptionsFromVNode<T>(vnode, result);
  });

  return result;
};

interface Option {
  label: string;
  value: any;
  options?: Option[];
}

/**
 * 递归处理 options
 *
 * @param {Option[]} options
 * @param {Option[]} result
 */
const processOptions = (options: Option[], result: Option[]): void => {
  options.forEach((option) => {
    if (option?.options) {
      // 递归处理嵌套的 options
      processOptions(option?.options, result);
    } else {
      result.push(option);
    }
  });
};

/**
 * 根据传入的数据提取下拉选项列表
 *
 * @param {Option[]} [options]
 * @return {*}  {Option[]}
 */
export const extractOptions = (options?: Option[]): Option[] => {
  const result: Option[] = [];

  processOptions(options ?? [], result);
  return result;
};
