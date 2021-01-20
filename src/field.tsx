import { message, Tooltip, Typography } from 'antd';

export const renderEllipsis = (dom, text, item) => {
  if (!item.ellipsis) {
    return <span>{dom}</span>;
  }
  return <Tooltip title={getEnumValue(text, item)}>{dom}</Tooltip>;
};

export const renderCopyable = (text, item) => {
  if (item.copyable || item.ellipsis) {
    return (
      <Typography.Text
        style={{
          maxWidth: '100%',
          margin: 0,
          padding: 0,
        }}
        copyable={
          item.copyable && text
            ? {
                text,
                onCopy: () => message.success('复制成功'),
              }
            : undefined
        }
        ellipsis={item.ellipsis || false}
      >
        {getEnumValue(text, item)}
      </Typography.Text>
    );
  }
  return getEnumValue(text, item);
};

export const getEnumValue = (text, item) => {
  const valueEnum = item.enum || undefined;
  return valueEnum && valueEnum[text] ? valueEnum[text] : text;
};

// 渲染单元格
export const renderDom = (val, item) => {
  const copyHoc = renderCopyable(val, item);
  const ellipsisHoc = renderEllipsis(copyHoc, val, item);
  return ellipsisHoc;
};
