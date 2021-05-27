import {
  TableGroupRow,
} from '@devexpress/dx-react-grid-material-ui';

//Project Components
import { withMemo } from 'components/HOC';
const GroupRowComponent = (props) => {  
  return (
    <TableGroupRow.Row {...props} className="emoney-group-row" />
  );
};
export default withMemo(GroupRowComponent);