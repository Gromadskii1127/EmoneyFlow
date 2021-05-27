import { TableHeaderRow } from '@devexpress/dx-react-grid-material-ui';
import { withMemo } from 'components/HOC';
import { get } from 'lodash';
const TableHeaderCell = (props) => {
  const Cell = get(props.column, 'HeaderCell');
  const newProps = { ...props };

  // add width to table column
  newProps.width = props.column.width || '10%';

  if (Cell) {
    return (
      <TableHeaderRow.Cell  {...newProps}  >
        <Cell {...newProps}/>
      </TableHeaderRow.Cell>
    );
  } else {
    return (
      <TableHeaderRow.Cell
        {...newProps}        
        className="emoney-group-row-stub-cell"
      />
    );
  }
};
export default withMemo(TableHeaderCell);
