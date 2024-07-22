/* eslint-disable @typescript-eslint/no-explicit-any */
import { SlotsType, VNode } from 'vue';

import { Up, Down } from '@icon-park/vue-next';
import { merge } from 'lodash-es';

import { Props, SlotsTypes } from './types';
import './styles.scss';

export default defineComponent({
  name: 'AppPage',
  props: {
    /**
     * 宽度
     * @type {number}
     */
    asideWidth: {
      type: Number as PropType<Props['asideWidth']>,
      default: 240
    },
    /**
     * 侧边栏的样式
     *
     * @type {CSSProperties}
     */
    asideStyle: {
      type: Object as PropType<Props['asideStyle']>,
      default: () => ({})
    },
    /**
     * 头部属性配置
     * - row: 默认 {}
     * - col: 默认 {xs: 24, sm: 12, md: 12, lg: 8, xl: 6}
     * - collapsable: 默认 true
     *
     * @type {{
     *     row?: Partial<RowProps>;
     *     col?: Partial<ColProps>;
     *     collapsable?: boolean;
     *   }}
     */
    header: {
      type: Object as PropType<Props['header']>,
      default: () => ({
        row: { gutter: 10 },
        col: { xs: 24, sm: 12, md: 12, lg: 8, xl: 6 },
        collapsable: true
      })
    },
    /**
     * 内容主区域是否有滚动条容器, 默认 false
     * - 非table列表建议设置为 true
     * @type {boolean}
     */
    bodyScrollbar: {
      type: Boolean as PropType<Props['bodyScrollbar']>,
      default: false
    }
  },
  slots: Object as SlotsType<SlotsTypes>,
  setup(props, { slots }) {
    const { asideWidth, asideStyle = {}, header, bodyScrollbar } = props;
    const headerAttrs = merge(
      {},
      { row: { gutter: 8 }, col: { xs: 24, sm: 12, md: 12, lg: 8, xl: 6 }, collapsable: true },
      header
    );

    const collapse = ref(false);
    const handleCollapse = () => (collapse.value = !collapse.value);

    /**
     * 渲染侧边栏
     * @returns
     */
    const renderAside = () => {
      const asideHeader = slots['aside-header'];
      const asideBody = slots['aside-body'];
      const asideFooter = slots['aside-footer'];

      const hasAside = !!asideHeader || !!asideBody || !!asideFooter;

      return hasAside ? (
        <aside
          data-desc="侧栏内容"
          class="app-page-aside"
          style={{
            width: `${asideWidth}px`,
            ...asideStyle
          }}
        >
          {asideHeader && <header class="app-page-aside__header">{asideHeader?.()}</header>}

          {asideBody && (
            <section class="app-page-aside__body">
              <el-scrollbar>{asideBody?.()}</el-scrollbar>
            </section>
          )}

          {asideFooter && <footer class="app-page-aside__header">{asideFooter?.()}</footer>}
        </aside>
      ) : null;
    };

    /**
     * 渲染展开收起按钮
     *
     * @return {*}
     */
    const renderCollapseButton = (): VNode => {
      const { collapsable } = headerAttrs;
      return (
        <el-button v-show={collapsable} onClick={handleCollapse}>
          {collapse.value ? '收起' : '展开'}
          {collapse.value ? <Up /> : <Down />}
        </el-button>
      );
    };

    /**
     * 获取最后一项 form-item 的虚拟DOM
     *
     * @param {{ children: any; type: Component }} vNode
     * @return {*}
     */
    const getFormItemLastVNode = (vNode: { children: any; type: Component }) => {
      const _defaultRender = vNode.children.default;

      vNode.children = {
        default: () => [_defaultRender(), renderCollapseButton()]
      };

      return vNode;
    };

    /**
     * 获取主区域头部虚拟DOM
     *
     * - 处理是查询表单（el-form、el-form-item）, 自动适配为多列布局
     * @returns
     */
    const getMainHeaderVNode = () => {
      const mainHeader = slots['header'];
      const mainHeaderVNode = mainHeader?.({
        collapse: collapse.value,
        handleCollapse
      });

      mainHeaderVNode?.forEach((vNodeItem, index) => {
        const { children, type } = vNodeItem;

        // 处理搜索的表单
        if ((type as Component).name === 'ElForm') {
          const rawNodes = (children as any)?.default?.() as [];
          const newNodes = [
            <el-row {...headerAttrs?.row}>
              {rawNodes?.map((item: { children: any; type: Component; dirs?: any[] }, idx) => {
                const isLastNode = idx === rawNodes.length - 1;

                // 不是表单元素
                if (item.type.name !== 'ElFormItem') {
                  return item;
                }

                // v-show="false" 指令
                const showDir = item.dirs?.find((dirItem) => {
                  return dirItem.dir.name === 'show';
                });
                if (showDir && !showDir.value) {
                  return null;
                }

                const newNode = isLastNode ? getFormItemLastVNode(item) : [item];
                return <el-col {...headerAttrs?.col}>{newNode}</el-col>;
              })}
            </el-row>
          ];

          // 重置 slot
          mainHeaderVNode[index].children = {
            default: () => newNodes
          };
        }
      });

      return mainHeaderVNode;
    };

    /**
     * 渲染主内容
     * @returns
     */
    const renderMain = () => {
      const mainHeader = slots['header'];
      const mainBodyExtend = slots['body-extend'];
      const mainBody = slots['default'];
      const mainFooter = slots['footer'];

      const mainHeaderVNode = getMainHeaderVNode();

      return (
        <article data-desc="主内容" class="app-page-main">
          {typeof mainHeader === 'function' && (
            <header class="app-page-main__header">{mainHeaderVNode}</header>
          )}

          <section class="app-page-main__body">
            {mainBodyExtend && <div class="body-extend">{mainBodyExtend?.()}</div>}
            <div class="body-content">
              {bodyScrollbar ? (
                <el-scrollbar class="overflow-hidden">{mainBody?.()}</el-scrollbar>
              ) : (
                mainBody?.()
              )}
            </div>
          </section>

          {mainFooter && <footer class="app-page-main__footer">{mainFooter?.()}</footer>}
        </article>
      );
    };

    return () => (
      <div class="app-page">
        {renderAside()}
        {renderMain()}
      </div>
    );
  }
});
