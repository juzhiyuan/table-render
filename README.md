# Table Render

## 简介

1. [设计文档](https://yuque.antfin-inc.com/nasa.wy/rx1nh9/ildeyo)
2. [更新日志](http://gitlab.alibaba-inc.com/one-sdk/table-render/blob/master/CHANGELOG.md)

## 使用方法

```
tnpm i -S @ali/table-render
```

```js
import React from 'react';
import TableRender from '@ali/table-render';
import '@ali/table-render/dist/index.css';
import * as api from './api'; // 见源码的 src/api.js 文件

// 可以使用schema编辑器生成 https://form-render.github.io/schema-generator/
const searchSchema = {
  propsSchema: {
    type: 'object',
    properties: {
      position: {
        title: '职级',
        type: 'string',
        enum: ['p5', 'p6', 'p7', 'p8', 'p9'],
        'ui:width': '20%',
      },
      name: {
        title: '姓名',
        type: 'string',
        'ui:width': '20%',
      },
      address: {
        title: '地址',
        type: 'string',
        'ui:width': '60%',
      },
      tags: {
        title: '标签',
        description: '下拉多选',
        type: 'array',
        items: {
          type: 'string',
        },
        enum: ['a', 'b', 'c', 'd'],
        enumNames: ['在杭', '单身', '95后', '土豪'],
        'ui:widget': 'multiSelect',
        'ui:width': '40%',
      },
      dateRange: {
        title: '日期范围',
        type: 'range',
        format: 'dateTime',
        'ui:options': {
          placeholder: ['开始时间', '结束时间'],
        },
        'ui:width': '45%',
      },
    },
  },
  displayType: 'row',
  showDescIcon: true,
  labelWidth: 80,
};

const columns = [
  {
    title: 'Name',
    key: 'name',
    dataIndex: 'name',
    widget: 'link',
  },
  {
    title: 'Age',
    key: 'age',
    dataIndex: 'age',
  },
  {
    title: 'Address',
    key: 'address',
    dataIndex: 'address',
  },
  {
    title: '类型',
    key: 'type',
    dataIndex: 'type',
    enum: {
      basketball: '篮球',
      football: '足球',
      tennis: '网球',
    },
  },
  {
    title: '状态',
    key: 'status',
    dataIndex: 'status',
    widget: 'status',
  },
];

const schema = {
  searchConfig: {
    schema: searchSchema,
    // initialValue: {}, // 选填
    tab: 0, // 选填。选中的tab，如果没有多个，这个参数不要填，相对的api使用对象形式
    api: [
      { text: '全部', action: '$api.getAllData' },
      { text: '我的', action: '$api.getData' },
    ], // api: {text: '展示的text(可以为空字符串)', action: '$api.getData' }  当只有一个值的时候
  },
  columns,
  actionList: [
    { text: '配置', action: '$api.openSettings' },
    { text: '删除', action: '$api.deleteRow' },
    { text: '删除', action: '$api.deleteRow', disabled: '$api.disableDelete' },
    { text: '删除', action: '$api.deleteRow' },
    { text: '删除', action: '$api.deleteRow' },
  ],
  buttonMenu: [
    { text: '添加', action: '$api.addRow' },
    { text: '扩展', action: '$api.extend' },
  ], // 添加按钮默认放在第一位

  // 在此填写所有 table 的 props，antd的都支持
  rowKey: 'key',
  // 其中 pagination 里的参数会和内部的默认配置合并
  pagination: { showTotal: total => `共 ${total} 个页面` },
};

const Demo = () => {
  return (
    <div style={{ background: '#f2f2f2', padding: 12 }}>
      <TableRender
        schema={schema}
        api={api}
        widgets={{ link: text => <a>{text}</a> }}
      />
    </div>
  );
};

export default Demo;
```

![](https://img.alicdn.com/tfs/TB1c1KhKHj1gK0jSZFuXXcrHpXa-1010-666.png)

api 文件的写法可参考项目 src 目录下 api.js

## 约定说明：

使用 tableRender 时有如下几个重要约定：

1. `columns`。`columns` 除了 antd 的基础写法，还支持 `widget` 和 `enum` 参数, widget 对应内部实现的或者自定义的 cell 的展示类型，目前支持 status, dateTime, date, tooltip， enum 为一个数据字典，用于将返回值的 key 在显示是转换成对应的 value（见上面的例子）

2. `search`。`search.api` 里的`$api.xxx`的返回信息**一定要**这个格式: (搜索项，页面信息) => { data: [ ... ], pageSize: 15, total: 200 } 注意返回值必须遵循此格式：data(返回的列表数据), pageSize(选填), total(必填)

3. `actionList`。`actionList`里的`$api.yyy`自动会接受入参：(record, refresh) => { ... } record 为点击行的信息（通 antd），refresh 为刷新函数，可直接用于在适当位置执行： refresh();

4. `buttonMenu`。`buttonMenu`里的`$api.zzz`自动会接受入参：(data, refresh) => { ... } data 为整个 table 的数据，refresh 为刷新函数

5. 可使用 ref 获取 Table 的方法 refresh：

```js
const Demo = () => {
  const tableRef = useRef();

  const handleClick = () => {
    tableRef.current.refresh();
  };

  return (
    <div>
      <button onClick={handleClick}>刷新</button>
      <TR
        ref={tableRef}
        schema={schema}
        api={api}
        widgets={{ link: text => <a>{text}</a> }}
      />
    </div>
  );
};
```

## 如何开发

```sh
# 调试
npm start
# 发布
npm run publish
# 发布beta版本
npm run beta
```

beta 版本的 version 名规范： "version": "0.3.3-beta.0" (package.json)

## 一些 api 设计上的思考和抉择

Q: 为啥把 refresh 传给用户啊？我能否不感知刷新，table-render 直接在我的操作后自动刷新吗？  
A: table 上很多操作都是异步的，如果不进一步和用户约定 action 的写法，TR 这侧就很难感知啥时候是执行 refresh 的时机

Q: 我不喜欢某些设计，就比如 columns 怎么渲染，就不能按照 antd 设计的来么？写个 render 不就好了？  
A: 不满意的地方欢迎提 issue。所有 antd 的 props 都是透传的，所以事实上可以**完全按照 antd 的方式来写的**。schema 很多设计决定考虑的是对标准的 JSON 格式支持（内部无函数、元素等），便于服务端控制和传输。
