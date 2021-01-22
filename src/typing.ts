import { ColumnsType, TablePaginationConfig, TableProps } from 'antd/lib/table';

export interface ProTableProps {
  headerTitle?: string | React.ReactNode;
  toolbarRender?: () => React.ReactNode[];
  toolbarAction?: boolean;
  dataSource?: any;
  pagination?: any;
  style?: any;
  className?: string;
  columns?: ColumnsType;
}
