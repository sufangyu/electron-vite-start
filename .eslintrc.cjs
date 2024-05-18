/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  plugins: ['@typescript-eslint', 'import'],
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    '@electron-toolkit',
    '@electron-toolkit/eslint-config-ts/eslint-recommended',
    '@vue/eslint-config-typescript/recommended',
    '@vue/eslint-config-prettier'
  ],
  rules: {
    'vue/require-default-prop': 'off',
    'vue/multi-word-component-names': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        args: 'all',
        argsIgnorePattern: '^_',
        caughtErrors: 'all',
        caughtErrorsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        ignoreRestSiblings: true
      }
    ],
    'sort-imports': 'off',
    'import/order': [
      'error',
      {
        groups: [
          'builtin', // 内置模块
          'external', // 外部模块
          'internal', // 内部引用
          [
            'parent', // 父节点依赖
            'sibling', // 兄弟依赖
            'index' // index 文件
          ],
          'type', // 类型文件
          'unknown'
        ],
        // 通过路径自定义分组
        pathGroups: [
          {
            pattern: '{vue,vue-router,pinia,pinia-**}',
            group: 'builtin',
            position: 'after'
          },
          {
            pattern: 'element-plus',
            group: 'external'
            // position: 'before'
          },
          {
            pattern: '{@share/**,@main/**,@renderer/**}',
            group: 'internal',
            position: 'after'
          },
          {
            pattern: '{@core/**,@layout/**,@components/**,@store/**,@router/**,@modules/**}',
            group: 'parent',
            position: 'before'
          }
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
        // 是否开启独特组，用于区分自定义规则分组和其他规则分组
        distinctGroup: true,
        // 每个分组之间换行
        'newlines-between': 'always',
        // 相同分组排列规则 按字母升序排序
        alphabetize: { order: 'asc', caseInsensitive: true }
      }
    ]
  }
};
