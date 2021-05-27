import {
  Table,
} from '@devexpress/dx-react-grid-material-ui';

// Project Components
import { withMemo } from 'components/HOC';
const TableStubCell = (props) => {
  return <Table.StubCell {...props} className="emoney-group-row-stub-cell"/>;
};
export default withMemo(TableStubCell);