import React, { useEffect, useRef, useState } from 'react';
import { useTable } from './hooks';
import { Button } from 'antd';
import SearchForm from 'form-render/lib/antd';

const SearchBtn = ({ clearSearch }) => {
  const { tableState = {}, refresh } = useTable();
  const { loading } = tableState;
  return (
    <div className="flex justify-end w-100">
      <Button
        loading={loading}
        className="mr"
        type="primary"
        onClick={() => refresh()} // 必须要这么写，否则会把 e 作为 params 传入
      >
        查询
      </Button>
      <Button onClick={clearSearch}>重置</Button>
    </div>
  );
};

const Search = props => {
  const [formSchema, setSchema] = useState({});
  const { tableState, setTable, refresh } = useTable();
  const { search } = tableState;
  const _schema = props.schema || props.propsSchema;
  const modifiedSchema = useRef();
  const sref = useRef(); // 搜索组件的ref

  const SearchBtnRender = props.searchBtnRender;

  const onChange = newSearch => {
    setTable({ search: newSearch });
  };
  // TODO: 重新检查一下这个逻辑
  const calcWidth = schema => {
    try {
      let width = 100;
      const wList = Object.values(schema.properties)
        .filter(v => v['ui:hidden'] !== true)
        .map(v => v['ui:width']);
      const idx = wList.lastIndexOf(undefined);
      const effectiveList = wList
        .slice(idx + 1)
        .map(item => Number(item.substring(0, item.length - 1)));
      const len = effectiveList.reduce((a, b) => {
        const sum = a + b;
        if (sum > 100) return Math.min(100, b);
        return sum;
      }, 0);
      width = 100 - len;
      if (width < 10) {
        // 如果剩下太少了，就换行
        width = 100;
      }
      return width + '%';
    } catch (err) {
      console.error(err);
      return '100%';
    }
  };

  // 给schema里拼接一个buttons
  const modifySchema = () => {
    const noDiff =
      JSON.stringify(modifiedSchema.current) === JSON.stringify(_schema);
    if (_schema && _schema.properties) {
      if (formSchema && noDiff) return;
      try {
        const curSchema = JSON.parse(JSON.stringify(_schema));
        curSchema.properties.searchBtn = {
          'ui:widget': 'searchBtn',
          'ui:className': 'search-btn',
          'ui:width': calcWidth(_schema),
        };
        setSchema(curSchema);
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error(
        'SearchForm 传入了非法的 schema，参考文档: https://x-render.gitee.io/form-render/config/schema',
      );
    }
  };

  const clearSearch = () => {
    sref.current && sref.current.resetData({});
  };

  useEffect(() => {
    if (!props.hidden) {
      modifySchema();
    }
  }, [_schema]);

  const onMount = () => {
    refresh();
  };

  useEffect(() => {
    if (props.hidden) {
      onMount();
    }
  }, []);

  if (props.hidden) return null;

  return (
    <div
      className="tr-search"
      onKeyDown={e => {
        if (e.keyCode === 13) {
          refresh();
        }
      }}
    >
      <SearchForm
        ref={sref}
        {...props}
        schema={formSchema}
        formData={search}
        onChange={onChange}
        onMount={onMount}
        displayType="row"
        widgets={{
          searchBtn: () =>
            props.searchBtnRender ? (
              <div className="flex justify-end w-100">
                {props.searchBtnRender(refresh, clearSearch)}
              </div>
            ) : (
              <SearchBtn clearSearch={clearSearch} />
            ),
          ...props.widgets,
        }}
      />
    </div>
  );
};

export default Search;
