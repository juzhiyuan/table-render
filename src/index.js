import React, { forwardRef, useImperativeHandle } from 'react';
import { useSet, useTable } from './hooks';
import { Ctx } from './context';
import Search from './Search';
import ProTable from './ProTable';
import CardList from './CardList';
import { message, ConfigProvider } from 'antd';
import { isObj } from './utils';
import _get from 'lodash.get';
import zhCN from 'antd/es/locale/zh_CN';
import 'antd/dist/antd.css'; // 需要配置一下babel-plugins
import './index.css';

const useTableRoot = props => {
  const [state, set] = useSet({
    loading: false,
    search: {}, // 选项data
    searchApi: props.searchApi,
    tab: 0, // 如果searchApi是数组，需要在最顶层感知tab，来知道到底点击搜索调用的是啥api
    dataSource: [],
    pagination: {
      current: 1,
      pageSize: props.pageSize || 10,
      total: 1,
    },
  });

  const { pagination, search, searchApi, tab: currentTab } = state;

  const doSearch = params => {
    const { current, pageSize, tab } = params || {};
    const _current = current || 1;
    const _pageSize = pageSize || 10;
    let _tab = currentTab;
    if (['string', 'number'].indexOf(typeof tab) > -1) {
      _tab = tab;
    }
    // console.log(params, { _current, _pageSize, _tab }, 'searchParams');
    const _pagination = { current: _current, pageSize: _pageSize };
    if (typeof searchApi === 'function') {
      basicSearch(searchApi);
    } else if (Array.isArray(searchApi)) {
      const _searchApi = _get(searchApi, `[${_tab}].api`);
      if (typeof _searchApi === 'function') {
        basicSearch(_searchApi);
      } else {
        message.warning('searchApi 不是函数，检查 <TableContainer /> 的 props');
      }
    } else {
      message.warning('searchApi 不是函数，检查 <TableContainer /> 的 props');
    }

    function basicSearch(searchApi) {
      set({ loading: true });
      let _params = { ...search, ..._pagination };
      if (props.params && isObj(props.params)) {
        _params = { ..._params, ...props.params };
      }
      Promise.resolve(searchApi(_params))
        .then(res => {
          // TODO：这里校验res是否规范
          const { rows, total, pageSize } = res;
          set({
            loading: false,
            dataSource: rows,
            pagination: {
              ..._pagination,
              total,
              pageSize: pageSize || _pageSize,
            },
          });
        })
        .catch(err => {
          console.log(err);
          set({ loading: false });
        });
    }
  };

  const refresh = params => {
    const _stay = (params && params.stay) || false;
    const _tab = params && params.tab;
    doSearch({
      current: _stay ? pagination.current : 1,
      tab: _tab,
      pageSize: pagination.pageSize,
    });
  };

  const changeTab = tab => {
    if (['string', 'number'].indexOf(typeof tab) > -1) {
      set({ tab });
      refresh({ tab });
    } else {
      console.error('changeTab的入参必须是number或string');
    }
  };

  const context = {
    tableState: state,
    setTable: set,
    doSearch,
    refresh,
    changeTab,
  };
  return context;
};

const Container = (props, ref) => {
  const context = useTableRoot(props);

  useImperativeHandle(ref, () => context);

  return (
    <ConfigProvider locale={zhCN}>
      <Ctx.Provider {...props} value={context} />
    </ConfigProvider>
  );
};

const TableContainer = forwardRef(Container);

export { Search, ProTable, CardList, TableContainer, useTable };
