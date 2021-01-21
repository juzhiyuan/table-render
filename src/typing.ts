import { ColumnsType, TablePaginationConfig } from 'antd/lib/table';

export interface ProTableProps {
  columns: ColumnsType;
  headerTitle?: string | React.ReactNode;
  toolbarRender?: () => React.ReactNode[];
  toolbarAction?: boolean;
  dataSource?: any;
  pagination?: TablePaginationConfig;
}
