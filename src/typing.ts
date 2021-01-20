import { ColumnsType } from 'antd/lib/table';

export interface ProTableProps {
  columns: ColumnsType;
  headerTitle?: string | React.ReactNode;
  toolbarRender?: string | React.ReactNode[];
}
