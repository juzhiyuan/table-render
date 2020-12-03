# Table Render - 中后台表单解决方案

## 简介

1. [文档地址](https://form-render.github.io/table-render/)
2. [更新日志](https://github.com/form-render/table-render/blob/master/CHANGELOG.md)

## 使用方法

```
npm i table-render --save
```

```js
import React from 'react';
import { ProTable, Search, TableContainer, useTable } from 'table-render';

// 可以使用schema编辑器配置 https://form-render.github.io/schema-generator/
const schema = {
  type: 'object',
  properties: {
    created_at: {
      title: '创建时间',
      type: 'string',
      format: 'date',
      'ui:width': '25%',
    },
  },
};

// 配置完全透传antd table
const columns = [
  {
    title: '标题',
    dataIndex: 'title',
  },
  {
    title: '状态',
    dataIndex: 'state',
    enum: {
      open: '未解决',
      closed: '已解决',
    },
  },
  {
    title: '创建时间',
    key: 'since',
    dataIndex: 'created_at',
    valueType: 'date',
  },
  {
    title: '操作',
    render: row => (
      <a
        href="https://x-render.gitee.io/form-render/"
        target="_blank"
        rel="noopener noreferrer"
      >
        查看
      </a>
    ),
  },
];

const searchApi = params => {
  return {
    rows: [
      {
        id: 624748504,
        title: 'mock数据1',
        state: 'closed',
        created_at: '2020-05-26T09:42:56Z',
      },
      {
        id: 624691229,
        title: 'mock数据2',
        state: 'open',
        created_at: '2020-05-26T08:19:22Z',
      },
    ],
    total: 2,
  };
};

const Demo = () => {
  return (
    <TableContainer searchApi={searchApi}>
      <Search {...searchSchema} />
      <ProTable
        headerTitle="高级表单"
        toolbarRender={() => [
          <Button key="1">查看日志</Button>,
          <Button key="2">导出数据</Button>,
          <Button key="3">创建</Button>,
        ]}
        // 下面全是antd的props
        columns={columns}
        rowKey="id"
      />
    </TableContainer>
  );
};

export default Demo;
```

![](https://img.alicdn.com/tfs/TB1Ma6itBBh1e4jSZFhXXcC9VXa-2172-516.png)
