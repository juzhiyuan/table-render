import { defineConfig } from 'dumi';

export default defineConfig({
  title: 'table-render',
  favicon:
    'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',
  logo:
    'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',
  outputPath: 'docs-dist',
  navs: [
    null,
    {
      title: 'GitHub',
      path: 'https://github.com/form-render/table-render',
    },
    {
      title: '更新日志',
      path:
        'https://github.com/form-render/table-render/blob/master/CHANGELOG.md',
    },
  ],
  mode: 'site',
  base: '/table-render/',
  publicPath: '/table-render/',
  exportStatic: {},
  // more config: https://d.umijs.org/config
});
