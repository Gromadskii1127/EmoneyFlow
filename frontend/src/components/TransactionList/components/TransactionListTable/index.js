import React, { useEffect, useState, useCallback } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
// Components
import { EmoneyTable } from 'components';
import SubHeader from './header';

// Actions
import { DEFAULT_PAGNATION_COUNT } from 'constant';

const TransactionListTable = ({
  list,
  dispatch,
  onSelectTransactionItem,
  intl,
  onChangedPaginationState,
  columns,
  isGrouping,
  loadingPromise
}) => {
  const [sizePerPage, setSizePerPage] = useState(DEFAULT_PAGNATION_COUNT);
  const [currentPage, setCurrentPage] = useState(0);

  const handleRefreshTableHandler = useCallback((page, sizePerPage) => {
    setSizePerPage(sizePerPage);
    setCurrentPage(page);
  }, []);

  const handleSelectRow = React.useCallback(
    async (row, event) => {
      if (onSelectTransactionItem) {
        onSelectTransactionItem(row);
      }
    },
    [onSelectTransactionItem]
  );

  useEffect(() => {
    if (onChangedPaginationState)
      onChangedPaginationState(sizePerPage, currentPage);
  }, [sizePerPage, currentPage, onChangedPaginationState]);

  return (
    <EmoneyTable
      data={list.list}
      columns={columns}
      isGrouping={isGrouping ? isGrouping : false}
      grouping={{
        field: 'date'
      }}
      isSelectable={true}
      onSelected={handleSelectRow}
      totalCount={list.totalCount}
      isPagination={true}
      isSubHeader={true}
      onRefreshPage={handleRefreshTableHandler}
      currentPage={currentPage}
      sizePerPage={sizePerPage}
      loadingPromise={loadingPromise}
      subHeader={<SubHeader 
        calcAmount={list?.calcAmount || {}} 
        isShow={Object.keys(list?.calcAmount || {}).length > 0}        
        />}
      className="trans-table"
    />
  );
};

TransactionListTable.propTypes = {
  // Transction list data
  list: PropTypes.object.isRequired,
  // Handler for selecting transaction list item.
  onSelectTransactionItem: PropTypes.func.isRequired
};

const state = createStructuredSelector({});
export default connect(state)(injectIntl(TransactionListTable));
