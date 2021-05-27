import {
  TableGroupRow,
} from '@devexpress/dx-react-grid-material-ui';
import { withMemo } from 'components/HOC';
const GroupRowCellComponent = (props) => {
  return (
    <TableGroupRow.Cell {...props} className="emoney-group-row-cell" />
  );
};
export default withMemo(GroupRowCellComponent);