import React, { Fragment, useState } from 'react';
// Components
import { withMemo } from 'components/HOC';
import {
  TransactionListHeader,
  TransactionListTable,
  TransactionDetailDrawer
} from './components';

const TransactionList = ({
  transactionList,
  data,
  onChangedFilter,
  onSearchTextChange,
  onChangedPaginationState,
  columns,
  isGrouping,
  loadingPromise,
  onCalcAmountOptionChange,
  onOpenDrawer,
}) => {
  const [selectedRow, setSelectedRow] = useState({});
  // drawer flag for transaction detail info
  const [openDrawer, setOpenDrawer] = React.useState(false);

  /**
   * Handler for selecting transaction item
   */

  const onSelectTransactionItem = React.useCallback((row) => {
    // Show transaction detail drawer
    setOpenDrawer(true);
    setSelectedRow(row);
  }, []);

  
  return (
    <Fragment>
      <TransactionListHeader
        onChangedFilter={onChangedFilter}
        onSearchTextChange={onSearchTextChange}
        onCalcAmountOptionChange={onCalcAmountOptionChange}
        onOpenDrawer={onOpenDrawer}
      />
      <TransactionListTable
        list={transactionList || { list: [], totalCount: 0 }}
        onSelectTransactionItem={onSelectTransactionItem}
        onChangedPaginationState={onChangedPaginationState}
        columns={columns}
        isGrouping={isGrouping}
        loadingPromise={loadingPromise}
      />
      <TransactionDetailDrawer
        drawerOpen={openDrawer}
        close={() => setOpenDrawer(false)}
        description={data.description}
        selectedRow={selectedRow}
      />
    </Fragment>
  );
};

export default withMemo(TransactionList);
