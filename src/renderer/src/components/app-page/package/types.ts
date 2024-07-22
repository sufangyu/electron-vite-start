import { CSSProperties } from 'vue';

import { RowProps, ColProps } from 'element-plus';

export interface Props {
  /**
   * 宽度
   *
   * @type {number}
   * @memberof Props
   */
  asideWidth?: number;
  /**
   * 侧边栏的样式
   *
   * @type {CSSProperties}
   * @memberof Props
   */
  asideStyle?: CSSProperties;
  /**
   * 头部属性配置
   * - row: 默认 {}
   * - col: 默认 {xs: 24, sm: 12, md: 12, lg: 8, xl: 6}
   * - collapsable: 是否显示展开&收起按钮, 默认 true
   *
   * @type {{
   *     row?: Partial<RowProps>;
   *     col?: Partial<ColProps>;
   *     collapsable?: number;
   *   }}
   * @memberof Props
   */
  header?: {
    row?: Partial<RowProps>;
    col?: Partial<ColProps>;
    collapsable?: boolean;
  };
  /**
   * 内容主区域是否有滚动条容器, 默认 false
   *
   * - 非table列表建议设置为 true
   * @type {boolean}
   * @memberof Props
   */
  bodyScrollbar?: boolean;
}

export type SlotsTypes = {
  'aside-header': void;
  'aside-body': void;
  'aside-footer': void;
  header: { collapse?: boolean; handleCollapse?: () => void };
  'body-extend': void;
  footer: void;
};
