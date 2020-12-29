import React, { useRef } from 'react';
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { CardList, Search, TableContainer, useTable } from 'table-render';
import request from 'umi-request';
import dayjs from 'dayjs';

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
  return request
    .get(
      'https://www.fastmock.site/mock/62ab96ff94bc013592db1f67667e9c76/getTableList/api/getCardList',
      { params },
    )
    .then(res => {
      console.log('response:', res);
      if (res && res.data) {
        return { rows: res.data, total: res.data.length }; // 注意一定要返回 rows 和 total
      }
    })
    .catch(e => console.log('Oops, error', e));
};

const contentRenderFunc = (item, idx) => {
  return (
    <>
      <p>{item.creator}</p>
      <p>{item.createTime}</p>
    </>
  );
};

const cardRenderOptions = {
  header: {
    title: (card, index) => card.title,
    extra: (card, index) => (
      <a
        onClick={e => {
          e.stopPropagation();
          alert(card, index);
        }}
      >
        action
      </a>
    ),
  },
  content: {
    description: (card, index) => card.description,
    list: [
      {
        title: '创建者',
        dataIndex: 'creator',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        render: (card, index) => (
          <span>{dayjs(card.createTime).format('YYYY-MM-DD')}</span>
        ),
      },
    ],
  },
  footer: (card, index) => [
    <SettingOutlined key="setting" />,
    <EditOutlined key="edit" />,
    <EllipsisOutlined key="ellipsis" />,
  ],
};

const Demo = () => {
  const tableRef = useRef();
  return (
    <div style={{ background: 'rgb(245,245,245)' }}>
      <TableContainer ref={tableRef} searchApi={searchApi}>
        <Search schema={schema} />
        <CardList
          onCardClick={(item, idx) => alert(JSON.stringify(item))}
          cardRender={cardRenderOptions}
          paginationOptions={{ size: 'default' }}
        />
      </TableContainer>
    </div>
  );
};

export default Demo;
