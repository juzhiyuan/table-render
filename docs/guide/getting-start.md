---
order: 2
title: 快速上手
nav:
  order: 1
  title: 指南
toc: menu
---

## 安装

```shell
npm install table-render --save
```

## 基本使用

```js
import { ProTable, Search, TableContainer, useTable } from 'table-render';
```

render 里

```js
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
```
