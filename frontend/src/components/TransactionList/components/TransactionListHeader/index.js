import React, { useEffect } from 'react';
import { injectIntl } from 'react-intl';
// Components
import { withMemo } from 'components/HOC';
import TransactionFilterIcon from 'components/TransactionList/components/TransactionFilterIcon';
import TransactionFilterPane from 'components/TransactionList/components/TransactionFilterPane';
import { PageFilterHeader } from 'components';

const TransactionListHeader = ({ intl, onChangedFilter, onSearchTextChange, onCalcAmountOptionChange, onOpenDrawer }) => {
  const [openFilter, setOpenFilter] = React.useState(false);
  /**
   * Handler when click filter icon
   */
  const onOpenFilter = React.useCallback((open) => {
    // TODO: implement filter settings collpase
    setOpenFilter((prev) => !prev);
  }, []);

  /**
   * handler when search text changed on blur event
   */

  useEffect(() => {    
    if (onOpenDrawer) {
      onOpenDrawer(openFilter);
    }
  }, [openFilter, onOpenDrawer])

  return (
    <React.Fragment>
      <PageFilterHeader
        pageTitleId="admin.transaction.title"
        onSearchTextChange={onSearchTextChange}
        customButton={<TransactionFilterIcon onOpenFilter={onOpenFilter} />}
        customPane={<TransactionFilterPane checked={openFilter} onChangedFilter={onChangedFilter} onCalcAmountOptionChange={onCalcAmountOptionChange}/>}
      />
    </React.Fragment>
  );
};

TransactionListHeader.propTypes = {};

export default injectIntl(withMemo(TransactionListHeader));
