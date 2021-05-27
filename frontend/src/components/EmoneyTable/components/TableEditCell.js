import {Fragment} from 'react';
import {
  TableEditRow
} from '@devexpress/dx-react-grid-material-ui';
import { withMemo } from 'components/HOC';
import { get } from 'lodash';

const TableEditCell = (props) => {    
  const CellCmp = get(props.column, 'EditingCell');
  if (CellCmp) {
    return (
      <Fragment>
        <CellCmp {...props}/>
      </Fragment>
    );
  }  
  return <TableEditRow.Cell {...props} />;
}
export default withMemo(TableEditCell);