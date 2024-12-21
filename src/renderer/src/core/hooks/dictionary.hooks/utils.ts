import { DictionaryItem } from './types';

/**
 * 将扁平数据转换为树结构
 * @param data 扁平的字典数组
 * @param idKey 唯一标识键，默认是 'id'
 * @param parentKey 父级标识键，默认是 'parentId'
 * @returns 树结构的数组
 */
export const buildTree = (
  data: DictionaryItem[],
  idKey: string = 'id',
  parentKey: string = 'parentId'
): DictionaryItem[] => {
  const itemMap = new Map<string, DictionaryItem>();

  // 建立 id -> item 的映射
  data.forEach((item) => {
    itemMap.set(item[idKey], { ...item, children: [] });
  });

  const tree: DictionaryItem[] = [];

  data.forEach((item) => {
    const currentItem = itemMap.get(item[idKey]);

    if (!currentItem) return;

    if (item[parentKey]) {
      // 如果有父节点，将当前节点加入到父节点的 children 中
      const parentItem = itemMap.get(item[parentKey]);
      if (parentItem) {
        parentItem.children?.push(currentItem);
      }
    } else {
      // 如果没有父节点，则为根节点
      tree.push(currentItem);
    }
  });

  return tree;
};
