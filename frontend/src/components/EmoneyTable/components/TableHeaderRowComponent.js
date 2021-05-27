import {
  TableHeaderRow,
} from '@devexpress/dx-react-grid-material-ui';
// Project Component
import { withMemo } from 'components/HOC';
const TableHeaderRowComponent = ({issubheader, subheader, columncount, ...props}) => {    

  return (
    <>
      <TableHeaderRow.Row {...props} className="emoney-header-row" />
      {
        issubheader && (
          <tr>
            <td colSpan={columncount.toString()} className="emoney-subheader-row">
              {subheader}
            </td>
          </tr>
        )
      }
    </>
  );
};
export default withMemo(TableHeaderRowComponent);
