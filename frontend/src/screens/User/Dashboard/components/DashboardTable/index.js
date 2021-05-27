import { Box } from '@material-ui/core';

import { EmoneyTable } from 'components';
import DashboardTableHeader from './header';

const DashboardTable = ({
  title,
  items,
  columns,
  filterState,
  onFilter,
  withCountSelection,
  loadingPromise,
  sizePerPage = 5,
  ...props
}) => {
  return (
    <Box>
      <DashboardTableHeader
        title={title}
        filterState={filterState}
        onFilter={onFilter}
        withCountSelection={withCountSelection}></DashboardTableHeader>
      <EmoneyTable
        data={items || []}
        columns={columns}
        loadingPromise={loadingPromise}
        sizePerPage={sizePerPage}
      />
    </Box>
  );
};

export default DashboardTable;
