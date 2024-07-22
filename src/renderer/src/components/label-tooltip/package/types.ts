import { Component } from 'vue';

import { ElTooltipProps } from 'element-plus';

export interface Props {
  /**
   * 标签文本
   *
   * @type {string}
   * @memberof Props
   */
  label: string;
  colon?: boolean;
  /**
   * tooltip 组件配置项
   *
   * @type {Partial<ElTooltipProps>}
   * @memberof Props
   */
  tooltip?: Partial<ElTooltipProps>;
  /**
   * tooltip 图标
   *
   * @type {Component}
   * @memberof Props
   */
  toolTipIcon?: Component;
}
