import React from 'react';
import { useTable } from './hooks';
import { Card } from 'antd';

const CardRender = props => {
  if (props.dataSource) {
    console.error(
      '设置table-render的数据请使用searchApi，具体使用可参考：https://form-render.github.io/table-render/guide/demo#%E5%9F%BA%E6%9C%AC-demo',
    );
  }
  const { tableState, setTable, doSearch } = useTable();
  const { dataSource, pagination, loading, searchApi } = tableState;

  const onPageChange = (page, pageSize) => {
    setTable({ pagination: { ...pagination, current: page } });
    doSearch({ current: page });
  };
  const { headerTitle, toolbarRender, columns } = props;
  return (
    <div>
      <div>hello</div>
    </div>
  );
};
export default CardRender;
