import { AdjustWidthOptions } from './table.types';

export function useTable() {
  /**
   * 自定适应宽度
   *
   * - 作用: 根据内容最大宽度来设置该列的宽度
   * - 常用于 el-table 右侧固定列在设置固定宽度时, 而操作按钮个数不确定会出现宽度浪费
   * - 使用时列的内容要使用一个根元素包裹, 并且设置样式 `white-space: nowrap; display: inline-block` 使其保持不换行
   * 
   * 示例:
   * 
   * ```html
      <el-table-column
        label="操作"
        fixed="right"
        :resizable="false"
        :width="adjustWidth({ className: 'operation-actions' })"
      >
        <template #default="{ $index }">
          <div class="operation-actions" style="white-space: nowrap; display: inline-block">
            <el-button v-if="[1, 2, 4].includes($index)" size="small" type="primary">退回</el-button>
            <el-button v-if="[2].includes($index)" size="small" type="primary">审核</el-button>
            <el-button size="small" type="danger">删除</el-button>
            <el-button size="small" type="default">启用</el-button>
          </div>
        </template>
      </el-table-column>
   * ```
   *
   * @param {AdjustWidthOptions} {
   *     className = '',
   *     offsetWidth = 24,
   *     defaultWidth = 80
   *   }
   * @return {*}  {number}
   */
  const adjustWidth = ({
    className = '',
    offsetWidth = 24,
    defaultWidth = 80
  }: AdjustWidthOptions): number => {
    if (!className) {
      return defaultWidth;
    }

    const $elements = document.querySelectorAll(`.${className}`);
    const widthList: number[] = [];

    $elements?.forEach((item) => {
      const { width } = item.getBoundingClientRect();
      widthList.push(width);
    });

    const curWidth = widthList.length > 0 ? Math.max(...widthList) + offsetWidth : defaultWidth;
    return curWidth;
  };

  return {
    adjustWidth
  };
}
