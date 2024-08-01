export interface Props {
  /**
   * 是否使用虚拟化选择器, 默认 false
   *
   * - 为 true 时, 必须设置 options 属性
   *
   * @type {boolean}
   * @memberof Props
   */
  virtual?: boolean;
  /**
   * 是否有全选按钮, 只在 多选 情况下才起作用, 默认 false
   *
   * @type {boolean}
   * @memberof Props
   */
  checkAllVisiable?: boolean;
  /**
   * 选择器框的宽度
   *
   * @type {string}
   * @memberof Props
   */
  width?: string;
  /**
   * 是否显示分页, 默认 false
   *
   * @type {boolean}
   * @memberof Props
   */
  pagination?: boolean;
  /**
   * 分页配置
   *
   * @type {{
   *     pageNum?: number; // 每页显示条数, 默认: 1
   *     pageSize?: number; // 当前页, 默认: 5
   *     pagerCount?: number; // 按钮数，超过时会折叠, 默认: 5
   *     total?: number; // 总条数, 默认: 0
   *     layout?: string; // 组件布局, 子组件名用逗号分隔, 默认: 'total, prev, pager, next, jumper'. 不建议使用 sizes 布局
   *   }}
   * @memberof Props
   */
  paginationOption?: {
    pageNum?: number; // 每页显示条数, 默认: 1
    pageSize?: number; // 当前页, 默认: 5
    pagerCount?: number; // 按钮数，超过时会折叠, 默认: 5
    total?: number; // 总条数, 默认: 0
    layout?: string; // 组件布局, 子组件名用逗号分隔, 默认: 'total, prev, pager, next, jumper'. 不建议使用 sizes 布局
  };
}
