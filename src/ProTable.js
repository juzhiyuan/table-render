import React from 'react';
import { useTable } from './hooks';
import { Table, Radio } from 'antd';
import { getDate, getDateTime, getMoneyType } from './utils';
import { renderDom } from './field';

const ProTable = props => {
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

  columns.map(item => {
    const result = item;
    // 用户在columns中自定义的render会覆盖tr的预设render
    if (result.render) return result;

    switch (result.valueType) {
      case 'date':
        result.render = value => renderDom(getDate(value), result);
        break;
      case 'dateTime':
        result.render = value => renderDom(getDateTime(value), result);
        break;
      case 'money':
        result.render = value => renderDom(getMoneyType(value), result);
        break;
      case 'text':
      default:
        result.render = value => renderDom(value, result);
    }
    return result;
  });
  const tableProps = {
    ...props,
    // 底下这些值全局控制，不准在使用ProTable时用props赋值
    dataSource,
    pagination: {
      onChange: onPageChange,
      size: 'small',
      ...props.pagination,
      pageSize: pagination.pageSize,
      total: pagination.total,
      current: pagination.current,
    },
    loading,
  };

  const toolbarArray =
    typeof toolbarRender === 'function' ? toolbarRender() : [];
  const showTableTop = headerTitle || toolbarRender || Array.isArray(searchApi);
  return (
    <div className="tr-table-wrapper">
      {
        <div className={showTableTop ? 'tr-table-top' : 'tr-table-top-nohead'}>
          <div className="tr-table-title">
            <TableTitle title={headerTitle} />
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
            }}
          >
            {Array.isArray(toolbarArray)
              ? toolbarArray.map((ui, idx) => {
                  return (
                    <div key={idx.toString()} style={{ marginLeft: 8 }}>
                      {ui}
                    </div>
                  );
                })
              : null}
          </div>
        </div>
      }
      <Table {...tableProps} />
    </div>
  );
};

export default ProTable;

const TableTitle = ({ title }) => {
  const { tableState, setTable, doSearch } = useTable();
  const { tab, searchApi } = tableState;
  const _tab = tab || 0;
  const onTabChange = e => {
    const _tab = e.target.value;
    setTable({ tab: _tab });
    doSearch({ tab: _tab });
  };

  if (typeof searchApi === 'function')
    return <div className="tr-single-tab">{title}</div>;
  if (searchApi && Array.isArray(searchApi)) {
    if (searchApi.length === 1)
      return <div className="tr-single-tab">{searchApi[0].name}</div>;
    return (
      <Radio.Group onChange={onTabChange} defaultValue={_tab.toString()}>
        {searchApi.map((item, i) => {
          return (
            <Radio.Button key={item.name} value={i.toString()}>
              {item.name}
            </Radio.Button>
          );
        })}
      </Radio.Group>
    );
  }
  return <div className="tr-single-tab" />; // 给一个空的占位
};
