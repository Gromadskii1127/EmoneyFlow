import { Table } from '@devexpress/dx-react-grid-material-ui';
import Skeleton from '@material-ui/lab/Skeleton';
import { get } from 'lodash';
// Project Component
import { withMemo } from 'components/HOC';
const TableContentCell = ({ row, column, value, isLoading }) => {
  if (isLoading) {
    return (
      <Table.Cell>
        <Skeleton style={{ height: 36 }} variant="text" />
      </Table.Cell>
    );
  }

  const cellFn = get(column, 'Cell');
  const content = cellFn ? cellFn(row, column, value) : value;
  return <Table.Cell>{content}</Table.Cell>;
};
export default withMemo(TableContentCell);
