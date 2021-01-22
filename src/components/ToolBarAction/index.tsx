import React from 'react';
import { Space } from 'antd';
import FullScreenIcon from './FullScreenIcon';
import DensityIcon from './DensityIcon';
import ReloadIcon from './ReloadIcon';

const ToolBar = props => {
  return (
    <Space size={14} style={{ fontSize: 16, cursor: 'pointer' }}>
      <ReloadIcon />
      <DensityIcon />
      <FullScreenIcon {...props} />
    </Space>
  );
};

export default ToolBar;
