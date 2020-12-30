import React from 'react';
import { useTable } from './hooks';
import {
  Skeleton,
  Typography,
  Radio,
  Card,
  Empty,
  Pagination,
  Row,
  Col,
} from 'antd';
import { getDate, getDateTime, getMoneyType } from './utils';
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import './card.css';

const CardList = props => {
  if (props.dataSource) {
    console.error(
      '设置table-render的数据请使用searchApi，具体使用可参考：https://form-render.github.io/table-render/guide/demo#%E5%9F%BA%E6%9C%AC-demo',
    );
  }
  const { tableState, setTable, doSearch } = useTable();
  const { dataSource, pagination, loading, searchApi } = tableState;

  const onPageChange = (page, pageSize) => {
    setTable({ pagination: { ...pagination, current: page, pageSize } });
    doSearch({ current: page, pageSize });
  };

  const {
    headerTitle,
    toolbarRender,
    paginationOptions,
    onCardClick,
    cardRender,
  } = props;

  if (!cardRender) {
    console.error('请根据文档填入正确的contentRender');
  }

  const { header, content, footer } = cardRender;

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
      {dataSource.length ? (
        <div className="card-list">
          {dataSource.map((card, index) => (
            <Col key={index.toString()} span={6} className="card-render">
              <Card
                title={card[header.title.dataIndex || header.title]}
                hoverable={true}
                style={{ width: card.width || '100%', display: 'inline-block' }}
                onClick={() => onCardClick(card, index)}
                extra={header && header.extra && header.extra(card, index)}
                actions={footer && footer(card, index)}
              >
                {content && content.description && (
                  <Typography.Paragraph
                    style={{
                      color: 'rgba(0,0,0,.45)',
                      marginBottom: '8px',
                    }}
                    ellipsis={{ rows: 1 }}
                  >
                    {card[content.description.dataIndex || content.description]}
                  </Typography.Paragraph>
                )}
                {content && content.list && listRender(card, content.list)}
                {content && content.remark && (
                  <Typography.Paragraph
                    style={{
                      color: 'rgb(102, 102, 102)',
                      marginTop: '8px',
                      fontSize: 12,
                    }}
                    ellipsis={{ rows: 1 }}
                  >
                    {card[content.remark.dataIndex || content.remark]}
                  </Typography.Paragraph>
                )}
              </Card>
            </Col>
          ))}
        </div>
      ) : (
        <Empty />
      )}
      {!paginationOptions.hidden && (
        <Pagination
          size={paginationOptions.size || 'default'}
          style={{ textAlign: 'right' }}
          total={pagination.total}
        />
      )}
    </div>
  );
};

export default CardList;

const listRender = (card, content) => {
  return content.map((item, idx) => {
    if (item.render && typeof item.render === 'function') {
      return (
        <div key={idx.toString()}>
          <Row>
            <Col span={6}>
              <span>{item.title}</span>:
            </Col>
            <Col>
              <span>{item.render(item, idx)}</span>
            </Col>
          </Row>
        </div>
      );
    }

    return (
      <div key={idx.toString()}>
        <Row>
          {item.title && (
            <Col span={6}>
              <span>{item.title}</span>:
            </Col>
          )}
          <Col>
            <span>
              {typeof item === 'string' ? card[item] : card[item.dataIndex]}
            </span>
          </Col>
        </Row>
      </div>
    );
  });
};

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
      <Radio.Group onChange={onTabChange} value={_tab}>
        {searchApi.map((item, i) => {
          return (
            <Radio.Button key={i.toString()} value={i}>
              {item.name}
            </Radio.Button>
          );
        })}
      </Radio.Group>
    );
  }
  return <div className="tr-single-tab" />; // 给一个空的占位
};
