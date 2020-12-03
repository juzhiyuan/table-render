---
nav:
  order: 1
  title: 教程
toc: menu
---

## 基本 demo

<code src='./demo/basic.jsx' />

## 最简 demo

<code src='./demo/simplest.jsx' />

## 使用 valueType

<code src='./demo/valueType.jsx' />

## 使用 enum

<code src='./demo/enum.jsx' />

## 使用 searchApi

<code src='./demo/searchApi.jsx' />

基本上写一个 search table，你需要

```js
import { ProTable, Search, TableContainer, useTable } from '@ali/table-render';
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
