import React from 'react';
import PropTypes from 'prop-types';
// Components
import { Box } from '@material-ui/core';
import { withMemo } from 'components/HOC';
import TransactionSearchFilter from 'components/TransactionList/components/TransactionSearchFilter';
import TransactionFilterIcon from 'components/TransactionList/components/TransactionFilterIcon';

const TransactionSearchFilterContainer = ({
  onOpenFilter,
  onSearchTextChange,  
}) => {
  return (
    <Box
      flex={1}
      display="flex"
      flexDirection="row"
      justifyContent="space-between">
      <Box width={600} display="flex" flexDirection="row" justifyContent="flex-end">
        <TransactionSearchFilter onSearchTextChange={onSearchTextChange}/>
      </Box>
      <TransactionFilterIcon onOpenFilter={onOpenFilter} />
    </Box>
  );
};

TransactionSearchFilterContainer.propTypes = {
  // handler when click filter icon
  onOpenFilter: PropTypes.func.isRequired,
  // handler when blur the text fiedl
  onSearchTextChange: PropTypes.func.isRequired
};

export default withMemo(TransactionSearchFilterContainer);
