import { ResDictionaryItem } from '@renderer/core/hooks/dictionary.hooks/types';
import { sleep } from '@renderer/core/utils';

const dictData: ResDictionaryItem[] = [
  {
    dictId: 'd-101',
    dictCode: 'it',
    dictName: 'IT字典',
    values: [
      { id: '101', parentId: '', value: '101', label: '一级字典值1', disabled: false },
      { id: '102', parentId: '', value: '102', label: '一级字典值2', disabled: false },
      { id: '103', parentId: '', value: '103', label: '一级字典值3', disabled: false },
      { id: '104', parentId: '', value: '104', label: '一级字典值4', disabled: false },
      { id: '105', parentId: '', value: '105', label: '一级字典值5', disabled: false },
      { id: '106', parentId: '', value: '106', label: '一级字典值6 - 禁用项', disabled: true },
      { id: '111', parentId: '101', value: '111', label: '二级字典值1', disabled: false },
      { id: '112', parentId: '101', value: '112', label: '二级字典值2', disabled: false },
      { id: '113', parentId: '101', value: '113', label: '二级字典值3', disabled: false },
      { id: '114', parentId: '101', value: '114', label: '二级字典值4', disabled: false },
      { id: '115', parentId: '101', value: '115', label: '二级字典值5', disabled: false },
      { id: '116', parentId: '102', value: '116', label: '二级字典值6', disabled: false },
      { id: '117', parentId: '102', value: '117', label: '二级字典值7', disabled: false },
      { id: '118', parentId: '103', value: '118', label: '二级字典值8', disabled: false },
      { id: '119', parentId: '103', value: '119', label: '二级字典值9', disabled: false },
      { id: '120', parentId: '103', value: '120', label: '二级字典值10', disabled: false },
      { id: '121', parentId: '104', value: '121', label: '二级字典值11', disabled: false },
      { id: '122', parentId: '104', value: '122', label: '二级字典值12', disabled: false },
      { id: '123', parentId: '104', value: '123', label: '二级字典值13', disabled: false }
    ]
  },
  {
    dictId: 'd-102',
    dictCode: 'work',
    dictName: 'work字典',
    values: [
      { id: 'w-101', parentId: '', value: 'w-101', label: '一级字典值1' },
      { id: 'w-102', parentId: '', value: 'w-102', label: '一级字典值2' },
      { id: 'w-103', parentId: '', value: 'w-103', label: '一级字典值3' },
      { id: 'w-104', parentId: '', value: 'w-104', label: '一级字典值4' },
      { id: 'w-105', parentId: '', value: 'w-105', label: '一级字典值5' }
    ]
  }
];

/**
 * 获取字典列表
 *
 * @param {{
 *   codes: string[];
 *   isEnable?: boolean;
 * }} data
 * @return {*}  {Promise<ResDictionaryItem[]>}
 */
export const getDictList = async (data: {
  codes: string[];
  isEnable?: boolean;
}): Promise<ResDictionaryItem[]> => {
  const { codes } = data;
  const result: ResDictionaryItem[] = [];
  dictData.forEach((item) => {
    if (codes.includes(item.dictCode!)) {
      result.push(item);
    }
  });

  await sleep(1250);
  return Promise.resolve(result);
};
